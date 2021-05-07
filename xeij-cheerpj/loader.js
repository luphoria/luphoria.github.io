// Copyright 2017-2019 Leaning Technologies Ltd
var hSlot = 0;
var sSlot = null;
var cjStatus = "";
var cjLateStatus = true;
var cjClassFilesTracer = null;
var cjInitDone = 0;
var cjListener = null;
var cheerpjJarJsOverridePath = null;
var cjIsWorker = !self.window;
var cjLogCanvasUpdates = 0;
var cjInitTimeStamp = -0;
var cjClipboardMode = "java";
var cjEnableInputMethods = 0;
var cjEnablePreciseClassLoaders = 0;
var cjEnablePreciseAppletArchives = 0;
var cjMacOSPlatform = false;
var cjReflectionClasses = null;
var cjDisplay = null;
var cjLocation = location;
var label;

var continuationBuffer = new Int8Array(4096);

function writeContinuationFunction(func, args, first)
{
	var pc = 0;
	var vars = "";
	// HACK: The implementation for jsr still sends the PC as the second arg
	if(typeof(args) == "number")
		var pc = args | 0;
	else
	{
		// Read all local variables from the stacklet
		for(var p in args)
		{
			if(p=="pc")
			{
				var pc = args[p];
				continue;
			}
			else if(p =="f")
				continue;
			vars += "var "+p+"=a."+p+";";
		}
	}
	var code = func.toString();
	// Generate a Int8Array for C++ implementation
	if(continuationBuffer.length < code.length)
		continuationBuffer = new Int8Array(code.length);
	for(var i=0;i<code.length;i++)
		continuationBuffer[i] = code.charCodeAt(i);
	return writeContinuationFunctionImpl(code, continuationBuffer, code.length, pc, first, vars);
}

function cheerpjEncodeClassName(name)
{
	var mangledName = "N";
	var curStart = 0;
	var i = 0;
	while(i!=name.length)
	{
		if(name.charCodeAt(i) == /*'/'*/0x2f)
		{
			mangledName += (i-curStart|0) + name.substring(curStart,i);
			curStart = i+1|0;
		}
		i=i+1|0;
	}
	mangledName += (i-curStart|0) + name.substring(curStart,i);
	return mangledName;
}

function decodeClassName(name)
{
	var ret="";
	assert(name[0]=='N');
	var lastNameStart=1;
	var nameLength = 0;
	var charCodeO = 0x30;
	var charCode9 = 0x39;
	while(lastNameStart!=name.length)
	{
		var charCode = name.charCodeAt(lastNameStart);
		if(charCode >= charCodeO && charCode <= charCode9)
		{
			nameLength*=10;
			nameLength+=charCode - charCodeO;
			lastNameStart++;
			continue;
		}
		else if(nameLength == 0)
			return ret;
		// Length parsed, now extract the name
		var part = name.substr(lastNameStart, nameLength);
		lastNameStart += nameLength;
		nameLength = 0;
		if(ret.length)
			ret+='/';
		ret+=part;
	}
	return ret;
}

function buildContinuations(args, atGuard)
{
	if(args===null)
		return;
	var caller=args.f;
	if(args.p!==null)
		buildContinuations(args.p, false);
	var rewrittenCaller = writeContinuationFunction(caller, args, atGuard);
	try
	{
		var rewrittenFunc = new Function('a', 'b', "_"+caller.name, rewrittenCaller);
	}
	catch(e)
	{
		cjReportError("Rewriter error: "+caller.name+"/"+rewrittenCaller);
		throw e;
	}
	args.p=null;
	currentThread.continuationStack.push({func:rewrittenFunc,args:args});
}

var cjLoadedScripts = {}

function classLoadComplete(e)
{
	var script = e.target;
	var pendingName = script.pendingName;
	assert(cjLoadedScripts.hasOwnProperty(pendingName));
	var pendingList = cjLoadedScripts[pendingName];
	if(e.type == "error" && pendingName.startsWith("/lt/runtime/rt.jar."))
	{
		// Abuse the pendingList array to keep track of failures
		if(pendingList.failureCount)
			pendingList.failureCount++;
		else
			pendingList.failureCount=1;
		if(pendingList.failureCount > 5)
		{
			cjReportError("Core JS error "+e.target.src);
			return;
		}
		// Try again in 3 secs, make a new script element
		setTimeout(function()
		{
			var newScript = document.createElement("script");
			newScript.pendingName = script.pendingName;
			newScript.onload=classLoadComplete;
			newScript.onerror=classLoadComplete;
			newScript.src = script.src;
			script.parentNode.replaceChild(newScript, script);
		}, 3000);
		return;
	}
	for(var i=0;i<pendingList.length;i++)
	{
		var waitingThread = pendingList[i];
		assert(waitingThread.state == "WAIT_NET");
		waitingThread.state = "READY";
	}
	cjLoadedScripts[pendingName] = null;
	// onerror may be triggered immediately from the same thread, so avoid rescheduling
	if(currentThread != waitingThread)
		cheerpjSchedule();
	else
		debugger
}

function cheerpjReportJSLoadReason(loadedName, callback)
{
	var userFuncName = null;
	var directFuncName = null;
	var contStack = currentThread.continuationStack;
	for(var i=contStack.length-1;i>=0;i--)
	{
		var args = contStack[i].args;
		if(!args || !args.f)
			break;
		var curName = contStack[i].args.f.name;
		var curNameStart = curName[0];
		if(curNameStart != "_" && curNameStart != "N")
			continue;
		if(directFuncName == null)
		{
			if(curNameStart == "_")
				directFuncName = cheerpjDecompressSymbol(curName.substr(1));
			else
				directFuncName = curName;
		}
		else
		{
			var decompressedName = null;
			var classStart = 0;
			if(curNameStart == "_")
			{
				decompressedName = cheerpjDecompressSymbol(curName.substr(1));
				assert(decompressedName[0] == 'Z');
				classStart = 1;
			}
			else
			{
				decompressedName = curName;
			}
			// Extract the class name from the mangled string
			assert(decompressedName[classStart] == "N");
			var prevEnd = 0;
			var classEnd = 0;
			var curChar = classStart+1|0;
			var curLen = 0;
			var charCodeO = 0x30;
			var charCode9 = 0x39;
			var classPart = null;
			while(curChar < decompressedName.length)
			{
				var charCode = decompressedName.charCodeAt(curChar);
				if(charCode >= charCodeO && charCode <= charCode9)
				{
					curLen *= 10;
					curLen += charCode - charCodeO | 0;
					curChar++;
				}
				else if(curLen == 0)
				{
					if(charCode == 0x45/*E*/)
						classPart = decompressedName.substring(classStart, prevEnd);
					else
						classPart = decompressedName.substring(classStart, classEnd);
					break;
				}
				else
				{
					prevEnd = classEnd;
					curChar += curLen;
					curLen = 0;
					classEnd = curChar;
				}
			}
			var mangledClassName = classPart;
			var scriptName = cheerpjGetJSFromClassName(mangledClassName);
			if(scriptName && !scriptName.startsWith(loaderPath+"/runtime/"))
			{
				userFuncName = curName;
				break;
			}
		}
	}
	callback(loadedName, directFuncName == null ? "(Internal)" : directFuncName, userFuncName == null ? "(Internal)" : userFuncName);
}

function cjLoadScript(name, p)
{
	assert(typeof(p) != "undefined");
	if(!cjIsWorker)
		buildContinuations(p, false);
	if(cjLoadedScripts.hasOwnProperty(name))
	{
		var pending = cjLoadedScripts[name];
		assert(pending)
		pending.push(currentThread);
	}
	else
	{
		if(cjListener && cjListener.jsLoadReason)
		{
			cheerpjReportJSLoadReason(name, cjListener.jsLoadReason);
		}
		if(currentThread.threadObj)
			cheerpjCL = currentThread.threadObj.contextClassLoader9;
		if(cjPredictionsMap.hasOwnProperty(name))
			cheerpjPreloadOne(cjPredictionsMap[name]);
		if(name.startsWith("/"))
		{
			var mount = cheerpjGetFSMountForPath(name);
			if(!(mount instanceof CheerpJWebFolder))
			{
				if(cjIsWorker)
					return;
				else
					throw "CheerpJContinue";
			}
			var fileToLoad = mount.mapPath(mount, name.substr(mount.mountPoint.length-1));
		}
		else
			fileToLoad = name;
		if(cjIsWorker)
		{
			try
			{
				importScripts(fileToLoad);
			}
			catch(e)
			{
			}
			return;
		}
		var newScript = document.createElement("script");
		var pendingList = [currentThread];
		cjLoadedScripts[name] = pendingList;
		newScript.pendingName = name;
		newScript.onload=classLoadComplete;
		newScript.onerror=classLoadComplete;
		newScript.src = fileToLoad;
		document.head.appendChild(newScript);
	}
	currentThread.state = "WAIT_NET";
	throw "CheerpJContinue";
}

function cheerpjLoadJarPackage(jarPath, jarName, demangledName, p)
{
	var rtPackageList = cheerpjAOTPackages[jarName];
	for(var i=0;i<rtPackageList.length;i++)
	{
		if(!demangledName.startsWith(rtPackageList[i]))
			continue;
		var packageName = rtPackageList[i].split('/').join('.');
		var scriptName = jarPath + jarName +"."+packageName+"js";
		if(cjLoadedScripts.hasOwnProperty(scriptName) && cjLoadedScripts[scriptName]==null)
		{
			// Already loaded, give up
			return;
		}
		cjLoadScript(scriptName, p);
		return;
	}
}

function icjLoadWeakClass(name, p, allowMissing, cl)
{
	if(self.hasOwnProperty(name)){
		return;
	}
	// Very early in the loading process we don't have a threadObj yet
	if(!threads[0].threadObj || !threads[0].threadObj.contextClassLoader9)
	{
		var demangledName = decodeClassName(name);
		// Assume we need to load from the runtime
		return cheerpjLoadJarPackage("/lt/runtime/", "rt.jar", demangledName, p);;
	}
	// Attempt loading using the contextClassLoader for thread. This is incorrect, but ok for now
	var ctxLoader = cl ? cl : threads[0].threadObj.contextClassLoader9;
	if(ctxLoader)
	{
		assert(typeof(p) !== "undefined");
		var a = {f:icjLoadWeakClass,p:p,pc:0,s0:null,s1:name,allowMissing:allowMissing};
		var demangledName = decodeClassName(name).split('/').join('.');
		assert(demangledName.length);
		// loadClass
		a.pc=0;a.s0=ctxLoader.v13(ctxLoader,cjStringJsToJava(demangledName),0,a);
		if(a.s0){
			return;
		}
		debugger
		var name = a.s1;
	}
	cjLoadScript(decodeClassName(name)+".js", p);
}

function ecjLoadWeakClass(a, ex)
{
	// Intercept exceptions
	if(a.allowMissing)
		return true;
	else if(ex instanceof N4java4lang22ClassNotFoundException){
		// Convert to NoClassDefFoundError
		a.f=ecjLoadWeakClass;
		a.pc=0;cheerpjEnsureInitialized("N4java4lang20NoClassDefFoundError", a);
		var e=new N4java4lang20NoClassDefFoundError();
		e.detailMessage1=cjStringJsToJava(decodeClassName(a.s1));
		cheerpjThrow(a,e);
	}else{
		a.pc=-1;
	}
}

function runContinuationStack(ret)
{
	sSlot = currentThread.sSlot;
	try
	{
		while(currentThread.continuationStack.length)
		{
			var c = currentThread.continuationStack.pop();
			ret=c.func(c.args, ret);
			assert(currentThread.state == "RUNNING");
		}
		currentThread.retValue = ret;
	}
	catch(e)
	{
		// Special handling for null exceptions
		if(e instanceof TypeError)
		{
			assert(sSlot);
			currentThread.continuationStack.push({func: cjThrowNPE, args: {p:sSlot,f:cjThrowNPE,pc:0,stack:e.stack,ex:null,last:c.args}});
		}
		else if(e != "CheerpJContinue")
			throw e;
	}
	if(currentThread && currentThread.state == "RUNNING")
	{
		if(currentThread.continuationStack.length==0)
			currentThread.state = "PAUSED";
		else
		{
			currentThread.state = "READY";
		}
	}
	currentThread.sSlot = sSlot;
	sSlot = null;
	//cheerpjSchedule();
	currentThread = null;
}

function cheerpjPromiseAdapter()
{
	var resolveFunc = null;
	var rejectFunc = null;
	var ret = new Promise(function(s,j)
	{
		resolveFunc = s;
		rejectFunc = j;
	});
	ret.done = function(v) { ret.isDone = true; ret.value = v; resolveFunc(v) };
	ret.fail = rejectFunc;
	ret.isDone = false;
	ret.value = null;
	return ret;
}

function icheerpjPromiseResolve(a, b)
{
	a.promise.done(b);
	return b;
}

function echeerpjPromiseResolve(a, ex)
{
	var detailMessage = "";
	if(ex.detailMessage1)
		detailMessage += String.fromCharCode.apply(null, ex.detailMessage1.value0).substr(1);
	// Give the user time to add catches
	var p = a.promise;
	setTimeout(function() { p.fail(detailMessage); }, 0);
}

function cheerpjCreateInstance(className, methodName)
{
	var args = [].splice.call(arguments, 2);
	threads[0].continuationStack.unshift({func:function(args)
		{
			cheerpjEnsureInitialized(className, null);
		}, args: className});
	threads[0].continuationStack.unshift({func:cheerpjCreateInstanceFunc, args:{p:null, f: null, s0: null, className:className, args:args, methodName:methodName}});
	var promise = cheerpjPromiseAdapter();
	threads[0].continuationStack.unshift({func:icheerpjPromiseResolve, args:{pc:0,f:icheerpjPromiseResolve,promise:promise}});
	if(threads[0].state == "PAUSED")
		threads[0].state = "READY";
	cheerpjSchedule();
	return promise;
}

function cjPushArgs(dest, args)
{
	for(var i=0;i<args.length;i++)
	{
		var arg = args[i];
		if(typeof arg == "string")
			arg = cjStringJsToJava(arg);
		var unboxLong = false;
		if(arg instanceof CJBoxedLong)
		{
			unboxLong = true;
			arg = arg.value;
		}
		if(arg instanceof Promise)
		{
			assert(arg.isDone);
			arg = arg.value;
		}
		if(unboxLong)
		{
			dest.push(arg.value0);
			dest.push(arg.value0h);
			i++;
		}
		else
			dest.push(arg);
	}
}

function cheerpjCreateInstanceFunc(a)
{
	a.f=cheerpjCreateInstanceFunc;
	a.s0=new self[a.className];
	var args = a.args;
	var finalArgs = [a.s0];
	cjPushArgs(finalArgs, args);
	finalArgs.push(a);
	a.pc=0;(self[a.methodName]).apply(null,finalArgs);
	return a.s0;
}

function cheerpjRunMethod(boxLongs, obj, method)
{
	var args = [].splice.call(arguments, 3);
	threads[0].continuationStack.unshift({func:function(args)
		{
			if(obj instanceof Promise)
			{
				assert(obj.isDone);
				obj = obj.value;
			}
			var a = [obj];;
			cjPushArgs(a, args);
			a.push(null);
			return obj[method].apply(null,a)
		}, args:args});
	if(boxLongs)
		threads[0].continuationStack.unshift({func:cjBoxLong, args: null});
	var promise = cheerpjPromiseAdapter();
	threads[0].continuationStack.unshift({func:icheerpjPromiseResolve, args:{pc:0,f:icheerpjPromiseResolve,promise:promise}});
	if(threads[0].state == "PAUSED")
		threads[0].state = "READY";
	cheerpjSchedule();
	return promise;
}

