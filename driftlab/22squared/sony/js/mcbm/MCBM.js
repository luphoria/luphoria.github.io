var MCBM = MCBM || {}; // Minecraft Bookmarklet Global object scope definition

// tracking
MCBM.GA_ACCOUNT = "UA-26457160-5";
MCBM.PAGE_URI = "/js/mc-bookmarklet.js";
MCBM.PAGE_TITLE = "Sony Xperia Minecraft Bookmarklet";
MCBM.DEBUG = false;

// social sharing
MCBM.fbShareURL = {
  eng: "http://campaigns.sonymobile.com/minecraft/like_eng.html?2",
  esp: "http://campaigns.sonymobile.com/minecraft/like_esp.html"
};

MCBM.fbShareCopy = {
  eng: "Play Minecraft™ Anywhere http://campaigns.sonymobile.com/minecraft Time to kill? Take it out on the web.",
  esp: "Juega Minecraft™ donde quiera sea http://campaigns.sonymobile.com/minecraft Si tienes tiempo de sobra, desquítate con el Internet."
};

MCBM.twShareURL = {
  eng: "http://campaigns.sonymobile.com/minecraft/index.php?l=en",
  esp: "http://campaigns.sonymobile.com/minecraft/index.php?l=sp"
};

MCBM.twShareCopy = {
  eng: "I just wreaked havoc with the the new Minecraft browser game from Sony Mobile.",
  esp: "Acabo de causar estragos con el nuevo juego de navegador Minecraft de Sony móvil."
};

if (typeof window.mcbmLang === "undefined") {
  MCBM.language = "eng";
} else {
  MCBM.language = window.mcbmLang;
}

MCBM.shareFbURI = "http://www.facebook.com/sharer.php?u="+encodeURIComponent(MCBM.fbShareURL[MCBM.language])+"&t="+encodeURIComponent(MCBM.fbShareCopy[MCBM.language]);
MCBM.shareTwitterURI = "http://twitter.com/home?status="+encodeURIComponent(MCBM.twShareCopy[MCBM.language])+" "+encodeURIComponent(MCBM.twShareURL[MCBM.language]);

// location
MCBM.initLocationURI = window.location;

if (typeof window.mcbmRootURI === "undefined") {
  var href = window.location.href;
  MCBM.rootURI = href.substring(0, href.lastIndexOf('/'));
} else {
  MCBM.rootURI = window.mcbmRootURI.substring(0, window.mcbmRootURI.lastIndexOf('/'));
}

// Bookmarklet events
MCBM.events = {};

// loading events
MCBM.events.ITEM_LOADED = "mcbmItemLoaded";
MCBM.events.LOAD_ERROR = "mcbmLoadError";

// creeper game events 
MCBM.events.CREEPER_LOADED = "creeperLoaded";
MCBM.events.CREEPER_AUDIO_LOAD_COMPLETE = "audioLoadComplete.creeper";
MCBM.events.CREEPER_AUDIO_LOAD_ERROR = "audioLoadError.creeper";
MCBM.events.CREEPER_EXPLODED = "creeperExploded";
MCBM.events.EXPLOSION_COMPLETE = "explosionComplete";

//pickaxe game events
MCBM.events.MINE_START = "mine-start";
MCBM.events.MINE_END = "mine-end";
MCBM.events.PICKAXE_AUDIO_LOAD_COMPLETE  = "audioLoadComplete.pickaxe";
MCBM.events.PICKAXE_AUDIO_LOAD_ERROR = "audioLoadError.pickaxe";

// ui events
MCBM.events.OPEN_UI = "mcbmOpenUI";
MCBM.events.OPEN_UI_COMPLETE = "mcbmOpenUIComplete";
MCBM.events.CLOSE_UI_COMPLETE = "mcbmCloseUIComplete";
MCBM.events.PLAY_CREEPER_CLICK = "playCreeperClick";
MCBM.events.PLAY_PICKAXE_CLICK = "playPickaxeClick";
MCBM.events.EXIT_CLICK = "mcbmExitClick";
MCBM.events.UI_MOUSE_MOVE = "mcbmUIMouseMove";

// config
MCBM.LOAD_TIMEOUT = 5000;
MCBM.MAX_WIDTH = 2000;
MCBM.MAX_HEIGHT = 1200;
MCBM.webGLenabled = false;
MCBM.errorDimensions = {
  'eng': { width: 365, height: 162 },
  'esp': { width: 365, height: 208 }
}