function cheerpjRunResolvedMethod(boxLongs, method)
{
	var args = [].splice.call(arguments, 2);
	threads[0].continuationStack.unshift({func:function(args)
		{
			var a = [];;
			cjPushArgs(a, args);
			a.push(null);
			return self[method].apply(null,a)
		}, args:args});
	if(boxLongs)
		threads[0].continuationStack.unshift({func:cjBoxLong, args: null});
	var promise = cheerpjPromiseAdapter();
	threads[0].continuationStack.unshift({func:icheerpjPromiseResolve, args:{pc:0,f:icheerpjPromiseResolve,promise:promise}});
	if(threads[0].state == "PAUSED")
		threads[0].state = "READY";
	cheerpjSchedule();
	return promise;
}

function cheerpjRunStaticMethod(t, className, methodName)
{
	var args = [].splice.call(arguments, 3);
	// Compute the mangled name
	var mangledName = "N";
	var parts = className.split('/');
	for(var i=0;i<parts.length;i++)
		mangledName += parts[i].length + parts[i];
	// cheerpjEnsureInitialized will take care of loading the class if needed
	t.continuationStack.unshift({func:function(n)
		{
			cheerpjEnsureInitialized(n, null);
		}, args: mangledName});
	// Schedule the function itself, this may happen after the class is loaded
	t.continuationStack.unshift({func:function(_args)
		{
			var mangledName = _args.mangledName;
			var args = _args.args;
			var a = [];
			cjPushArgs(a, args);
			a.push(null);
			var func=cjMethodDynamic(methodName);
			assert(func);
			return func.apply(null,a);
		}, args:{args:args,mangledName:mangledName}});
	var promise = cheerpjPromiseAdapter();
	t.continuationStack.unshift({func:icheerpjPromiseResolve, args:{pc:0,f:icheerpjPromiseResolve,promise:promise}});
	if(t.state == "PAUSED")
		t.state = "READY";
	cheerpjSchedule();
	return promise;
}

var internStringMap = {}

function cheerpjInternString(a)
{
	if(internStringMap.hasOwnProperty(a))
		return internStringMap[a];
	var ret = cjStringJsToJava(a);
	internStringMap[a] = ret;
	return ret;
}

var classMap = {}

function cheerpjGetClass(a)
{
	if(classMap.hasOwnProperty(a))
		return classMap[a];
	var ret = new N4java4lang5Class();
	ret.cheerpjDownload = null;
	ret.jsName = a;
	ret.jsConstructor = null;
	if(a[0] != '[')
	{
		var mangledName = cheerpjEncodeClassName(a);
		var constructor = cjGlobalDynamic(mangledName);
		ret.jsConstructor = constructor;
		assert(constructor);
		if(constructor.cl!==null && constructor.cl.hasOwnProperty("cl"))
			ret.classLoader3 =  constructor.cl.cl;
		else
			ret.classLoader3 =  constructor.cl;
	}
	ret.name2=cheerpjInternString(a.split('/').join('.'));
	classMap[a] = ret;
	return ret;
}

function cjC(c,p)
{
	// Fast path, if the class is already there
	if(classMap.hasOwnProperty(c))
		return classMap[c];
	// Make sure the class code is loaded
	var mangledClassName = cheerpjEncodeClassName(c);
	if(!self.hasOwnProperty(mangledClassName))
	{
		var a={p:p,f:cjC,pc:0,c:c};
		a.pc=0;icjLoadWeakClass(mangledClassName, a, false);
	}
	return cheerpjGetClass(c);
}

function cheerpjAddPrimitiveClass(a)
{
	var ret = new N4java4lang5Class();
	ret.cheerpjDownload = null;
	ret.jsName = a;
	ret.name2 = cheerpjInternString(a);
	ret.hackIsPrimitive = true;
	classMap[a] = ret;
}

function cheerpjGetClassConstructor(c)
{
	assert(c.jsConstructor);
	return c.jsConstructor;
}

function cjArrayHashCode(a0, p)
{
	return cjObjectHashCode(a0, p);
}

function cjArrayToString(a0, p)
{
	return cjObjectToString(a0, p);
}

function cjArrayEquals(a0,a1,p)
{
	return a0===a1?1:0;
}

function cjArrayNotifyAll(a0, p)
{
	return cjObjectNotifyAll(a0, p);
}

function cjArrayClone()
{
	var ret = [];
	for(var i=0;i<this.length;i++)
		ret[i]=this[i];
	return ret;
}

function cjArrayGetClass()
{
	var ret=cheerpjGetClass(this[0]);
	return ret;
}

function cjAddToProtoype(p, vCall, iCall, f)
{
	var v={value:f,configurable:true};
	Object.defineProperty(p, vCall, v);
	if(iCall!==null)
		Object.defineProperty(p, iCall, v);
}

// getClass
cjAddToProtoype(Array.prototype, 'v0', 'kBqmXTaij96Tq_bNxKe', cjArrayGetClass);

// hashCode
cjAddToProtoype(Array.prototype, 'v1', 'lFaiDW5mq86jc', cjArrayHashCode);

// equals
cjAddToProtoype(Array.prototype, 'v2', 'gtarbSiXq_dJgKmWrc7nd', cjArrayEquals);

// clone
cjAddToProtoype(Array.prototype, 'v3', 'cqRa6mmXRhd9pmAqYahb', cjArrayClone);

// toString
cjAddToProtoype(Array.prototype, 'v4', null, cjArrayToString);

// notifyAll
cjAddToProtoype(Array.prototype, 'v6', 'idauYifyAllVEV', cjArrayNotifyAll);

cjAddToProtoype(Array.prototype, 'ifs', null, ["java/io/Serializable"]);

function typedArrayClone(a0,p)
{
	var ret = new this.constructor(this);
	if(ret[0] == 74)
	{
		ret.high = new Int32Array(this.high);
	}
	return ret;
}

function typedArrayGetClass(a0,p)
{
	assert(this[0]);
	return cheerpjGetClass("["+String.fromCharCode(this[0]));
}

cjAddToProtoype(Int8Array.prototype, 'v0', 'kBqmXTaij96Tq_bNxKe', typedArrayGetClass);
cjAddToProtoype(Int16Array.prototype, 'v0', 'kBqmXTaij96Tq_bNxKe', typedArrayGetClass);
cjAddToProtoype(Uint16Array.prototype, 'v0', 'kBqmXTaij96Tq_bNxKe', typedArrayGetClass);
cjAddToProtoype(Int32Array.prototype, 'v0', 'kBqmXTaij96Tq_bNxKe', typedArrayGetClass);
cjAddToProtoype(Float32Array.prototype, 'v0', 'kBqmXTaij96Tq_bNxKe', typedArrayGetClass);
cjAddToProtoype(Float64Array.prototype, 'v0', 'kBqmXTaij96Tq_bNxKe', typedArrayGetClass);

cjAddToProtoype(Int8Array.prototype, 'v1', null, cjArrayHashCode);
cjAddToProtoype(Int16Array.prototype, 'v1', null, cjArrayHashCode);
cjAddToProtoype(Uint16Array.prototype, 'v1', null, cjArrayHashCode);
cjAddToProtoype(Int32Array.prototype, 'v1', null, cjArrayHashCode);
cjAddToProtoype(Float32Array.prototype, 'v1', null, cjArrayHashCode);
cjAddToProtoype(Float64Array.prototype, 'v1', null, cjArrayHashCode);

cjAddToProtoype(Int8Array.prototype, 'v2', null, cjArrayEquals);
cjAddToProtoype(Int16Array.prototype, 'v2', null, cjArrayEquals);
cjAddToProtoype(Uint16Array.prototype, 'v2', null, cjArrayEquals);
cjAddToProtoype(Int32Array.prototype, 'v2', null, cjArrayEquals);
cjAddToProtoype(Float32Array.prototype, 'v2', null, cjArrayEquals);
cjAddToProtoype(Float64Array.prototype, 'v2', null, cjArrayEquals);

cjAddToProtoype(Int8Array.prototype, 'v3', 'cqRa6mmXRhd9pmAqYahb', typedArrayClone);
cjAddToProtoype(Int16Array.prototype, 'v3', 'cqRa6mmXRhd9pmAqYahb', typedArrayClone);
cjAddToProtoype(Uint16Array.prototype, 'v3', 'cqRa6mmXRhd9pmAqYahb', typedArrayClone);
cjAddToProtoype(Int32Array.prototype, 'v3', 'cqRa6mmXRhd9pmAqYahb', typedArrayClone);
cjAddToProtoype(Float32Array.prototype, 'v3', 'cqRa6mmXRhd9pmAqYahb', typedArrayClone);
cjAddToProtoype(Float64Array.prototype, 'v3', 'cqRa6mmXRhd9pmAqYahb', typedArrayClone);

cjAddToProtoype(Int8Array.prototype, 'v4', null, cjArrayToString);
cjAddToProtoype(Int16Array.prototype, 'v4', null, cjArrayToString);
cjAddToProtoype(Uint16Array.prototype, 'v4', null, cjArrayToString);
cjAddToProtoype(Int32Array.prototype, 'v4', null, cjArrayToString);
cjAddToProtoype(Float32Array.prototype, 'v4', null, cjArrayToString);
cjAddToProtoype(Float64Array.prototype, 'v4', null, cjArrayToString);

cjAddToProtoype(Int8Array.prototype, 'v6', null, cjArrayNotifyAll);
cjAddToProtoype(Int16Array.prototype, 'v6', null, cjArrayNotifyAll);
cjAddToProtoype(Uint16Array.prototype, 'v6', null, cjArrayNotifyAll);
cjAddToProtoype(Int32Array.prototype, 'v6', null, cjArrayNotifyAll);
cjAddToProtoype(Float32Array.prototype, 'v6', null, cjArrayNotifyAll);
cjAddToProtoype(Float64Array.prototype, 'v6', null, cjArrayNotifyAll);

cjAddToProtoype(Int8Array.prototype, 'ifs', null, []);
cjAddToProtoype(Int16Array.prototype, 'ifs', null, []);
cjAddToProtoype(Uint16Array.prototype, 'ifs', null, []);
cjAddToProtoype(Int32Array.prototype, 'ifs', null, []);
cjAddToProtoype(Float32Array.prototype, 'ifs', null, []);
cjAddToProtoype(Float64Array.prototype, 'ifs', null, []);

var threads = null;
var currentThread = null;
var loaderPath = null;
var appUrlPrefix = null;

function cheerpjSchedInit()
{
	if(threads !== null)
		return;
	threads = [];
	threads.push(new CheerpJThread());
	cjScheduleDelayer = new MessageChannel();
	cjScheduleDelayer.port1.onmessage = cheerpjSchedule;
}

function cjGetCurrentScript()
{
	try
	{
		throw new Error();
	}
	catch(e)
	{
		var stack = e.stack;
	}
	var part=cheerpjGetStackEntry(stack);
	var loaderStart = part.indexOf("http://");
	if(loaderStart == -1)
		loaderStart = part.indexOf("https://");
	var loaderEnd = part.indexOf(".js");
	assert(loaderStart >= 0 && loaderEnd > 0);
	return part.substring(loaderStart, loaderEnd+3);
}

function cheerpjInitOnce()
{
	cheerpjSchedInit();
	// Log critical page level errors
	self.addEventListener("error", function(err)
	{
		var message = "Error";
		if(err)
		{
			message = err.message;
			if(err.error)
			{
				message += "/" + err.error.stack;
			}
		}
		cjReportError(message);
	});
	self.addEventListener("unhandledrejection", function(err)
	{
		var message = "Promise error";
		if(err)
		{
			message = err.message;
			if(err.error)
			{
				message += "/" + err.error.stack;
			}
		}
		cjReportError(message);
	});
	if(loaderPath == null)
	{
		var loaderFile = cjGetCurrentScript();
		loaderPath = loaderFile.substr(0, loaderFile.length - "/loader.js".length);
	}
	// Install compatibility code for IE
	// TODO: Move this to a separate JS
	if(!Math.fround)
		Math.fround = function(v) { return v; };
	if(!Math.trunc)
		Math.trunc = function (v) { return v < 0 ? Math.ceil(v) : Math.floor(v); };
	if(!Math.imul)
	{
		Math.imul = function(a, b) {
			var ah = (a >>> 16) & 0xffff;
			var al = a & 0xffff;
			var bh = (b >>> 16) & 0xffff;
			var bl = b & 0xffff;
			return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
		};
	}
	if(!Math.sign)
		Math.sign = function(x) { return ((x > 0) - (x < 0)) || +x; };
	if(!Math.clz32)
	{
		Math.clz32 = function(x) {
			if (x == null || x === 0)
				return 32;
			return 31 - Math.floor(Math.log(x >>> 0) * Math.LOG2E);
		};
	}
	if(!Math.cbrt)
	{
		Math.cbrt = function(x) {
			var y = Math.pow(Math.abs(x), 1/3);
			return x < 0 ? -y : y;
		};
	}
	if(!String.prototype.startsWith)
	{
		String.prototype.startsWith = function(searchString, position) {
			return this.substr(position || 0, searchString.length) === searchString;
		};
	}
	if (!String.prototype.endsWith)
	{
		String.prototype.endsWith = function(searchStr, Position) {
			// This works much better than >= because
			// it compensates for NaN:
			if (!(Position < this.length))
				Position = this.length;
			else
				Position |= 0; // round position
			return this.substr(Position - searchStr.length, searchStr.length) === searchStr;
		};
	}
	if(!cheerpjInitOnce.name)
	{
		Object.defineProperty(Function.prototype, 'name', { get: function() {
			var code = this.toString();
			var idxOfFunction = code.indexOf('function ');
			var idxOfName = idxOfFunction + 9;
			var idxOfNameEnd = code.indexOf('(', idxOfName);
			var name = code.substring(idxOfName, idxOfNameEnd);
			// TODO: Cache, maybe
			return name;
		} });
	}
	if(!self.Promise)
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js", false);
		xhr.send();
		var code = xhr.responseText;
		self.eval(code);
	}
	if(!self.fetch)
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.0.0/dist/fetch.umd.min.js", false);
		xhr.send();
		var code = xhr.responseText;
		self.eval(code);
	}
	cjMacOSPlatform = navigator.platform.indexOf("Mac") >= 0;
}

function CheerpJProcess()
{
	this.threads = null;
	this.daemonThreads = null;
	this.endPromise = null;
}

CheerpJProcess.prototype.addThread=function(t)
{
	if(this.threads == null)
		this.threads = [];
	this.threads.push(t);
	t.parent = this;
}

CheerpJProcess.prototype.removeThread=function(t)
{
	assert(this.threads);
	var threadIndex = this.threads.indexOf(t);
	this.threads.splice(threadIndex,1);
	if(this.threads.length == 0)
	{
		if(this.endPromise)
		{
			var p = this.endPromise;
			setTimeout(function() { p.done(t.exitValue); }, 0);
		}
	}
}

function CheerpJThread()
{
	this.threadObj = null
	this.continuationStack = [];
	this.state = "PAUSED";
	this.retValue = null;
	this.schedTime = -0;
	this.schedTotal = -0;
	this.parent = null;
	this.sSlot = null;
	this.linearStack = 0;
	this.curStack = 0;
	this.localRefs = null;
	this.isExiting = 0;
	this.exitValue = null;
	this.lockHead = null;
	this.timeoutId = 0;
	this.parkCounter = 0;
}

function assert(cond)
{
	if(!cond)
		debugger
}

var cjScheduleDelayer = null;

// Arrays of pairs (absolute wake time, thread)
var cjScheduleTimers = []

var cjScheduledTimerId = 0;

function cheerpjScheduleTimer(absTime, thread, p)
{
	// TODO: Use binary search
	for(var i=0;i<cjScheduleTimers.length;i+=2)
	{
		if(cjScheduleTimers[i] > absTime)
		{
			cjScheduleTimers.splice(i, 0, absTime, thread);
			break;
		}
	}
	if(i == cjScheduleTimers.length)
		cjScheduleTimers.push(absTime, thread);
	buildContinuations(p, false);
	thread.state = "BLOCKED_TIMER";
	throw "CheerpJContinue";
}

// This function can only be called before cheerpjSchedule, it does not clear the timeout id
function cheerpjRemoveTimer(thread)
{
	for(var i=1;i<cjScheduleTimers.length;i+=2)
	{
		if(cjScheduleTimers[i] == thread)
		{
			cjScheduleTimers.splice(i-1, 2);
			break;
		}
	}
}

function cheerpjDoTimer()
{
	// Drop the time
	var curTime = cjScheduleTimers.shift();
	var now = Date.now();
	assert(curTime - now < 20);
	var thisThread = cjScheduleTimers.shift();
	assert(thisThread.state == "BLOCKED_TIMER");
	thisThread.state = "READY";
	assert(cjScheduledTimerId);
	cjScheduledTimerId = 0;
	cheerpjSchedule();
}

var cheerpjLastScheduled = 0;
var cheerpjRafTimestamp = -0;
var cheerpjRafPending = 0 // 0: not pending, 1: pending, 2: schedule delegated

function cheerpjRaf()
{
	if(cheerpjRafPending == 2)
		cjScheduleDelayer.port2.postMessage(0);
	cheerpjRafPending = 0;
}

function cjNotifyThread(threadObj)
{
	threadObj.v6(threadObj, null);
}

function cjExitThread(threadObj)
{
	threadObj[cjThreadExit](threadObj, null);
}

function cjClearThread(t)
{
	// Remove from process if presend
	if(t.parent)
		t.parent.removeThread(t);
	if(t.linearStack)
		CheerpJFreeStack(t.linearStack);
	var l = t.lockHead;
	while(l !== null)
	{
		var n = l.nextL;
		cjU(l);
		l = n;
	}
	assert(t.lockHead === null);
}

function cheerpjSchedule()
{
	// Chrome: Apparently the debugger may cause an event handler to schedule a thread while another one is running
	// Do not schedule something if there is a current thread
	if(currentThread!=null && currentThread.state == "RUNNING")
		return;
	if(cjScheduledTimerId)
	{
		clearTimeout(cjScheduledTimerId)
		cjScheduledTimerId = 0;
	}
	if(cheerpjRafPending == 0)
	{
		cheerpjRafTimestamp = Date.now();
		cheerpjRafPending = 1;
		if(!cjIsWorker)
			requestAnimationFrame(cheerpjRaf);
	}
	do
	{
		var foundReady = false;
		// Search the first READY thread and run its continuations
		for(var i=cheerpjLastScheduled;i<threads.length;i++)
		{
			if(threads[i].state == "READY")
			{
				var chosenThread = threads[i];
				chosenThread.schedTime = Date.now();
				if(chosenThread.curStack)
					CheerpJSetStack(chosenThread.curStack);
				currentThread = chosenThread;
				currentThread.state = "RUNNING";
				foundReady = true;
				runContinuationStack(chosenThread.retValue);
				cheerpjLastScheduled = i+1;
				if(chosenThread.curStack)
					chosenThread.curStack = CheerpJGetStack();
				if(i>0 && chosenThread.state == "PAUSED")
				{
					var threadIndex = threads.indexOf(chosenThread);
					// Remove dead thread
					if(threadIndex > 0)
					{
						// See if the thread has already run exit logic
						if(chosenThread.isExiting === 0)
						{
							chosenThread.isExiting = 1;
							chosenThread.exitValue = chosenThread.retValue;
							chosenThread.continuationStack.push({func:cjClearThread,args:chosenThread});
							if(chosenThread.threadObj !== null)
							{
								// Notify waiting threads
								chosenThread.continuationStack.push({func:cjNotifyThread,args:chosenThread.threadObj});
								chosenThread.continuationStack.push({func:cjExitThread,args:chosenThread.threadObj});
							}
							chosenThread.state = "READY";
						}
						else
						{
							threads.splice(threadIndex,1);
						}
					}
				}
				chosenThread.schedTotal += (Date.now() - chosenThread.schedTime);
				break;
			}
		}
		// If we did not start from the first thread we need to make sure to reschedule
		if(foundReady==false && cheerpjLastScheduled != 0)
		{
			foundReady = true;
			cheerpjLastScheduled = 0;
		}
		// Check if at this point any sleeping thread should be woken up
		var now = Date.now();
		for(var i=0;i<cjScheduleTimers.length;i+=2)
		{
			if(cjScheduleTimers[i] < now)
			{
				cjScheduleTimers.shift();
				var thisThread = cjScheduleTimers.shift();
				assert(thisThread.state == "BLOCKED_TIMER");
				thisThread.state = "READY";
				foundReady = true;
			}
			else
				break;
		}
	}while(foundReady && now - cheerpjRafTimestamp < 17);
	if(foundReady)
	{
		var isRafPending = cheerpjRafPending;
		cheerpjRafPending = 2;
		if(cjIsWorker || isRafPending == 0)
			cheerpjRaf();
	}
	else if(cjScheduleTimers.length)
	{
		// No ready threads, schedule a timeout if required
		var delay = cjScheduleTimers[0] - Date.now();
		cjScheduledTimerId = setTimeout(cheerpjDoTimer, delay);
	}
	else if(cjLateStatus)
	{
		for(var i=0;i<threads.length;i++)
		{
			if(threads[i].state == "WAIT_NET")
			{
				cheerpjFlashStatus("Loading...");
				return;
			}
		}
	}
}

function cheerpjNormalizePath(path)
{
	var parts = path.split('/');
	var newParts = [""]
	// TODO: Support cwd
	if(parts[0] != "" || parts.length == 1)
		newParts.push("files");
	else
		parts.shift();
	for(var i=0;i<parts.length;i++)
	{
		if(parts[i] == '.' || parts[i] == "")
			continue;
		else if(parts[i] == '..')
		{
			if(newParts.length)
				newParts.pop();
		}
		else
			newParts.push(parts[i]);
	}
	if(newParts.length == 1)
		newParts.push("");
	return newParts.join("/");
}

function cheerpjClassToJavaDesc(c)
{
	var className = String.fromCharCode.apply(null, c.name2.value0).substr(1);
	if(className=="boolean")
		return 'Z';
	else if(className=="byte")
		return 'B';
	else if(className=="char")
		return 'C';
	else if(className=="double")
		return 'D';
	else if(className=="float")
		return 'F';
	else if(className=="int")
		return 'I';
	else if(className=="long")
		return 'J';
	else if(className=="short")
		return 'S';
	else if(className=="void")
		return 'V';
	else if(className[0] == '[')
		return className.split(".").join("/");
	else
		return "L"+className.split(".").join("/")+";";
}

function cheerpjMangleClassName(c)
{
	var ret = "";
	var className = String.fromCharCode.apply(null, c.name2.value0).substr(1);
	switch(className)
	{
		case "[Z":
			return "AZ";
		case "[B":
			return "AB";
		case "[C":
			return "AC";
		case "[D":
			return "AD";
		case "[F":
			return "AF";
		case "[I":
			return "AI";
		case "[J":
			return "AJ";
		case "[S":
			return "AS";
		default:
			break;
	}
	while(className[0]=="[")
	{
		ret += "A";
		className = className.substring(1, className.length);
		// There is only 1 ; indipendently of the array levels
		if(className[className.length-1] == ';')
			className = className.substring(0, className.length-1);
		if(className[0] == 'L')
			className = className.substring(1, className.length);
	}
	if(className=="boolean")
		ret+='Z';
	else if(className=="byte")
		ret+='B';
	else if(className=="char")
		ret+='C';
	else if(className=="double")
		ret+='D';
	else if(className=="float")
		ret+='F';
	else if(className=="int")
		ret+='I';
	else if(className=="long")
		ret+='J';
	else if(className=="short")
		ret+='S';
	else if(className=="void")
		ret+='V';
	else
	{
		ret += "N";
		var curStart = 0;
		for(var i=0;i<className.length;i++)
		{
			if(className[i] == '.')
			{
				ret += (i-curStart) + className.substring(curStart,i);
				curStart = i+1;
			}
		}
		ret += (i-curStart) + className.substring(curStart,i);
	}
	return ret;
}

function cheerpjCreateDisplay(w, h, oldElem)
{
	// Create a div element that will contain all Java Windows
	var element = document.createElement("div");
	cjDisplay = element;
	element.id="cheerpjDisplay";
	if(oldElem && w<0 && h<0)
	{
		// Compute the sizes from the parent
		element.style.width="100%";
		element.style.height="100%";
	}
	else
	{
		element.style.width=w+"px";
		element.style.height=h+"px";
	}
	element.classList.add("cheerpjLoading");
	element.classList.add("bordered");
	if(oldElem)
		oldElem.appendChild(element);
	else
		document.body.appendChild(element);
	cheerpjSetStatus(cjStatus, element);
	return element;
}

var cheerpjMEEvents = null;

function cheerpjMEKeyEvent(e)
{
	if(cheerpjMEEvents==null)
		return;
	if(cheerpjMEEvents.length && (cheerpjMEEvents[cheerpjMEEvents.length-1] instanceof CheerpJThread))
	{
		// Wake the thread up, and remove it from the queue
		var t = cheerpjMEEvents.pop();
		assert(t.state = "BLOCKED_ON_EVENTS");
		t.state = "READY";
	}
	// Positive values are Unicode values, negative values are custom, for now pass all as custom
	var keyCode = -e.keyCode;
	cheerpjMEEvents.push(/*KEY_EVENT*/1, e.type == "keydown" ? /*PRESSED*/1 : /*RELEASED*/2, keyCode);
	cheerpjSchedule();
}

function cheerpjMEMouseEvent(e)
{
	if(cheerpjMEEvents==null)
		return;
	if(cheerpjMEEvents.length && (cheerpjMEEvents[cheerpjMEEvents.length-1] instanceof CheerpJThread))
	{
		// Wake the thread up, and remove it from the queue
		var t = cheerpjMEEvents.pop();
		assert(t.state = "BLOCKED_ON_EVENTS");
		t.state = "READY";
	}
	var eventType = -1;
	var rect = e.target.getBoundingClientRect();
	var x = (e.clientX - rect.left);
	var y = (e.clientY - rect.top);
	if(e.type == "mousedown")
		eventType = /*PRESSED*/1;
	else if(e.type == "mouseup")
		eventType = /*RELEASED*/2;
	else if(e.type == "mousemove")
		eventType = /*DRAGGED*/3;
	else
		debugger
	cheerpjMEEvents.push(/*PEN_EVENT*/2, eventType, x, y);
	cheerpjSchedule();
}

function cheerpjCreateCanvas(w, h)
{
	// Create a div element that will contain all Java Windows
	var element = document.createElement("canvas");
	element.id="cheerpjCanvas";
	element.width=w;
	element.height=h;
	element.style.borderColor="#000";
	element.style.borderStyle="solid";
	document.addEventListener("keydown", cheerpjMEKeyEvent);
	document.addEventListener("keyup", cheerpjMEKeyEvent);
	element.addEventListener("mousedown", cheerpjMEMouseEvent);
	element.addEventListener("mouseup", cheerpjMEMouseEvent);
	element.addEventListener("mousemove", cheerpjMEMouseEvent);
	document.body.appendChild(element);
}

var cheerpjCL = null;
var cheerpjAOTPackages = {};
var cheerpjAppletObserver = null;
var cheerpjInjectInFrames = false;

function cheerpjMutationObserver(e)
{
	for(var i=0;i<e.length;i++)
	{
		var r=e[i];
		for(var j=0;j<r.addedNodes.length;j++)
		{
			var n = r.addedNodes[j];
			var lowerCaseNodeName = n.nodeName.toLowerCase();
			if(lowerCaseNodeName == "applet" || lowerCaseNodeName == "object" || lowerCaseNodeName == "embed" ||
				lowerCaseNodeName == "cheerpj-applet" || lowerCaseNodeName == "cheerpj-object" || lowerCaseNodeName == "cheerpj-embed")
			{
				cheerpjRewriteAndReplaceApplet(n);
			}
			if(cheerpjInjectInFrames && (lowerCaseNodeName == "frame" || lowerCaseNodeName == "iframe") && !n.hasOwnProperty("cjSubProcess"))
			{
				var injectedCode = cheerpjInjectLoader.toString()+";cheerpjInjectLoader('" + loaderPath + "');";
				if(window.hasOwnProperty("spoofFunc"))
					injectedCode = spoofFunc.toString()+";spoofFunc();"+injectedCode;
				cheerpjInjectInFrame(n, injectedCode);
			}
			if(!n.children)
				continue;
			// Also check known children right away
			for(var k=0;k<n.children.length;k++)
			{
				var lowerCaseNodeName = n.children[k].nodeName.toLowerCase();
				if(lowerCaseNodeName == "applet" || lowerCaseNodeName == "object" || lowerCaseNodeName == "embed" ||
					lowerCaseNodeName == "cheerpj-applet" || lowerCaseNodeName == "cheerpj-object" || lowerCaseNodeName == "cheerpj-embed")
				{
					cheerpjRewriteAndReplaceApplet(n.children[k]);
				}
			}
		}
	}
}

function cjGetAppletOrObjectOrEmbedParams(elem)
{
	// <applet> and <embed> have the main data as attributes, while <object> has it as params
	// in both cases extra <param> children should be available to the applet
	var lowerCaseNodeName = elem.nodeName.toLowerCase();
	if(lowerCaseNodeName.startsWith("cheerpj-"))
		lowerCaseNodeName = lowerCaseNodeName.substr(8);
	var isApplet = lowerCaseNodeName == "applet";
	var isObject = lowerCaseNodeName == "object";
	var isEmbed = lowerCaseNodeName == "embed";
	assert(isApplet || isObject || isEmbed);
	// 1) Get DOM level attributes
	var id = elem.getAttribute("id");
	var name = elem.getAttribute("name");
	var width = elem.getAttribute("width");
	var height = elem.getAttribute("height");
	var appletParameters = [];
	if(width == null)
	{
		width = elem.width;
		width = width.toString();
	}
	else
		appletParameters.push("width", width);
	if(height == null)
	{
		height = elem.height;
		height = height.toString();
	}
	else
		appletParameters.push("height", height);
	// 2) Try attributes first
	var codebase = elem.getAttribute("codebase") || elem.getAttribute("java_codebase");
	var archive = elem.getAttribute("archive") || elem.getAttribute("java_archive") || elem.getAttribute("cache_archive");
	var code = null;
	if(isApplet)
	{
		var codetype = elem.getAttribute("type");
		if(codetype && codetype != "application/java" && !codetype.startsWith("application/x-java"))
			return null;
		code = elem.getAttribute("code") || elem.getAttribute("java_code");
	}
	else if(isEmbed)
	{
		var codetype = elem.getAttribute("type");
		if(codetype && codetype != "application/java" && !codetype.startsWith("application/x-java"))
			return null;
		code = elem.getAttribute("code") || elem.getAttribute("java_code");
		// For embed tags all extra attributes must become parameters
		var attrs = elem.attributes;
		for(var i=0;i<attrs.length;i++)
		{
			var a = attrs[i];
			appletParameters.push(a.name, a.value);
		}
	}
	else if(isObject)
	{
		// Is this something we should handle?
		var codetype = elem.getAttribute("codetype");
		if(codetype && codetype != "application/java" && !codetype.startsWith("application/x-java"))
			return null;
		var type = elem.getAttribute("type");
		if(type && type != "application/java" && !type.startsWith("application/x-java"))
			return null;
		var classid = elem.getAttribute("classid");
		if(classid)
		{
			if(classid.startsWith("java:"))
			{
				// This refers to the applet class
				code = classid.substr(5);
			}
			else if(classid == "clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" || classid.startsWith("clsid:CAFEEFAC-"))
			{
				// Clear codebase, it refers to the install file for Windows
				codebase = null;
			}
			else
			{
				return null;
			}
		}
	}
	var jnlp_href = null;
	if(isEmbed)
	{
		// Try to get JNLP url from poorly documented launchjnlp attribute
		jnlp_href = elem.getAttribute("launchjnlp");
	}
	// 3) Gather extra parameters for applet, if object actually also gather main attributes
	for(var i=0;i<elem.children.length;i++)
	{
		var p = elem.children[i];
		if(p.nodeName.toLowerCase() != "param")
			continue;
		// Check for JNLP forwarding, it should be handled with priority
		var paramName = p.getAttribute("name");
		var paramValue = p.getAttribute("value");
		if(paramName === null || paramValue === null)
			continue;
		paramName = paramName.toLowerCase();
		if(paramName == "jnlp_href")
		{
			jnlp_href = paramValue;
			continue;
		}
		else if(isObject || isApplet)
		{
			if(paramName == "code" || paramName == "java_code")
			{
				code = paramValue;
				continue;
			}
			else if(paramName == "codebase" || paramName == "java_codebase")
			{
				codebase = paramValue;
				continue;
			}
			else if(paramName == "archive" || paramName == "java_archive" || paramName == "cache_archive")
			{
				archive = paramValue;
				continue;
			}
		}
		appletParameters.push(paramName);
		appletParameters.push(paramValue);
	}
	return {id:id,name:name,width:width,height:height,code:code,codebase:codebase,archive:archive,jnlp_href:jnlp_href,appletParameters:appletParameters};
}