// timer
MCBM.startTime = 0;
// Numbers in seconds to define actual program running time values when duration is tracked
// based on 22squareds def:
// 0 secs (called in init) = 1 min
// 61 secs = 2 min
// 121 secs = 3 min
// 181 secs = 4 min
// 241 secs = 5 min
MCBM.trackDurations = [61, 121, 181, 241];
MCBM.curDurationIndex = 0;

// utility functions
MCBM.randomInRange = function(min, max) {
	return min + (Math.random() * (max - min));
};

MCBM.randomFromArray = function(array) {
 return	array[Math.floor(Math.random() * array.length)];
};

MCBM.getDuration = function() {
  var duration = new Date().getTime() - MCBM.startTime,
      durSec = Math.floor(duration / 1000),
      durMin = Math.floor(durSec / 60),
      durationStr = (durMin + 1) + ' min';
  
  //debug.log('get duration: '+duration+' sec: '+durSec+' min: '+durMin+' durationStr: '+durationStr);
  
  return durationStr;
}

MCBM.getTrackDurationDelay = function() {
  var elapsed = new Date().getTime() - MCBM.startTime,
      delay = MCBM.trackDurations[MCBM.curDurationIndex] * 1000 - elapsed;
  
  //debug.log('getTrackDurationDelay: '+delay);
  
  return delay;
}

MCBM.trackDurationCallback = function() {
  MCBM.gaTrackEvent('game', 'duration', MCBM.getDuration());
    
  MCBM.curDurationIndex++;
    
  if (MCBM.curDurationIndex < MCBM.trackDurations.length) {
    setTimeout(MCBM.trackDurationCallback, MCBM.getTrackDurationDelay());
  }
}

MCBM.gaTrackPage = function(pageTitle) {
      
    var trackvars = '&utmdt='+pageTitle+'&utmp='+MCBM.PAGE_URI;
    
    if (MCBM.DEBUG) {
      debug.log('GA track page: '+pageTitle+' page uri: '+MCBM.PAGE_URI);
      return;
    }
    
    MCBM.gaUrchinCall(trackvars);
  
};

MCBM.gaTrackEvent = function(category, action, label, value) {
  
  var _label = (typeof label !== "undefined") ? '*'+label : '',
      _val = (typeof value !== "undefined") ?  '('+value+')' : '',
      utme = '5('+category+'*'+action+_label+')'+_val,
      trackvars = '&utmdt='+MCBM.PAGE_TITLE+'&utmp='+MCBM.PAGE_URI+'&utmt=event&utme='+utme;
  
 if (MCBM.DEBUG) {
    debug.log('GA track event: category: '+category+' action: '+action+' label: '+label+' value: '+_val);
    return;
  }
  
  MCBM.gaUrchinCall(trackvars);
  
};

MCBM.gaUrchinCall = function(trackvars) {
  
  var i=1000000000,
      utmn=MCBM.randomInRange(i,9999999999)|0, //random request number
      cookie=MCBM.randomInRange(10000000,99999999)|0, //random cookie number
      random=MCBM.randomInRange(i,2147483647)|0, //number under 2147483647
      today=(new Date()).getTime(),
      win = window.location,
      img = new Image(),
      urchinBaseURL = 'http://www.google-analytics.com/__utm.gif?'+
      'utmwv=5.2.0'+
      '&utmn='+utmn+
      '&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-'+
      '&utmhn='+MCBM.rootURI+
      '&utmr='+win+
      '{trackvars}'+
      '&utmac='+MCBM.GA_ACCOUNT+
      '&utmcc=__utma%3D'+cookie+'.'+random+'.'+today+'.'+today+'.'
      +today+'.2%3B%2B__utmb%3D'
      +cookie+'%3B%2B__utmc%3D'
      +cookie+'%3B%2B__utmz%3D'
      +cookie+'.'+today
      +'.2.2.utmccn%3D(referral)%7Cutmcsr%3D' + win.host + '%7Cutmcct%3D' + win.pathname + '%7Cutmcmd%3Dreferral%3B%2B__utmv%3D'
      +cookie+'.-%3B',
      urchinUrl = urchinBaseURL.split('{trackvars}').join(trackvars);
      
      // trigger the tracking
      img.src = urchinUrl;
};