function cheerpjRewriteAndReplaceApplet(elem)
{
	if(threads == null)
		cheerpjInit({enablePreciseAppletArchives:true});
	if(elem.getAttribute("data-cheerpj")!=null)
		return null;
	// It could be that the same applet has been handled as a child of a previous mutation event
	if(elem.parentNode == null)
		return null;
	// It is useful to replace applet tags with object tags, sites have dropped chrome already and in this way we can have Firefox like behaviour
	var cheerpjPrefixed = elem.nodeName.toLowerCase().startsWith("cheerpj-");
	var newObj = document.createElement("object");
	// Mark this object to keep the icon on the page
	newObj.setAttribute("data-cheerpj", "");
	var props = cjGetAppletOrObjectOrEmbedParams(elem);
	if(props == null)
		return null;
	if(props.id)
		newObj.setAttribute("id",props.id);
	if(props.name)
		newObj.setAttribute("name",props.name);
	if(elem.getAttribute("style"))
		newObj.setAttribute("style", elem.getAttribute("style"));
	if(elem.getAttribute("class"))
		newObj.setAttribute("class", elem.getAttribute("class"));
	newObj.setAttribute("type", cheerpjPrefixed ? "application/x-cheerpj-applet" : "application/x-java-applet");
	// Manually set the inline-block style to make sure that the sizing behave correctly when the CSS is not loaded
	newObj.style.display = "inline-block";
	newObj.classList.add("cheerpjApplet");
	newObj.classList.add("cheerpjLoading");
	var appletClass = props.code;
	if(appletClass && appletClass.endsWith(".class"))
		appletClass = appletClass.substring(0, appletClass.length - 6);
	var width = props.width;
	var height = props.height;
	newObj.setAttribute("width", width);
	newObj.setAttribute("height", height);
	newObj.style.width = width;
	newObj.style.height = height;
	// Add an empty child tag to newObj to remove the default sizing
	var s = document.createElement("span");
	newObj.appendChild(s);
	elem.parentNode.replaceChild(newObj, elem);
	var display = cjDisplay;
	if(display == null)
	{
		// Create a new full screen overlay in the outermost parent we have access to
		var w = window;
		while(w.parent != w)
			w = w.parent;
		if(w != window)
		{
			// Inject our CSS in the destination window
			cheerpjAddCSS(w.document, loaderPath + "/cheerpj.css");
		}
		var overlay = w.document.createElement("div");
		cjDisplay = overlay;
		overlay.classList.add("cheerpjOverlay");
		w.document.body.appendChild(overlay);
		display = cheerpjCreateDisplay(-1,-1,overlay);
		display.classList.remove("cheerpjLoading");
		display.classList.remove("displayBg");
	}
	// In the context of an applet we want to disable the border when the loading is done
	display.classList.remove("bordered");
	// Detect actual computed size for applet
	var computedWidth = newObj.clientWidth;
	var computedHeight = newObj.clientHeight;
	var appletParameters = props.appletParameters;
	var codeBase = props.codebase;
	if(props.jnlp_href)
	{
		// Ok this applet expects to be upgraded to JNLP, include the jnlp.js script
		var newScript = document.createElement("script");
		newScript.src = loaderPath + "/jnlp.js";
		newScript.onload = function()
		{
			var xhr = new XMLHttpRequest();
			xhr.open("GET", props.jnlp_href);
			xhr.onload=function(e)
			{
				var retData={classPath:null,mainClass:null};
				parseJNLPData(e.target.responseXML, props.jnlp_href, retData)
				if(retData.mainClass == null)
				{
					// Not an applet, possibly an application
					return;
				}
				// HACK: Convince Java detectors that this is updated
				cheerpjRunStaticMethod(threads[0], "java/lang/System", cjSystemSetProperty, "java.version", "1.8.0_300");
				cheerpjRunStaticMethod(threads[0], "java/lang/System", cjSystemSetProperty, "java.class.path", retData.classPath);
				// For applets we want to enable local access using XHR
				cheerpjRunStaticMethod(threads[0], "java/lang/System",cjSystemSetProperty,"java.protocol.handler.pkgs","com.leaningtech.handlers");
				cheerpjCreateInstance("N3com11leaningtech7cheerpj19CheerpJAppletViewer", cjAppletViewerConstuctor).then(function(a) {
					var loc = codeBase;
					if(!codeBase || codeBase[0] != '/')
					{
						loc = cjLocation.href;
						loc = loc.substring(0, loc.lastIndexOf('/')+1);
					}
					else
						loc = cjLocation.origin;
					if(codeBase)
						loc += codeBase;
					// startAppletN4java4lang6StringN4java4lang6StringIIN4java4lang6ObjectN4java4lang6ObjectEV
					cheerpjRunMethod(0, a, "v529", retData.mainClass, loc, cjLocation.href, null, computedWidth, computedHeight, newObj, []);
				});
			}
			xhr.responseType="document";
			xhr.overrideMimeType('text/xml');
			xhr.send();
		};
		document.head.appendChild(newScript);
		return null;
	}
	var absPath = cjLocation.pathname;
	var parts = absPath.split('/');
	// Drop the last part
	parts.pop();
	// The class path(s) should be
	//     /app/codebase/ -> for absolute codebases
	//     /app/relPath/codebase/ -> for relative codebases
	//     http:// -> for fully qualified codebases
	//     /app/relPath/ -> by default
	var relPath = parts.join('/');
	var baseClassPath = null;
	var hostPrefix = cjLocation.protocol + "//" + cjLocation.host;
	if(codeBase)
	{
		if(codeBase.startsWith("http://") || codeBase.startsWith("https://"))
			baseClassPath = codeBase;
		else if(codeBase[0] == '/')
			baseClassPath = "/app" + codeBase;
		else
			baseClassPath = "/app/" + relPath + "/" + codeBase;
	}
	else
	{
		// Default classpath, local to the current path
		baseClassPath = "/app/" + relPath;
	}
	var jarArchive = props.archive;
	if(jarArchive && !cjEnablePreciseAppletArchives)
	{
		var classPath = null;
		// This is comma separated, apparently
		var archives = jarArchive.split(',');
		for(var i=0;i<archives.length;i++)
		{
			var archive = archives[i].trim();
			if(archive.startsWith("http://") || archive.startsWith("https://"))
				archive = archive;
			else if(archive[0] == '/')
				archive = "/app" + archive;
			else
				archive = baseClassPath + "/" + archive;
			if(!cjEnablePreciseAppletArchives && archive.startsWith(hostPrefix))
				archive = "/app" + archive.substr(hostPrefix.length);
			if(classPath == null)
				classPath = archive;
			else
				classPath += ":" + archive;
		}
		cheerpjRunStaticMethod(threads[0], "java/lang/System", cjSystemSetProperty, "java.class.path", classPath);
	}
	// For applets we want to enable local access using XHR
	cheerpjRunStaticMethod(threads[0], "java/lang/System",cjSystemSetProperty,"java.protocol.handler.pkgs","com.leaningtech.handlers");
	return cheerpjCreateInstance("N3com11leaningtech7cheerpj19CheerpJAppletViewer", cjAppletViewerConstuctor).then(function(a) {
		var loc = null;
		if(codeBase)
		{
			if(codeBase[codeBase.length-1] != '/')
				codeBase += "/";
			if(codeBase.startsWith("http://") || codeBase.startsWith("https://"))
				loc = codeBase;
			else if(codeBase[0] == '/')
				loc = cjLocation.origin + codeBase;
			else
				loc = cjLocation.origin + "/" + relPath + "/" + codeBase;
		}
		else
			loc = cjLocation.origin + "/" + relPath + "/";
		// startAppletN4java4lang6StringN4java4lang6StringIIN4java4lang6ObjectN4java4lang6ObjectEV
		return cheerpjRunMethod(0, a, "v529", appletClass, loc, cjLocation.href, cjEnablePreciseAppletArchives ? jarArchive : null, computedWidth, computedHeight, newObj, appletParameters);
	});
}

var cheerpjPendingLoads = 0;
var cheerpjJNIIsReady = false;
var cheerpjAppendedArguments = null;

function cheerpjJNIReady()
{
	cheerpjJNIIsReady = true;
	cheerpjStart();
}

function cheerpjLoaderReady()
{
	cheerpjPendingLoads--;
	cheerpjStart();
}

function cheerpjStart()
{
	if(cheerpjPendingLoads == 0 && cheerpjJNIIsReady)
	{
		cheerpjFSInit();
		var isSafari = /.*Version.*Safari.*/.test(navigator.userAgent);
		if(!cjIsWorker && !isSafari)
		{
			cheerpjGetFSMountForPath("/lt/").downloader = IFrameProxyDownloader;
			cheerpjGetFSMountForPath("/lts/").downloader = IFrameProxyDownloader;
			ipfCreateIFrame();
		}
		if(Array.isArray(cheerpjPreloadResources))
		{
			cheerpjPreloadTotal = cheerpjPreloadResources.length|0;
			cheerpjPreload();
		}
		else
			cheerpjPreloadResources = null;
		threads[0].state = "READY";
		cheerpjSetStatus("CheerpJ runtime ready");
		cheerpjSchedule();
	}
}

function cheerpjAddCSS(docElem, file)
{
	var link = docElem.createElement("link");
	link.setAttribute("rel","stylesheet");
	link.setAttribute("type","text/css");
	link.setAttribute("href",file);
	link.setAttribute("media","screen");
	docElem.head.appendChild(link);
}

function cheerpjAddScript(file, callback)
{
	if(cjIsWorker)
	{
		importScripts(file);
		callback();
		return;
	}
	var script = document.createElement("script");
	script.onload = callback;
	script.onerror = function(e)
	{
		var failCount = this.failureCount ? this.failureCount + 1 : 1;
		if(failCount > 5)
		{
			cjReportError("Core JS error "+e.target.src);
			return;
		}
		// Try again, make a new script element
		var newScript = document.createElement("script");
		newScript.failureCount = failCount;
		newScript.onload = this.onload;
		newScript.onerror = this.onerror;
		newScript.src = this.src;
		this.parentNode.replaceChild(newScript, this);
	};
	script.src = file;
	document.head.insertBefore(script, document.head.firstChild);
}

function cheerpjLoadFile(file, callback)
{
	var xhr = new XMLHttpRequest();
	if(cjIsWorker)
	{
		xhr.open("GET", file, /*async*/false);
		xhr.responseType = "arraybuffer";
		xhr.send();
		callback();
		return;
	}
	xhr.open("GET", file);
	xhr.responseType = "arraybuffer";
	xhr.onload = callback;
	xhr.onerror = function(e)
	{
		var failCount = this.failureCount ? this.failureCount + 1 : 1;
		if(failCount > 5)
		{
			cjReportError("Mem file error");
			return;
		}
		// Try again, make a new XHR
		var xhr = new XMLHttpRequest();
		xhr.failureCount = failCount;
		xhr.responseType = "arraybuffer";
		xhr.open("GET", file);
		xhr.onload = this.onload;
		xhr.onerror = this.onerror;
		xhr.send();
	};
	xhr.send();
}

function cheerpjInjectLoader(p)
{
	if(document.getElementById("cjLoader"))
	{
		// loader.js may still being loaded, if so the observer will be attached on load
		if(window.hasOwnProperty("threads"))
			cheerpjAttachBodyObserver(true);
		return;
	}
	var s = document.createElement("script");
	s.src = p + "/loader.js";
	s.id = "cjLoader";
	s.onload = function(e)
	{
		window.loaderPath = p;
		cheerpjAttachBodyObserver(true);
	};
	document.head.insertBefore(s, document.head.firstChild);
}

function cheerpjInjectInFrame(f, scriptText)
{
	f.addEventListener("load", function() { cheerpjInjectInFrame(f, scriptText); });
	if(f.contentDocument == null)
	{
		// Third party frame
		return;
	}
	if(f.contentDocument.readyState != "loading")
	{
		var s = f.contentDocument.createElement("script");
		s.textContent = scriptText;
		f.contentDocument.head.appendChild(s);
	}
	else
	{
		f.contentDocument.addEventListener("DOMContentLoaded", function(e) {
			var s = e.target.createElement("script");
			s.textContent = scriptText;
			e.target.head.appendChild(s);
		});
	}
}

function cheerpjAttachBodyObserver(injectInFrames)
{
	var appletRunnerMode = threads === null;
	if(!cheerpjAppletObserver)
		cheerpjAppletObserver = new MutationObserver(cheerpjMutationObserver);
	if(!document.body)
	{
		window.addEventListener("DOMContentLoaded", function() { cheerpjAttachBodyObserver(injectInFrames); });
		return;
	}
	// Register an observer listener for dynamically loaded applets
	cheerpjAppletObserver.observe(document.body, { subtree: true, childList: true });
	var rewriteList = [];
	var elemNames = ["applet", "cheerpj-applet", "object", "cheerpj-object", "embed", "cheerpj-embed"];
	for(var i=0;i<elemNames.length;i++)
	{
		var elems = document.getElementsByTagName(elemNames[i]);
		var a = [];
		for(var j=0;j<elems.length;j++)
			a.push(elems[j]);
		for(var j=0;j<a.length;j++)
		{
			var p = cheerpjRewriteAndReplaceApplet(a[j]);
			if(p)
				rewriteList.push(p);
		}
	}
	cheerpjInjectInFrames = injectInFrames;
	if(cheerpjInjectInFrames)
	{
		var scriptText = cheerpjInjectLoader.toString()+";cheerpjInjectLoader('" + loaderPath + "');";
		var elems = document.getElementsByTagName("frame");
		// Do not the spoof func, we expect that it has been already done by the extension
		for(var i=0;i<elems.length;i++)
		{
			var f = elems[i];
			cheerpjInjectInFrame(f, scriptText);
		}
		var elems = document.getElementsByTagName("iframe");
		for(var i=0;i<elems.length;i++)
		{
			var f = elems[i];
			cheerpjInjectInFrame(f, scriptText);
		}
	}
	// Delay body onload after all applets are initialized (only in applet runner mode)
	if(appletRunnerMode)
	{
		var bodyOnLoad = document.body.onload;
		document.body.onload = null;
		if(bodyOnLoad)
		{
			// We are injected as a content script very early, but due to races it may still be too late for onload
			// In that case we run onload twice
			if(document.readyState == "complete")
				Promise.all(rewriteList).then(bodyOnLoad.bind(document.body));
			else
			{
				document.body.onload = function()
				{
					Promise.all(rewriteList).then(bodyOnLoad.bind(document.body));
				};
			}
		}
	}
}

function cheerpjInit(options)
{
	cjListener = options && options.listener ? options.listener : null;
	// Check for query string parameters
	var query = cjLocation.search;
	if(query[0] == "?")
	{
		query = query.substr(1);
		var parts = query.split("&");
		for(var i=0;i<parts.length;i++)
		{
			var keyValue = parts[i].split("=");
			if(keyValue[0] == "cheerpjJarJsOverridePath")
				cheerpjJarJsOverridePath = decodeURIComponent(keyValue[1]);
			else if(keyValue[0] == "cheerpjAppendArgument")
			{
				if(cheerpjAppendedArguments === null)
					cheerpjAppendedArguments = [];
				cheerpjAppendedArguments.push(decodeURIComponent(keyValue[1]));
			}
		}
	}
	cheerpjInitOnce();
	// What level of status reporting has been requested
	if(options && options.status)
	{
		if(options.status == "splash")
		{
			cjLateStatus = false;
		}
		else if(options.status == "none")
		{
			cjStatus = null;
			cjLateStatus = false;
		}
	}
	if(options && options.logCanvasUpdates)
	{
		cjLogCanvasUpdates = 1;
	}
	if(options && options.preloadResources)
	{
		cheerpjPreloadResources = options.preloadResources;
	}
	if(options && options.disableErrorReporting)
	{
		cjErrorsToReport = 0;
	}
	if(!options || !options.disableLoadTimeReporting)
	{
		cjInitTimeStamp = Date.now();
	}
	if(options && options.clipboardMode)
	{
		if (options.clipboardMode == "system")
			cjClipboardMode = "system";
		else
			cjClipboardMode = "java";
	}
	if(options && options.enableProguardTrace)
	{
		cjReflectionClasses = {};
	}
	if(options && options.enableInputMethods)
	{
		cjEnableInputMethods = 1;
	}
	if(options && options.enablePreciseClassLoaders)
	{
		cjEnablePreciseClassLoaders = 1;
	}
	if(options && options.enablePreciseAppletArchives)
	{
		cjEnablePreciseAppletArchives = 1;
	}
	cheerpjSetStatus("CheerpJ is initializing");
	if(!cjIsWorker)
		cheerpjAddCSS(document, loaderPath + "/cheerpj.css");
	cheerpjPendingLoads = 6;
	var disableWasm = options && options.disableWasm;
	if(!disableWasm && self.WebAssembly)
	{
		cheerpjAddScript(loaderPath + "/jni.js", cheerpjLoaderReady);
		cheerpjLoadFile(loaderPath + "/jni.wasm", cheerpjLoaderReady);
	}
	else
	{
		cheerpjAddScript(loaderPath + "/jnilegacy.js", cheerpjLoaderReady);
		cheerpjLoadFile(loaderPath + "/jni.mem.txt", cheerpjLoaderReady);
	}
	cheerpjAddScript(loaderPath + "/64bit.js", cheerpjLoaderReady);
	cheerpjAddScript(loaderPath + "/cheerpj.js", cheerpjLoaderReady);
	cheerpjAddScript(loaderPath + "/cheerpOS.js", cheerpjLoaderReady);
	threads[0].state = "BLOCKED_ON_INIT";
	threads[0].continuationStack.unshift({func:function(args)
		{
			cheerpjEnsureInitialized(args, null);
		}, args: "N4java4lang6Object"});
	threads[0].continuationStack.unshift({func:function(args)
		{
			cheerpjEnsureInitialized(args, null);
		}, args: "N4java4lang6String"});
	threads[0].continuationStack.unshift({func:function(args)
		{
			cheerpjEnsureInitialized(args, null);
		}, args: "N4java4lang5Class"});
	threads[0].continuationStack.unshift({func:function(args)
		{
			cheerpjEnsureInitialized(args, null);
		}, args: "N4java4lang6System"});
	threads[0].continuationStack.unshift({func:function(args)
		{
			cheerpjAddPrimitiveClass("boolean");
			cheerpjAddPrimitiveClass("byte");
			cheerpjAddPrimitiveClass("char");
			cheerpjAddPrimitiveClass("short");
			cheerpjAddPrimitiveClass("int");
			cheerpjAddPrimitiveClass("long");
			cheerpjAddPrimitiveClass("float");
			cheerpjAddPrimitiveClass("double");
			cheerpjAddPrimitiveClass("void");
		}, args: null});
	threads[0].continuationStack.unshift({func:function(args)
		{
			cheerpjEnsureInitialized(args, null);
		}, args: "N4java4lang4Math"});
	cheerpjAddScript(loaderPath + "/runtime/rt.jar.js", cheerpjLoaderReady);
	var ret=cheerpjRunStaticMethod(threads[0], "java/lang/System", cjSystemInitializeSystemClass);
	threads[0].continuationStack.unshift({func:function(args)
		{
			// Enable all threads waiting for init
			cjInitDone = 1;
			for(var i=0;i<threads.length;i++)
			{
				if(threads[i].state == "BLOCKED_ON_INIT")
					threads[i].state = "READY"
			}
		}, args: null});
	var javaProperties = options && options.javaProperties ? options.javaProperties : null;
	if(javaProperties)
	{
		for(var i=0;i<javaProperties.length;i++)
		{
			var p = javaProperties[i];
			var s = p.split("=");
			if(s.length != 2)
			{
				console.log("Unsupported property definition '"+p+"'. Expected format 'key=value'");
				continue;
			}
			ret = cheerpjRunStaticMethod(threads[0], "java/lang/System", cjSystemSetProperty, s[0], s[1]);
		}
	}
	// Find the applet tag and create the applet viewer
	if(!cjIsWorker)
	{
		if(!cheerpjAppletObserver)
			cheerpjAttachBodyObserver(false);
	}
	else
		cheerpjSchedule();
	return ret;
}

function cheerpjJNILongRetWrapper(jniFunc, paramsArray, p)
{
	var a={f:cheerpjJNILongRetWrapper,pc:0,p:p,s0:paramsArray}
	// Inject this wrapper as the parent
	paramsArray.push(a);
	// Prepend an object to store the 64bit result
	paramsArray.unshift(new Uint8Array(8),0);
	a.pc=0;
	jniFunc.apply(null, paramsArray);
	var paramsArray=a.s0;
	// TODO: Optimize
	var tmp = new DataView(paramsArray[0].buffer);
	// TODO: Highint should have reversed entries
	hSlot = tmp.getInt32(0,true);
	return tmp.getInt32(4,true);
}

function cheerpjEnsureInitialized(mangledName, p)
{
	assert(mangledName[0] == 'N');
	// Check the guard, the fast path does not require a stacklet
	if(self[mangledName + 'G'])
		return;
	// Slow path, the guard is either not existing or still uninitialized
	var a={p:p,f:cheerpjEnsureInitialized,pc:0,mangledName:mangledName};
	a.pc=0;icjLoadWeakClass(mangledName, a, false);
	assert(self.hasOwnProperty(mangledName));
	a.pc=1;cheerpjClassInit(mangledName, a);
}

var cheerpjSafeInitMap = {}

function cheerpjSafeInitGuard(className)
{
	if(!cheerpjSafeInitMap.hasOwnProperty(className))
	{
		// The class is not initialized yet, make currentThread it's init thread
		cheerpjSafeInitMap[className] = { initThread: currentThread, blockedThreads: [] };
		return false;
	}
	// If it's a recursive init from the current thread don't enter the init again
	var initData = cheerpjSafeInitMap[className];
	if(initData.initThread == currentThread)
		return true;
	// A different thread is trying to init the class, block it
	buildContinuations(cheerpjSafeInitGuard.caller.arguments[0].p, true);
	currentThread.state = "BLOCKED_ON_SAFE_INIT";
	initData.blockedThreads.push(currentThread);
	throw "CheerpJContinue";
}

function cheerpjSafeInitFinish(className)
{
	var initData = cheerpjSafeInitMap[className];
	assert(initData.initThread == currentThread);
	for(var i=0;i<initData.blockedThreads.length;i++)
	{
		assert(initData.blockedThreads[i].state == "BLOCKED_ON_SAFE_INIT");
		initData.blockedThreads[i].state = "READY";
	}
	delete cheerpjSafeInitMap[className];
}

function cheerpjThrow(a, ex)
{
	// Look for an exception handler in the stacklet chain, so that we can skip buildContinuations for all methods without handlers
	var curA = a;
	while(curA)
	{
		assert(curA.f);
		var exFuncName = 'e' + curA.f.name.substr(1);
		if(!self.hasOwnProperty(exFuncName))
		{
			curA = curA.p;
			continue;
		}
		// Flatten the surviving stack to continuations
		buildContinuations(curA, false);
		break;
	}
	// Now find the first method in the continuation stack that has a exception handling function
	// We can pop the elements along the way, as the stack is unrolled until handling happens
	while(currentThread.continuationStack.length)
	{
		var c = currentThread.continuationStack.pop();
		if(!c.args.f)
			continue;
		var exFuncName = 'e' + c.args.f.name.substr(1)
		if(!self.hasOwnProperty(exFuncName))
			continue;
		var exFunc = self[exFuncName];
		// Ok, we got a possible handler
		var ret = exFunc(c.args, ex);
		if(c.args.pc == -1)
		{
			// PC was invalidated, so this handler did not match for the exception
			continue;
		}
		// The exception handler returned cleanly we can restart from the caller of this function
		currentThread.retValue = ret;
		currentThread.state = "READY";
		throw "CheerpJContinue";
	}
	if(currentThread.continuationStack.length == 0)
	{
		var detailMessage = "";
		if(ex.detailMessage1)
			detailMessage = String.fromCharCode.apply(null, ex.detailMessage1.value0).substr(1);
		if(currentThread.parent)
			currentThread.parent.endPromise.fail(detailMessage);
		else if(cjErrorsToReport && ex.constructor.name != "N4java4lang11ThreadDeath")
		{
			var message = "Unhandled exception "+ex.constructor.name+" "+detailMessage;
			if(ex.backtrace0)
				message += "/" + ex.backtrace0;
			cjReportError(message);
			console.log(message);
		}
	}
	// Go back to the scheduler
	throw "CheerpJContinue";
}

function cheerpjApplyWithArgs(args)
{
	args.func.apply(null,args.args);
}

function cheerpjRunMain(className, classPath)
{
	// Prepend the /app/ prefix to the classpath
	var paths = classPath.split(':');
	for(var i=0;i<paths.length;i++)
	{
		if(paths[i][0] != '/')
			paths[i] = "/app/" + paths[i];
	}
	classPath = paths.join(':');
	// Create a new thread and a new process
	var process = new CheerpJProcess();
	process.endPromise = cheerpjPromiseAdapter();
	var mainArgs = Array.prototype.slice.call(arguments, 2);
	// Set the classpath
	cheerpjRunStaticMethod(threads[0], "java/lang/System", cjSystemSetProperty, "java.class.path", classPath);
	// Use the LauncherHelper class
	cheerpjRunStaticMethod(threads[0], "sun/launcher/LauncherHelper", cjLauncherCheckAndLoad, /*printToStderr*/ 0, /*LM_CLASS*/ 1, className).then(
		function(b){
			// At this point the String class is initialized
			var argsArray = ["[Ljava/lang/String;"];
			for(var i=0;i<mainArgs.length;i++)
				argsArray.push(cjStringJsToJava(mainArgs[i]));
			// LauncherHelper verifies that main exists, so we have binary data for sure
			var classFile = new CheerpJClassFile(b.cheerpjDownload, b.jsName, /*onlyConstantsAndFlags*/false);
			var m = classFile.getMethod("main", "([Ljava/lang/String;)V");
			assert(m);
			console.log("Run main for "+b.jsName);
			var newThread = new CheerpJThread();
			threads.push(newThread);
			process.addThread(newThread);
			return cheerpjRunStaticMethod(newThread, b.jsName, cheerpjCompressSymbol("Z"+cheerpjMangleClassName(b)+"4mainE" + m.i), argsArray);
		}).catch(function(e) { process.endPromise.fail(e); });
	cjScheduleDelayer.port2.postMessage(0);
	return process.endPromise;
}

function cheerpjRunJar(jarName)
{
	if(jarName[0] != '/')
		jarName = "/app/" + jarName;
	// Set the classpath
	cheerpjRunStaticMethod(threads[0], "java/lang/System", cjSystemSetProperty, "java.class.path", jarName);
	// Use the LauncherHelper class
	cheerpjRunStaticMethod(threads[0], "sun/launcher/LauncherHelper", cjLauncherCheckAndLoad, /*printToStderr*/ 0, /*LM_JAR*/ 2, jarName);
	var mainArgs = Array.prototype.slice.call(arguments, 1);
	// Inject a method to receive the returned class and schedule the main
	threads[0].continuationStack.unshift({func:function(args, b)
		{
			// At this point the String class is initialized
			var argsArray = ["[Ljava/lang/String;"];
			for(var i=0;i<args.length;i++)
				argsArray.push(cjStringJsToJava(args[i]));
			// LauncherHelper verifies that main exists, so we have binary data for sure
			var classFile = new CheerpJClassFile(b.cheerpjDownload, b.jsName, /*onlyConstantsAndFlags*/false);
			var m = classFile.getMethod("main", "([Ljava/lang/String;)V");
			assert(m);
			cheerpjRunStaticMethod(threads[0], b.jsName, cheerpjCompressSymbol("Z"+cheerpjMangleClassName(b)+"4mainE" + m.i), argsArray);
			cheerpjSetStatus("Jar is loaded, main is starting");
		}, args:mainArgs});
}


function cheerpjRunJarWithClasspath(jarName, classPath)
{
	if(jarName[0] != '/')
		jarName = "/app/" + jarName;
	// Create a new thread and a new process
	var process = new CheerpJProcess();
	var newThread = new CheerpJThread();
	threads.push(newThread);
	process.addThread(newThread);
	newThread.state = cjInitDone ? "READY" : "BLOCKED_ON_INIT";
	// Set the classpath
	cheerpjRunStaticMethod(newThread, "java/lang/System", cjSystemSetProperty, "java.class.path", jarName+":"+classPath);
	// Use the LauncherHelper class
	cheerpjRunStaticMethod(newThread, "sun/launcher/LauncherHelper", cjLauncherCheckAndLoad, /*printToStderr*/ 0, /*LM_JAR*/ 2, jarName);
	var mainArgs = Array.prototype.slice.call(arguments, 2);
	// Inject a method to receive the returned class and schedule the main
	newThread.continuationStack.unshift({func:function(args, b)
		{
			// At this point the String class is initialized
			var argsArray = ["[Ljava/lang/String;"];
			for(var i=0;i<args.length;i++)
				argsArray.push(cjStringJsToJava(args[i]));
			// LauncherHelper verifies that main exists, so we have binary data for sure
			var classFile = new CheerpJClassFile(b.cheerpjDownload, b.jsName, /*onlyConstantsAndFlags*/false);
			var m = classFile.getMethod("main", "([Ljava/lang/String;)V");
			assert(m);
			cheerpjRunStaticMethod(newThread, b.jsName, cheerpjCompressSymbol("Z"+cheerpjMangleClassName(b)+"4mainE" + m.i), argsArray);
			cheerpjSetStatus("Jar is loaded, main is starting");
		}, args:mainArgs});
}

function cheerpjGetStackEntry(s)
{
	var frames=s.split("  at ");
	if(frames.length == 1)
	{
		// It was not chrome probably, try again
		frames=s.split("@");
	}
	var firstFrame=frames[1];
	var path=firstFrame.split('.js:')[0]+".js";
	return path;
}

function cheerpjGetJSFromClassName(mangledName)
{
	// If the class is not loaded already stop here
	var classConstructor = self[mangledName+"X"];
	if(!classConstructor)
		return null;
	// Produce an error from the class initializer so that we can see the file name
	try
	{
		classConstructor(null);
		debugger
	}
	catch(e)
	{
		var s=e.stack;
		var part=cheerpjGetStackEntry(s);
		var protocolPart = "http://";
		var tmp=part.split(protocolPart);
		if(tmp.length < 2)
		{
			protocolPart = "https://";
			tmp=part.split(protocolPart);
		}
		return protocolPart + tmp[1];
	}
	debugger
}