(function($){

  MCBM.init = function() {

    var $win = $(window),
        $doc = $(document),
        $body = $('body'),
        _baseStyles = '\
  body { position: relative; }\
\
  #mcbm-container {\
    position: absolute;\
    top: 0px;\
    left: 0px;\
    width: 100%;\
    height: 100%;\
    overflow: hidden;\
    z-index: 9999999!important;\
  }\
\
  #mcbm-bedrock {\
    position: absolute;\
    top: 0px;\
    left: 0px;\
    width: 100%;\
    height: 0px;\
    overflow: hidden;\
    background:url('+MCBM.rootURI+'/img/textures/minecraft/bedrock.png);\
    z-index: 9999998!important;\
  }\
\
  #mcbm-loading {\
    position: absolute;\
    top: 0px;\
    left: 0px;\
    width: 259px;\
    height: 36px;\
  }\
\
  #mcbm-error {\
    position: absolute;\
    top: 0px;\
    left: 0px;\
    width: '+MCBM.errorDimensions[MCBM.language].width+'px;\
    height: '+MCBM.errorDimensions[MCBM.language].height+'px;\
    opacity:0;\
  }\
\
  #mcbm-container img {\
    margin: 0;\
  }\
\
  .mcbm-hidden {\
    visibility:hidden;\
    display:none;\
  }';
  
    $('head').append('<style>'+_baseStyles+'</style>');
  
    BrowserDetect.init();
  
    MCBM.$container = $( '<div id="mcbm-container"></div>' );
    MCBM.$loading = $( '<div id="mcbm-loading"><img src="'+MCBM.rootURI+'/img/ui/loading-'+MCBM.language+'.gif" width="259" height="36"></div>' );
    MCBM.$error = $( '<div id="mcbm-error"><img src="'+MCBM.rootURI+'/img/ui/error-'+MCBM.language+'.gif"></div>' );
    
    $body.append( MCBM.$container );
    MCBM.$container.append(MCBM.$loading);
    MCBM.$loading.css({
      top: $win.height() * 0.5 - 18,
      left: $win.width() * 0.5 - 130
    });
       
    MCBM.$container.append(MCBM.$error);
    MCBM.$error.css({
      top: ($win.height() - MCBM.errorDimensions[MCBM.language].height) * 0.5,
      left: ($win.width() - MCBM.errorDimensions[MCBM.language].width) * 0.5
    });
    MCBM.$error.addClass('mcbm-hidden');
    
    MCBM.$container.addClass(MCBM.language);
    
    if (MCBM.$container.outerWidth() > MCBM.MAX_WIDTH) {
      MCBM.$container.css({
        'width': MCBM.MAX_WIDTH+'px',
        'left': '50%',
        'margin-left': Math.floor(-MCBM.MAX_WIDTH * 0.5) + 'px'
      });
    }
    
    var docH = $doc.height();
    if ( (docH < $win.height()) || 
         (MCBM.$container.outerHeight() < $win.height()) ) {
      
      MCBM.$container.css('height', $win.height()+'px');
      
    } else if (docH > MCBM.MAX_HEIGHT) {
      
      // create "bedrock" area below to denote end of interactive area
      var bedrockHeight = docH - MCBM.MAX_HEIGHT;
      MCBM.$bedrock = $( '<div id="mcbm-bedrock"></div>' );
      MCBM.$bedrock.css({
        top:MCBM.MAX_HEIGHT,
        height:bedrockHeight
      });
      
      MCBM.$container.css('height', MCBM.MAX_HEIGHT+'px');
      $body.append( MCBM.$bedrock );
      
    }
    
    // track page view
    MCBM.gaTrackPage(MCBM.PAGE_TITLE);

    // start tracking durations
    MCBM.startTime = new Date().getTime();
    setTimeout(MCBM.trackDurationCallback, MCBM.getTrackDurationDelay());
    
    // track the first 0sec duration
    MCBM.gaTrackEvent('game', 'duration', MCBM.getDuration());
  };
  
})(jQuery);

// start when ready
jQuery.noConflict();
jQuery(function($) {
  
  // This is only used for testing as a standalone page
  // make sure we're not calling this in the actual bookmarklet
  // it will get initialized by mcbm-load.js
  if (typeof window.mcbmScriptURI === "undefined") { 
    
    // kick-off the app
    MCBM.init();
        
    if (typeof MCBM.main === 'function') {
      MCBM.main();
    } else {
      //debug.log("MCBM.main not defined");
    }
  }

});