function cheerpjArrayInstanceof(obj, arrayType, p)
{
	var objConstructorFunc=null;
	if(!Array.isArray(obj))
		return 0;
	var objArrayType = obj[0];
	// Easy case, it's exactly the same type
	if(objArrayType===arrayType)
		return 1;
	// Nope, remove as many array layers as possible on both sides
	while(objArrayType[0]=='[')
	{
		// If the object is an array but the type is not we return false, unless the type is Object
		if(arrayType[0]!='[')
			return arrayType == "Ljava/lang/Object" ? 1 :0;
		objArrayType=objArrayType.substr(1,objArrayType.length-2);
		arrayType=arrayType.substr(1,arrayType.length-2);
	}
	// There are more array layers on the type than on the object, return false
	if(arrayType[0]=='[')
		return 0;
	// Same amount of array layers, now check for inheritance and interfaces
	assert(arrayType[0]=='L');
	assert(objArrayType[0]=='L');
	arrayType = arrayType.substr(1);
	objArrayType = objArrayType.substr(1);
	// TODO: Maybe we could mangle above so that arrays are just an A prefix
	var objArrayClass = cheerpjGetClass(objArrayType);
	objConstructorFunc = cheerpjGetClassConstructor(objArrayClass);
	if(!objConstructorFunc || !self[objConstructorFunc.name+'G'])
	{
		var mangledObjType = cheerpjMangleClassName(objArrayClass);
		var a={p:p,f:cheerpjArrayInstanceof,pc:0,objArrayClass:objArrayClass,arrayType:arrayType};
		a.pc=0;cheerpjEnsureInitialized(mangledObjType, a);
		objConstructorFunc = cheerpjGetClassConstructor(objArrayClass);
	}
	var arrayClass = cheerpjGetClass(arrayType); 
	assert(objConstructorFunc);
	assert(objConstructorFunc.prototype.ifs);
	var isInterface=objConstructorFunc.prototype.ifs.indexOf(arrayType)!=-1;
	if(isInterface)
		return 1;
	var typeConstructorFunc = cheerpjGetClassConstructor(arrayClass);
	assert(typeConstructorFunc);
	if((new objConstructorFunc) instanceof typeConstructorFunc)
		return 1;
	return 0;
}

function cheerpjClassInit(mangledClassName, p)
{
	var cinit=self[mangledClassName + 'X'];
	cinit({p:p,f:null,pc:0});
}

function cjGetClassName(funcName)
{
	if(funcName[0] == '_')
	{
		var compressedName = funcName.substr(1);
		funcName = cheerpjDecompressSymbol(compressedName);
		if(funcName == null)
			funcName = cheerpjDecompressSymbol(compressedName.substr(0, compressedName.length-1));
	}
	var retStart = funcName[0] == 'Z' ? 2 : 1;
	var lastNameStart = retStart;
	assert(funcName[lastNameStart-1] == 'N');
	var prevNameStart = 0;
	var charCodeO = 0x30;
	var charCode9 = 0x39;
	var funcNameLength = funcName.length;
	var nameLength = 0;
	var curPos = lastNameStart;
	while(curPos!=funcNameLength)
	{
		var charCode = funcName.charCodeAt(curPos);
		if(charCode >= charCodeO && charCode <= charCode9)
		{
			nameLength*=10;
			nameLength+=charCode - charCodeO;
			curPos++;
			continue;
		}
		else if(nameLength == 0)
		{
			break;
		}
		prevNameStart = lastNameStart;
		curPos += nameLength;
		lastNameStart = curPos;
		nameLength = 0;
	}
	return funcName.substring(retStart - 1, funcName[lastNameStart] == 'E' ? prevNameStart : lastNameStart);
}

function cjG(a)
{
	// Centralized handler for all guards
	// Deduce the guard to initialize by code inspection
	var code = a.f.toString();
	var guardPos = 0;
	var pcVal = a.pc | 0;
	if(pcVal < 0)
	{
		var pcVal = -pcVal | 0;
		guardPos = pcVal | 0;
		// Skip until the guard, first "a.pc=-" and ";;if((";
		guardPos = guardPos + 12 | 0;
		while(pcVal)
		{
			guardPos = guardPos + 1 | 0;
			pcVal = pcVal / 10 | 0;
		}
	}
	else
	{
		var pc = "a.pc=" + pcVal + ";;if((";
		guardPos = code.indexOf(pc) + pc.length;
	}
	var endOfGuard = code.indexOf("G|0)", guardPos);
	var mangledClassName = code.substring(guardPos, endOfGuard);
	var cinit=self[mangledClassName + 'X'];
	if(cinit===undefined)
	{
		var cl = null;
		if(cjEnablePreciseClassLoaders){
			var className = cjGetClassName(a.f.name);
			cl = self[className].cl;
			if(cl.hasOwnProperty("cl"))
				cl = cl.cl;
		}
		icjLoadWeakClass(mangledClassName, a, false, cl);
		cinit=self[mangledClassName + 'X'];
	}
	// The guard is called again if continuation are required
	cinit({p:a,f:null,pc:0});
}

function cjW(a)
{
	var code = a.f.toString();
	var pc = "a.pc=" + a.pc + ";;if((";
	var guardPos = code.indexOf(pc);
	assert(guardPos >= 0);
	var endOfGuard = code.indexOf("G|0)", guardPos);
	var mangledClassName = code.substring(guardPos+pc.length, endOfGuard);
	if(!self.hasOwnProperty(mangledClassName))
		icjLoadWeakClass(mangledClassName, a, false);
}

var cjGCVersion = 0;

function cjGCMarkObj(q, obj)
{
	// White (Not scanned) -> 0 or old version
	// Grey (Live, but not scanned) -> 1
	// Black (Live scanned) -> 2
	// TODO: Recycle the h value for the hash
	if((obj.g&0xf)==0 || ((obj.g>>4)&0xf) != cjGCVersion)
	{
		//assert(q.indexOf(obj)<0);
		q.push(obj);
		obj.g = (cjGCVersion<<4) | 0x01;
	}
//	if(obj instanceof N4java4lang3ref13WeakReference)
//		debugger
}

function cjGCMarkArray(q, arr)
{
	// Put all the objects in the queue, we don't want to mark arrays
	for(var i=1;i<arr.length;i++)
	{
		var obj=arr[i];
		if(obj instanceof Array)
			cjGCMarkArray(q, obj);
		else if(obj instanceof N4java4lang6Object)
			cjGCMarkObj(q, obj);
	}
}

function cjGC()
{
	var gcStart = performance.now();
	var q = [];
	// We need to scan the whole global space, then the stacks, then the JNI global refs
	for(var n in self)
	{
		// In Java all global are static variables which are inside the prototypes of classes
		if(n[0] != "N")
			continue;
		var v = self[n];
		// We need to skip guards
		if(!(v instanceof Function))
			continue;
		for(var w in v)
		{
			var obj = v[w];
			if(obj instanceof Array)
				cjGCMarkArray(q, obj);
			if(!(obj instanceof N4java4lang6Object))
				continue;
			cjGCMarkObj(q, obj);
		}
	}
	// Stack time
	for(var i=0;i<threads.length;i++)
	{
		var t=threads[i];
		for(var j=0;j<t.continuationStack.length;j++)
		{
			var s=t.continuationStack[j];
			for(var v in s.args)
			{
				var obj = s.args[v];
				if(obj instanceof Array)
					cjGCMarkArray(q, obj);
				if(!(obj instanceof N4java4lang6Object))
					continue;
				cjGCMarkObj(q, obj);
			}
		}
	}
	// TODO: JNI
	// TODO: Finalizable list
	// TODO: Acquire reference lock
	var weakRefs = []
	while(q.length)
	{
		var v = q.pop();
		//assert((v.g&0xf)==1);
		// Special handling for ref types
		// TODO: Soft/Phantom refs?
		if(v instanceof N4java4lang3ref13WeakReference)
		{
			// We don't want to look into this object
			// TODO: Maybe we want to only ignore the 'referent' field
		//	debugger
			weakRefs.push(v);
		}
		else
		{
			for(var w in v)
			{
				var obj = v[w];
				if(obj instanceof Array)
					cjGCMarkArray(q, obj);
				if(!(obj instanceof N4java4lang6Object))
					continue;
				cjGCMarkObj(q, obj);
			}
		}
		// This object is done
		v.g = (v.g&0xf0) | 0x02;
	}
	// Does any weak ref contains an object which is otherwise unreachable?
	for(var i=0;i<weakRefs.length;i++)
	{
		var w = weakRefs[i];
		var referent = w.referent0;
		if(referent == null)
			continue;
		if((referent.g&0xf)<2 || (referent.g>>4)!=cjGCVersion)
		{
			assert((referent.g&0xf)!=1);
			// TODO: Poison the object
			w.discovered3 = N4java4lang3ref9Reference.pending1;
			N4java4lang3ref9Reference.pending1 = w;
			w.referent0 = null;
		}
	}
	if(N4java4lang3ref9Reference.pending1!==null)
	{
		N4java4lang3ref9Reference.lock0.notifyVEV(N4java4lang3ref9Reference.lock0, null);
	}
	var gcEnd = performance.now();
	var gcTime = gcEnd - gcStart;
	cjGCVersion = 1 - cjGCVersion|0;
	console.log("GC TIME",gcTime);
}

function cjCastFailure(a,o)
{
	// While static initialization is incomplete the guard may be undefined even if
	// instances of a given class can actually be valid. To avoid this issue we
	// inspect the calling code to find out if the instanceof check can succeed
	// The effect is that we check twice on failure but use the fast path on success
	// which is more common
	var code = a.f.toString();
	var pc = "a.pc=" + a.pc + ";;if(";
	var checkPos = code.indexOf(pc);
	assert(checkPos >= 0);
	var endOfGuard = code.indexOf("G|0)&&", checkPos);
	var beginOfInstanceOf = code.indexOf(" ", endOfGuard);
	var endOfInstanceOf = code.indexOf(")>>0))", endOfGuard);
	var instanceOfStatement = code.substring(beginOfInstanceOf, endOfInstanceOf);
	try
	{
		// The statement may fail if the checked class is not defined
		var f = new Function("a", "return a"+instanceOfStatement);
		var ret=f(o);
		if(ret)
		{
			// The instanceof check succeeded, so we can let program continue
			return;
		}
	}
	catch(e)
	{
		debugger
	}
	cjCastThrow(a);
}

function cjCastThrow(a)
{
	cheerpjEnsureInitialized("N4java4lang18ClassCastException", a);
	var ex=new N4java4lang18ClassCastException();
	// TODO: Stack trace, constructor
	cheerpjThrow(a, ex);
}

function cheerpjSetAppPrefix(p)
{
	appUrlPrefix = p;
}

function cjGlobalDynamic(name)
{
	var ret = self[name];
	return ret ? ret : null;
}

function cjMethodDynamic(name, compressHint, suffix)
{
	if(compressHint && self.hasOwnProperty(compressHint))
		return self[compressHint];
	var plainName = name;
	if(suffix)
		plainName += suffix;
	if(self.hasOwnProperty("_"+plainName))
		return self["_"+plainName];
	// Try the compressed one otherwise
	var compressedName = cheerpjCompressSymbol(name);
	if(suffix)
		compressedName += suffix;
	return self["_"+compressedName];
}

function cheerpjResolveVirtualIndex(c, methodName, descriptor, p)
{
	var a={p:p,f:cheerpjResolveVirtualIndex,pc:0,c:c,curClass:null,classFile:null,mangledName:null,methodName:methodName,descriptor:descriptor}
	var curClass = a.curClass = c;
	var classFile = null;
	// We need to load the class and all the bases
	while(1){
		if(!curClass.cheerpjDownload)
			cheerpjClassLoadFile(a, curClass, 0);
		a.pc=0;;
		if(classFile)
			classFile.addClassFromBytes(curClass.cheerpjDownload, curClass.jsName, [])
		else
		{
			classFile = a.classFile = new CheerpJClassFile(curClass.cheerpjDownload, curClass.jsName, /*onlyConstantsAndFlags*/false);
			// Get modifiers now, if it is an interface we actually need to just compress the name
			if(classFile.getModifiers() & 0x200)
				return -1;
		}
		// Find out the base class
		var mangledName = a.mangledName = cheerpjMangleClassName(curClass);
		assert(mangledName[0] != 'A');
		a.pc=1;cheerpjEnsureInitialized(mangledName, a);
		var superProto = cheerpjGetClassConstructor(curClass).prototype;
		var superConstructor = Object.getPrototypeOf(superProto).constructor;
		if(superConstructor === Object)
			break;
		var demangledSuperName = decodeClassName(superConstructor.name);
		curClass = a.curClass = cheerpjGetClass(demangledSuperName);
	}
	return classFile.getVirtualIndex(methodName, descriptor);
}

function cheerpjResolveMethod(c, methodName, descriptor, p)
{
	var a={p:p,f:cheerpjResolveMethod,pc:0,c:c,methodName:methodName,descriptor:descriptor}
	var classFile = null;
	// We need to load the class and all the bases
	if(!c.cheerpjDownload)
		cheerpjClassLoadFile(a, c, 0);
	a.pc=0;;
	var classFile = new CheerpJClassFile(c.cheerpjDownload, c.jsName, /*onlyConstantsAndFlags*/false);
	return classFile.getMethod(methodName, descriptor);
}

function cheerpjSetStatus(s, elem)
{
	// Status reporting stops at first null
	if(cjStatus == null)
		return;
	cjStatus = s;
	var display = elem;
	if(display == null && !cjIsWorker)
		display = cjDisplay;
	if(display)
	{
		var computedHeight = display.offsetHeight;
		if(computedHeight <= 266 + 80)
		{
			cjStatus = null;
			return;
		}
		if(s == null)
			display.classList.remove("status");
		else
		{
			display.classList.add("status");
			display.setAttribute("data-status", s);
		}
	}
	else if(s != null)
		console.log(s);
}

function cheerpjForceStatus(s)
{
	cjStatus = s;
	var display = null;
	if(!cjIsWorker)
		display = cjDisplay;
	if(display)
	{
		display.classList.remove("statusflash");
		if(s == null)
		{
			display.classList.remove("status");
			display.classList.remove("cheerpjLocked");
			var objs = document.getElementsByTagName("object");
			for(var i = 0; i < objs.length; i++)
			{
				if(objs[i].hasAttribute("data-cheerpj"))
				{
					objs[i].classList.remove("cheerpjLocked");
				}
			}
		}
		else
		{
			display.classList.add("status");
			display.classList.add("cheerpjLocked");
			var objs = document.getElementsByTagName("object");
			for(var i = 0; i < objs.length; i++)
			{
				if(objs[i].hasAttribute("data-cheerpj"))
				{
					objs[i].classList.add("cheerpjLocked");
				}
			}
			display.setAttribute("data-status", s);
		}
	}
	else if(s != null)
		console.log(s);
}

function cheerpjFlashStatus(s)
{
	var display = cjDisplay;
	if(display == null)
		return;
	if(cjStatus != null)
		return;
	display.classList.remove("statusflash");
	// Force reflow to restart the animation
	void display.offsetWidth;
	display.setAttribute("data-status", s);
	display.classList.add("status");
	display.classList.add("statusflash");
	display.addEventListener("animationend", function() { display.classList.remove("statusflash"); display.classList.remove("status");});
}

function cheerpjEnableClassFilesTracing(callback)
{
	cjClassFilesTracer = callback;
}

function cjCallImpl(objOrClassName, methodName, args)
{
	if((typeof(objOrClassName) == "string") || (objOrClassName instanceof String))
		return cheerpjRunStaticMethod(threads[0], "com/leaningtech/CallHelper", cjCallHelperCallStatic, objOrClassName, methodName, args, args.length);
	else
		return cheerpjRunStaticMethod(threads[0], "com/leaningtech/CallHelper", cjCallHelperCall, objOrClassName, methodName, args, args.length);
}

function cjCall(objOrClassNameOrInvoker, methodName)
{
	var args = [].splice.call(arguments, 2);
	if(objOrClassNameOrInvoker instanceof Function){
		args.unshift(methodName);
		return objOrClassNameOrInvoker.apply(null, args);
	}else{
		return cjCallImpl(objOrClassNameOrInvoker, methodName, args);
	}
}

function cjResolveCallImpl(forWorker, className, methodName, t)
{
	var types = null;
	var typesLen = 0;
	if(Array.isArray(t))
	{
		types = t;
		typesLen = t.length;
	}
	return cheerpjRunStaticMethod(threads[0], "com/leaningtech/CallHelper", cjCallHelperResolveCall, className, methodName, types, typesLen).then(function(m)
	{
		if(m == null)
			return null;
		return cjGetMethodInvoker(m, forWorker);
	});
}

function cjResolveCall(className, methodName, t)
{
	return cjResolveCallImpl(false, className, methodName, t);
}

function cjResolveCallWorker(className, methodName, t)
{
	return cjResolveCallImpl(true, className, methodName, t);
}

function cjResolveNew(className, t)
{
	var types = null;
	var typesLen = 0;
	if(Array.isArray(t))
	{
		types = t;
		typesLen = t.length;
	}
	return cheerpjRunStaticMethod(threads[0], "com/leaningtech/CallHelper", cjCallHelperResolveNew, className, types, typesLen).then(function(m)
	{
		if(m == null)
			return null;
		return cjGetNewInvoker(m);
	});
}

function cjCallSync(objOrClassName, methodName, args)
{
	assert(!cjForceSync);
	cjForceSync = true;
	assert(threads[0].continuationStack.length == 0);
	cjCall(objOrClassName, methodName, args);
	// The thread may not have finished if an exception is raised, try again
	while(threads[0].state == "READY")
		cheerpjSchedule();
	assert(threads[0].continuationStack.length == 0);
	cjForceSync = false;
	var ret = threads[0].retValue;
	threads[0].retValue = null;
	if(ret instanceof N4java4lang6String)
		ret = String.fromCharCode.apply(null, ret.value0).substr(1);
	return ret;
}

function cjNew(classNameOrInvoker)
{
	var args = [].splice.call(arguments, 1);
	if(classNameOrInvoker instanceof Function){
		return classNameOrInvoker.apply(null, args);
	}else{
		return cheerpjRunStaticMethod(threads[0], "com/leaningtech/CallHelper", cjCallHelperCreate, classNameOrInvoker, args, args.length);
	}
}

function cjEnsureLinearStack()
{
	var t = currentThread;
	if(t.linearStack == 0)
	{
		// The scheduler have already set it otherwise
		t.curStack = t.linearStack = CheerpJAllocStack();
		CheerpJSetStack(t.curStack);
	}
}

function cjPushLocalRef(o)
{
	if(o===null)return 0;
	var ret=currentThread.localRefs.length;
	currentThread.localRefs.push(o);
	return ret;
}

var cjGlobalRefs=[undefined];

function cjAddGlobalRef(o)
{
	var i=cjGlobalRefs.indexOf(null);
	if(i < 0){
		var ret=cjGlobalRefs.length;
		cjGlobalRefs.push(o);
		return -ret|0;
	}else{
		cjGlobalRefs[i]=o;
		return -i|0;
	}
}

function cjDeleteGlobalRef(o)
{
	cjGlobalRefs[-o|0]=null;
}

function cjGetRef(f)
{
	if(f>=0)
		return currentThread.localRefs[f|0];
	else
		return cjGlobalRefs[-f|0];
}

var cjErrorsToReport = 3;

function cjReportError(message)
{
	if(cjLocation.protocol == "file:" || cjLocation.hostname == "127.0.0.1" || cjLocation.hostname == "localhost")
	{
		// Do not log all errors from local testing pages
		return;
	}
	if(cjErrorsToReport == 0)
		return;
	var url = cjLocation.protocol + '//' + cjLocation.hostname + ":" + cjLocation.port + cjLocation.pathname;
	var xhr = new XMLHttpRequest()
	console.log("Reporting error: "+message)
	xhr.open("POST","https://docs.google.com/forms/d/e/1FAIpQLScErDRKZvSy1JAdiRSZfAsjf711VWdSdkczuSYHfIHQbtyFXA/formResponse")
	// Google forms does not provide CORS, but we actually don't care
	xhr.onerror=function()
	{
		// TODO: Tell the user that an error has been detected
	};
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("entry.1790791857=" + encodeURIComponent(url) + "&entry.1699159116=" + encodeURIComponent(message));
	cjErrorsToReport--;
}

// Type conversion APIs
function cjStringJavaToJs(javaString)
{
	return String.fromCharCode.apply(null, javaString.value0).substr(1);
}

function cjStringJsToJava(a)
{
	var ret = new N4java4lang6String();
	var value = new Uint16Array(a.length+1);
	for(var i=0;i<a.length;i++)
		value[i+1] = a.charCodeAt(i);
	ret.value0 = value;
	// Support Micro Edition
	if(ret.hasOwnProperty("count2"))
		ret.count2 = a.length;
	return ret;
}

function cjTypedArrayToJava(a)
{
	if(a instanceof Int8Array)
	{
		var ret = new Int8Array(a.length + 1);
		ret.set(a, 1);
		ret[0] = 66;
		return ret;
	}
	else if(a instanceof Uint8Array)
	{
		var ret = new Int8Array(a.length + 1);
		ret.set(new Int8Array(a.buffer), 1);
		ret[0] = 66;
		return ret;
	}
	else if(a instanceof Int16Array)
	{
		var ret = new Int16Array(a.length + 1);
		ret.set(a, 1);
		ret[0] = 83;
		return ret;
	}
	else if(a instanceof Uint16Array)
	{
		var ret = new Uint16Array(a.length + 1);
		ret.set(a, 1);
		ret[0] = 67;
		return ret;
	}
	else if(a instanceof Int32Array)
	{
		var ret = new Int32Array(a.length + 1);
		ret.set(a, 1);
		ret[0] = 73;
		return ret;
	}
	else if(a instanceof Uint32Array)
	{
		var ret = new Int32Array(a.length + 1);
		ret.set(new Int32Array(a.buffer), 1);
		ret[0] = 73;
		return ret;
	}
	else if(a instanceof Float32Array)
	{
		var ret = new Float32Array(a.length + 1);
		ret.set(a, 1);
		ret[0] = 70;
		return ret;
	}
	else if(a instanceof Float64Array)
	{
		var ret = new Float64Array(a.length + 1);
		ret.set(a, 1);
		ret[0] = 68;
		return ret;
	}
	else
		throw "CheerpJ: Invalid type for array conversion";
}

// Worker APIs
function cjWorkerAllocPromiseId(cjWorker, promise)
{
	var emptyId = cjWorker.pendingPromises.indexOf(null);
	if(emptyId >= 0)
	{
		cjWorker.pendingPromises[emptyId] = promise;
		return emptyId;
	}
	else
	{
		cjWorker.pendingPromises.push(promise);
		return cjWorker.pendingPromises.length-1;
	}
}

function cjWorkerInit()
{
	var args = [].splice.call(arguments, 0);
	var ret = cheerpjPromiseAdapter();
	var id = cjWorkerAllocPromiseId(this, ret);
	var d = {f: "cheerpjInit", args: args, id: id, loaderFile: this.loaderFile, appPrefix: cjLocation.origin};
	if(this.w == null)
		ret.d = d;
	else
		this.w.postMessage(d);
	return ret;
}

function cjWorkerFilterArgs(w, args)
{
	var transferables = [];
	for(var i=0;i<args.length;i++)
	{
		var val = args[i];
		if(typeof(val) == "number" || typeof(val) == "string")
			continue;
		else if(val == null)
			continue;
		else if(val.BYTES_PER_ELEMENT)
		{
			transferables.push(val.buffer);
			continue;
		}
		else if(val instanceof Promise)
		{
			throw new Error("CheerpJWorker: Can't transfer Promise. Wait for result using .then(...)");
		}
		else if(val instanceof Object)
		{
			throw new Error("CheerpJWorker: Can't transfer Objects.");
		}
		else
			debugger;
	}
	return transferables;
}

function cjWorkerDo(w, f, args, t)
{
	var ret = cheerpjPromiseAdapter();
	var id = cjWorkerAllocPromiseId(w, ret);
	var d = {f: f, args: args, id: id};
	if(w.w == null)
	{
		ret.d = d;
		ret.t = t;
	}
	else
		w.w.postMessage(d, t);
	return ret;
}

function cjWorkerRunMain()
{
	var args = [].splice.call(arguments, 0);
	var t = cjWorkerFilterArgs(this, args);
	return cjWorkerDo(this, "cheerpjRunMain", args, t);
}

function cjWorkerCall()
{
	var args = [].splice.call(arguments, 0);
	if(args[0] instanceof Function){
		var f = args.shift();
		return f(this, args);
	}else{
		var t = cjWorkerFilterArgs(this, args);
		return cjWorkerDo(this, "cjCall", args);
	}
}

function cjWorkerResolveCall()
{
	var args = [].splice.call(arguments, 0);
	var types = args[2];
	args[2] = null;
	var t = cjWorkerFilterArgs(this, args);
	args[2] = types;
	var ret = cjWorkerDo(this, "cjResolveCall", args, t);
	return ret.then(function(newCode)
	{
		if(newCode == null)
			return null;
		return new Function('w', 'args', newCode);
	});
}

function cjWorkerHandleMessage(e)
{
	// Message from worker
	var d = e.data;
	var w = this.w;
	var p = w.pendingPromises[d.id];
	assert(p);
	w.pendingPromises[d.id] = null;
	if(d.e)
		p.fail(d.e);
	else
		p.done(d.v);
}

function CheerpJWorker()
{
	var loaderFile = cjGetCurrentScript();
	this.pendingPromises = [];
	this.w = null;
	this.loaderFile = loaderFile;
	var w = this;
	// Async load to workaround cross-origin sillyness
	var xhr = new XMLHttpRequest();
	xhr.open("GET", loaderFile);
	xhr.onload = function(e)
	{
		var b = new Blob([xhr.responseText]);
		w.w = new Worker(URL.createObjectURL(b));
		w.w.addEventListener("message", cjWorkerHandleMessage);
		w.w.w = w;
		for(var i=0;i<w.pendingPromises.length;i++)
		{
			var p = w.pendingPromises[i];
			assert(p.d);
			w.w.postMessage(p.d, p.t);
			p.d = null;
		}
	};
	xhr.send();
}

CheerpJWorker.prototype.cheerpjInit = cjWorkerInit;
CheerpJWorker.prototype.cheerpjRunMain = cjWorkerRunMain;
CheerpJWorker.prototype.cjCall = cjWorkerCall;
CheerpJWorker.prototype.cjResolveCall = cjWorkerResolveCall;

function cjHandleWorkerMessage(e)
{
	// Message to worker
	var d = e.data;
	var p = d.id;
	function forwardPromise(v)
	{
		var transferables = [];
		if(v)
		{
			if(v.BYTES_PER_ELEMENT)
				transferables.push(v.buffer);
			else if(v.hasOwnProperty("value0h"))
				v = v.value0h * 4294967296 + (v.value0 >>> 0);
			else if(v.hasOwnProperty("value0"))
				v = v.value0;
			else if(v instanceof Object)
				v = "CheerpJWorker: Can't transfer Objects."
		}
		postMessage({id:p, v:v, e:null}, transferables);
	}
	function forwardFailure(e)
	{
		postMessage({id:p, v:null, e:e});
	}
	var args = d.args;
	if(d.f == "cheerpjInit")
	{
		cheerpjSetAppPrefix(d.appPrefix);
		var loaderFile = d.loaderFile;
		loaderPath = loaderFile.substr(0, loaderFile.length - "/loader.js".length);
		cheerpjInit.apply(null, args).then(forwardPromise, forwardFailure);
	}
	else if(d.f == "cheerpjRunMain")
	{
		cheerpjRunMain.apply(null, args).then(forwardPromise, forwardFailure);
	}
	else if(d.f == "cjCall")
	{
		cjCall.apply(null, args).then(forwardPromise, forwardFailure);
	}
	else if(d.f == "cjResolveCall")
	{
		cjResolveCallWorker.apply(null, args).then(forwardPromise, forwardFailure);
	}
	else if(d.f == "cjCallResolved")
	{
		cheerpjRunResolvedMethod.apply(null, args).then(forwardPromise, forwardFailure);
	}
	else
		debugger;
}

if(cjIsWorker)
	self.addEventListener("message", cjHandleWorkerMessage);

// Helpers
function cjN2I(x)
{
	if(x<0)
		return (0x80000000|0);
	else if(x>0)
		return (0x7fffffff|0);
	else
		return 0;
}

// JS interop
function CJBoxedLong(a)
{
	this.value = a;
}

function cjBoxLong(a, b)
{
	return {value0:b, value0h:hSlot};
}

function cjVariadicJavaToJs(dstArray, srcArray)
{
	for(var i=1;i<srcArray.length;i++){
		if(srcArray[i] instanceof N4java4lang6String){
			dstArray.push(cjStringJavaToJs(srcArray[i]));
		}else if(srcArray[i].hasOwnProperty("value0h")){
			dstArray.push(srcArray[i].value0h * 4294967296 + (srcArray[i].value0 >>> 0));
		}else if(srcArray[i].hasOwnProperty("value0")){
			dstArray.push(srcArray[i].value0);
		}else{
			dstArray.push(srcArray[i]);
		}
	}
	return dstArray;
}

function cjJSCall(funcName, args)
{
	var jsArgs = cjVariadicJavaToJs([], args);
	return self[cjStringJavaToJs(funcName)].apply(null, jsArgs);
}

// Tracing API

function cjGetProguardConfiguration()
{
	if(cjReflectionClasses == null)
	{
		console.log("You need to enable proguard tracing. Example cheerpjInit({enableProguardTrace:true}).");
		return;
	}
	var usedClasses = [];
	// Extract initialized classes from their guards
	for(var p in self)
	{
		if(!p.startsWith("N") || !p.endsWith("G") || self[p] !== 1)
			continue;
		var mangledName = p.substring(0, p.length-1);
		if(mangledName.startsWith("N11CRC") || cheerpjIsBootstrapClass(mangledName))
			continue;
		usedClasses.push(decodeClassName(mangledName).split('/').join('.'));
	}
	var outStr = "-keepnames class ** { *; }\n";
	for(var i=0;i<usedClasses.length;i++)
		outStr += "-keep class "+usedClasses[i]+"\n";
	for(var c in cjReflectionClasses)
	{
		if(c.startsWith("CRC"))
			continue;
		outStr += "-keepclassmembers class "+c.split('/').join('.')+" { *; }\n";
	}
	var b = new Blob([outStr],  {type: "text/plain"});
	var u = URL.createObjectURL(b);
	var a = document.createElement("a");
	a.style.display = "none";
	document.body.appendChild(a);
	a.href = u;
	a.download = "cheerpj.pro";
	a.click();
	URL.revokeObjectURL(u);
	document.body.removeChild(a);
}

// Preloading logic

var cheerpjPreloadResources = null;
var cheerpjPreloadTotal = 0;
var cheerpjPreloadCount = 0;

function cheerpjPreload()
{
	if(cheerpjPreloadResources == null)
		return;
	while(cheerpjPreloadCount < 3 && cheerpjPreloadResources.length > 0)
	{
		// Preload file backward, to reduce racing against the runtime
		var filePath = cheerpjPreloadResources.pop();
		// Check if the file is actually already loaded
		if(cheerpjRuntimeResources.indexOf(filePath) >= 0)
			continue;
		var mount = cheerpjGetFSMountForPath(filePath);
		if(!(mount instanceof CheerpJWebFolder))
			continue;
		var fileToLoad = mount.mapPath(mount, filePath.substr(mount.mountPoint.length-1));
		var dl = new mount.downloader(fileToLoad, "GET", "arraybuffer");
		dl.onload = function(dlData)
		{
			cheerpjPreloadCount--;
			cheerpjPreload();
		};
		cheerpjPreloadCount++;
		dl.send();
	}
	var preloadMissing = (cheerpjPreloadResources.length+cheerpjPreloadCount)|0;
	if(cjListener && cjListener.preloadProgress && cheerpjPreloadTotal !== 0)
	{
		// We send loaded, total
		assert(cheerpjPreloadTotal>=preloadMissing);
		cjListener.preloadProgress(cheerpjPreloadTotal-preloadMissing|0, cheerpjPreloadTotal);
	}
	if(preloadMissing === 0)
	{
		cheerpjPreloadResources = null;
		// The preloading list is now empty, stop further notifications
		cheerpjPreloadTotal = 0;
		return;
	}
}

function cheerpjPreloadOne(file)
{
	if(cheerpjPreloadResources == null)
		cheerpjPreloadResources = [file]
	else
		cheerpjPreloadResources.push(file);
	// If a preloading list is not used do not alter the total
	if(cheerpjPreloadTotal !== 0)
		cheerpjPreloadTotal=cheerpjPreloadTotal+1|0;
	cheerpjPreload();
}

function IFrameProxyDownloader(url, method, responseType)
{
	this.url = url;
	this.method = method;
	this.responseType = responseType;
	this.onload = null;
	this.responseURL = null;
	this.response = null;
	this.fileLength = -1;
	assert(IFrameProxyDownloader.iframe);
}

function ipfMessage(e)
{
	var d = e.data;
	for(var i=0;i<IFrameProxyDownloader.pending.length;i=i+1|0)
	{
		if(IFrameProxyDownloader.pending[i].url != d.url)
			continue;
		var dl = IFrameProxyDownloader.pending[i];
		dl.responseURL = d.responseURL;
		dl.response = d.response;
		dl.fileLength = d.fileLength;
		IFrameProxyDownloader.pending.splice(i, 1);
		dl.onload(dl);
		return;
	}
}

function ipfCreateIFrame()
{
	var ret = document.createElement("iframe");
	ret.onload = function(e)
	{
		var i = e.target;
		var c = new MessageChannel();
		var q = IFrameProxyDownloader.portOrQueue;
		c.port1.onmessage = ipfMessage;
		IFrameProxyDownloader.portOrQueue = c.port1;
		i.contentWindow.postMessage({t:"port",port:c.port2}, loaderPath, [c.port2]);
		// Dispatch pending loads
		for(var i=0;i<q.length;i=i+1|0)
			q[i].send();
	};
	ret.src = loaderPath + "/c.html";
	ret.width = "0px";
	ret.height = "0px";
	ret.style.border = "0px";
	ret.style.position = "fixed";
	ret.style.visibility = "hidden";
	IFrameProxyDownloader.iframe = ret;
	if(document.body)
		document.body.appendChild(ret);
	else
		document.addEventListener("DOMContentLoaded", function(e) { document.body.appendChild(IFrameProxyDownloader.iframe); })
}

function ipfSend()
{
	if(Array.isArray(IFrameProxyDownloader.portOrQueue))
	{
		// Not ready, add to queue
		IFrameProxyDownloader.portOrQueue.push(this);
		return;
	}
	// If the same URL is loaded twice from 2 threads each will push itself and eventually both will receive an answer
	IFrameProxyDownloader.pending.push(this);
	IFrameProxyDownloader.portOrQueue.postMessage({t:"load", url: this.url, method: this.method, responseType: this.responseType});
}

// Global data
IFrameProxyDownloader.iframe = null;
IFrameProxyDownloader.portOrQueue = [];
IFrameProxyDownloader.pending = [];

IFrameProxyDownloader.prototype.send = ipfSend;
var cjPredictionsMap={"/lt/runtime/rt.jar.java.net.js":"/lt/runtime/rt.jar.sun.misc.js","/lt/runtime/rt.jar.java.io.js":"/lt/runtime/rt.jar.sun.awt.resources.js","/lt/cheerpj/lib/accessibility.properties":"/lt/runtime/rt.jar.java.io.js","/lt/runtime/rt.jar.java.lang.invoke.js":"/lt/cheerpj/lib/accessibility.properties","/lt/runtime/rt.jar.sun.js":"/lt/runtime/rt.jar.java.lang.invoke.js","/lt/runtime/rt.jar.java.util.function.js":"/lt/runtime/rt.jar.sun.js","/lt/runtime/rt.jar.jdk.js":"/lt/runtime/rt.jar.java.util.function.js","/lt/runtime/rt.jar.java.security.js":"/lt/runtime/rt.jar.jdk.js","/lt/runtime/rt.jar.sun.awt.util.js":"/lt/runtime/rt.jar.java.security.js","/lt/runtime/rt.jar.java.util.concurrent.atomic.js":"/lt/runtime/rt.jar.sun.awt.util.js","/lt/runtime/rt.jar.java.util.concurrent.locks.js":"/lt/runtime/rt.jar.java.util.concurrent.atomic.js","/lt/runtime/rt.jar.sun.java2d.js":"/lt/runtime/rt.jar.java.util.concurrent.locks.js","/lt/runtime/rt.jar.sun.font.js":"/lt/runtime/rt.jar.sun.java2d.js","/lt/runtime/rt.jar.java.awt.geom.js":"/lt/runtime/rt.jar.sun.font.js","/lt/runtime/rt.jar.java.awt.font.js":"/lt/runtime/rt.jar.java.awt.geom.js","/lt/runtime/rt.jar.java.text.js":"/lt/runtime/rt.jar.java.awt.font.js","/lt/runtime/rt.jar.java.beans.js":"/lt/runtime/rt.jar.java.text.js","/lt/runtime/rt.jar.sun.applet.js":"/lt/runtime/rt.jar.java.beans.js","/lt/cheerpj/lib/security/java.security":"/lt/runtime/rt.jar.sun.applet.js","/lt/runtime/rt.jar.sun.security.provider.js":"/lt/cheerpj/lib/security/java.security","/lt/runtime/rt.jar.sun.security.util.js":"/lt/runtime/rt.jar.sun.security.provider.js","/lt/cheerpj/lib/security/java.policy":"/lt/runtime/rt.jar.sun.security.util.js","/lt/runtime/rt.jar.java.awt.event.js":"/lt/cheerpj/lib/security/java.policy","/lt/runtime/rt.jar.sun.java2d.pipe.js":"/lt/runtime/rt.jar.java.awt.event.js","/lt/runtime/rt.jar.sun.awt.dnd.js":"/lt/runtime/rt.jar.sun.java2d.pipe.js","/lt/runtime/rt.jar.sun.java2d.loops.js":"/lt/runtime/rt.jar.sun.nio.ch.js","/lt/runtime/rt.jar.sun.awt.image.js":"/lt/runtime/rt.jar.sun.java2d.loops.js","/lt/runtime/rt.jar.java.awt.image.js":"/lt/runtime/rt.jar.sun.awt.image.js","/lt/runtime/rt.jar.javax.swing.text.html.parser.js":"/lt/runtime/rt.jar.javax.swing.text.html.js","/lt/runtime/rt.jar.javax.swing.text.html.js":"/lt/runtime/rt.jar.sun.awt.event.js","/lt/runtime/rt.jar.sun.awt.event.js":"/lts/rt.jar","/lt/runtime/rt.jar.sun.nio.fs.js":"/lt/cheerpj/lib/tzdb.dat","/lt/cheerpj/lib/tzdb.dat":"/lt/cheerpj/lib/currency.properties","/lt/cheerpj/lib/currency.properties":"/lt/cheerpj/lib/currency.data","/lt/cheerpj/lib/currency.data":"/lt/runtime/rt.jar.sun.text.js","/lt/runtime/rt.jar.sun.text.js":"/lt/cheerpj/lib/ext/localedata.jar","/lt/cheerpj/lib/ext/localedata.jar":"/lt/runtime/rt.jar.sun.util.locale.js","/lt/runtime/rt.jar.sun.util.locale.js":"/lt/runtime/rt.jar.sun.awt.geom.js","/lt/runtime/rt.jar.sun.awt.geom.js":"/lt/runtime/rt.jar.java.nio.js","/lt/runtime/rt.jar.java.nio.js":"/lt/cheerpj/Arial.ttf","/lt/cheerpj/Arial.ttf":"/lt/cheerpj/fontconfig.properties","/lt/cheerpj/fontconfig.properties":"/lt/cheerpj/lib/fonts/fallback","/lt/cheerpj/lib/fonts/fallback":"/lt/cheerpj/lib/fonts/index.list","/lt/cheerpj/lib/fonts/index.list":"/lt/cheerpj/lib/fonts/badfonts.txt","/lt/cheerpj/lib/fonts/badfonts.txt":"/lt/cheerpj/lib/fonts/LucidaSansRegular.ttf","/lt/cheerpj/lib/fonts/LucidaSansRegular.ttf":"/lt/runtime/rt.jar.javax.swing.undo.js","/lt/runtime/rt.jar.javax.swing.undo.js":"/lt/runtime/rt.jar.java.awt.datatransfer.js","/lt/runtime/rt.jar.java.awt.datatransfer.js":"/lt/runtime/rt.jar.com.sun.beans.js","/lt/runtime/rt.jar.com.sun.beans.js":"/lt/runtime/rt.jar.javax.swing.text.js","/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.dom.js":"/lt/runtime/rt.jar.org.js","/lt/runtime/rt.jar.org.js":"/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.impl.dv.js","/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.impl.dv.js":"/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.impl.dtd.js","/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.impl.dtd.js":"/lt/runtime/rt.jar.com.sun.xml.internal.stream.js","/lt/runtime/rt.jar.com.sun.xml.internal.stream.js":"/lt/runtime/rt.jar.com.sun.org.apache.xerces.js","/lt/runtime/rt.jar.com.sun.org.apache.xerces.js":"/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.impl.js","/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.impl.js":"/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.util.js","/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.util.js":"/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.parsers.js","/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.parsers.js":"/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.jaxp.js","/lt/runtime/rt.jar.com.sun.org.apache.xerces.internal.jaxp.js":"/lt/cheerpj/lib/jaxp.properties","/lt/cheerpj/lib/jaxp.properties":"/lt/runtime/rt.jar.javax.xml.js","/lt/runtime/rt.jar.javax.xml.js":"/lt/runtime/rt.jar.java.awt.dnd.js","/lt/runtime/rt.jar.java.awt.dnd.js":"/lt/runtime/rt.jar.java.awt.peer.js","/lt/runtime/rt.jar.java.util.stream.js":"/lt/runtime/rt.jar.com.sun.java.js","/lt/runtime/rt.jar.com.sun.java.js":"/lt/runtime/rt.jar.com.sun.swing.js","/lt/runtime/rt.jar.com.sun.swing.js":"/lt/runtime/rt.jar.javax.swing.border.js","/lt/runtime/rt.jar.javax.swing.border.js":"/lt/runtime/rt.jar.javax.swing.plaf.js","/lt/runtime/rt.jar.javax.swing.plaf.js":"/lt/runtime/rt.jar.javax.swing.plaf.basic.js","/lt/runtime/rt.jar.javax.swing.plaf.basic.js":"/lt/runtime/rt.jar.javax.swing.plaf.metal.js","/lt/runtime/rt.jar.javax.swing.plaf.metal.js":"/lt/cheerpj/lib/swing.properties","/lt/cheerpj/lib/swing.properties":"/lt/runtime/rt.jar.sun.swing.js","/lt/runtime/rt.jar.sun.swing.js":"/lt/runtime/rt.jar.javax.swing.event.js","/lt/runtime/rt.jar.javax.swing.event.js":"/lt/runtime/rt.jar.javax.swing.js","/lt/runtime/rt.jar.javax.swing.js":"/lt/runtime/rt.jar.java.util.regex.js","/lt/runtime/rt.jar.java.util.regex.js":"/lt/runtime/rt.jar.java.js","/lt/runtime/rt.jar.java.js":"/lt/runtime/rt.jar.sun.awt.im.js","/lt/runtime/rt.jar.sun.awt.im.js":"/lt/runtime/rt.jar.javax.js","/lt/runtime/rt.jar.javax.js":"/lt/runtime/rt.jar.java.awt.im.js","/lt/runtime/rt.jar.java.awt.im.js":"/lt/runtime/rt.jar.java.awt.color.js","/lt/runtime/rt.jar.java.awt.color.js":"/lt/runtime/rt.jar.java.awt.image.js","/lt/runtime/rt.jar.sun.awt.datatransfer.js":"/lt/cheerpj/lib/content-types.properties","/lt/cheerpj/lib/content-types.properties":"/lt/runtime/rt.jar.sun.net.www.js","/lt/runtime/rt.jar.sun.net.www.js":"/lt/runtime/rt.jar.java.util.regex.js","/lt/runtime/rt.jar.javax.swing.tree.js":"/lt/runtime/rt.jar.java.awt.peer.js","/lt/runtime/rt.jar.javax.security.js":"/lt/cheerpj/lib/security/java.security","/lt/runtime/rt.jar.java.util.zip.js":"/lts/rt.jar","/lt/runtime/rt.jar.java.util.jar.js":"/lt/cheerpj/lib/security/local_policy.jar","/lt/cheerpj/lib/security/local_policy.jar":"/lt/cheerpj/lib/security/US_export_policy.jar","/lt/cheerpj/lib/security/US_export_policy.jar":"/lt/runtime/rt.jar.sun.nio.fs.js","/lt/runtime/rt.jar.com.sun.crypto.provider.js":"/lt/runtime/rt.jar.sun.security.ssl.js","/lt/runtime/rt.jar.com.sun.js":"/lt/runtime/rt.jar.sun.security.js","/lt/runtime/rt.jar.sun.security.js":"/lt/runtime/rt.jar.javax.crypto.js","/lt/runtime/rt.jar.javax.crypto.js":"/lt/runtime/rt.jar.java.nio.js","/lt/runtime/rt.jar.javax.imageio.js":"/lt/runtime/rt.jar.com.sun.imageio.js","/lt/runtime/rt.jar.com.sun.imageio.js":"/lt/runtime/rt.jar.com.sun.imageio.plugins.jpeg.js","/lt/runtime/rt.jar.com.sun.imageio.plugins.jpeg.js":"/lt/runtime/rt.jar.sun.nio.fs.js","/lt/runtime/rt.jar.java.util.prefs.js":"/lt/runtime/rt.jar.javax.xml.js","/lt/runtime/rt.jar.com.sun.org.apache.xalan.internal.xsltc.js":"/lt/runtime/rt.jar.sun.net.js","/lt/runtime/rt.jar.com.sun.org.apache.xalan.js":"/lt/runtime/rt.jar.sun.net.www.js","/lt/runtime/rt.jar.com.sun.org.apache.xml.internal.serializer.js":"/lt/runtime/rt.jar.com.sun.org.apache.xml.internal.utils.js","/lt/runtime/rt.jar.com.sun.org.apache.xml.internal.utils.js":"/lt/runtime/rt.jar.com.sun.imageio.js"}

// Generated symbols


var cjSystemInitializeSystemClass = "o4F0ystem21initializegfbYClassE37";
var cjSystemSetProperty = "o4F1ystem11setPropertyE24";

var cjLauncherCheckAndLoad = "c4FbMlG9cq$a_sCunE5rjSDiXYdruTUWbHGIwZqPdWGjasJNnn";

var cjCallHelperCallStatic = "c4pbQ3qZcqu0CallHelper10callSe4ZWcE5";
var cjCallHelperCall = "c4pbQ3qZcqu0CallHelper4callE6";
var cjCallHelperResolveCall = "c4pbQ3qZcqeZCallHelper11eu1WlveejHWE7";
var cjCallHelperResolveNew = "c4pbQ3qZcqeZCallHelper10eufYlveNewE9";
var cjCallHelperCreate = "c4pbQ3qZcq00CallHelper6createE8";

var cjAppletViewerConstuctor = "_c4pbQxrZtgmxb$g9O2ZZcX0lcHfreNThn";
;
var cjJNLPSetServiceManager = "c4Vbzla_g3S8uJZAqCmBc0ayqezxlrm5KecepXubE3";

var cjJNLPServiceManagerConstructor = "_c4pbQ3qZww84zzkRbX9SjqdGbre7evaNTxn";

var cjThreadExit="v17";
