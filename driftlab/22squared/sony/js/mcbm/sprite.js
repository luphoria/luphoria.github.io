// ====================================================================
// Sprite Object for animating spritesheets
// 
// author: Nate Horstmann nate@natehorstmann.com
// ====================================================================

// ====================================================================
// @sprite object
// ====================================================================
MCBM.sprite = function(img, frameWidth, frameHeight, baseScale, sequenceData, registration) {
  
  var _image = img, //document.createElement('img'),
      _frameWidth = frameWidth,
      _frameHeight = frameHeight,
      _baseScale = baseScale || 1,
      _scale = _baseScale,
      _flipScale = null,
      _registration = (typeof registration !== "undefined") ? new THREE.Vector2(-registration.x, -registration.y ) : new THREE.Vector2(-_frameWidth * 0.5, -_frameHeight * 0.5),
      _pos = new THREE.Vector2(0, 0),
      _cols = 0,
      _rows = 0,
      
      _startFrame = 0,
      _endFrame = 0,
      _curFrame = 0, // actual frame in relation the whole sprite sheet
      _sequenceData = sequenceData,
      _curSequence,
      _totalFrames = 0,
      _tStart = 0,
      _duration = 0,
      _loop = false,
      _isReady = false,
      _isPlaying = false,
      _hasPlayed = false,
      _queuedDrawCtx = null;
  
  var pScope = {};
  
  // ----------------------------------------------------------------
  // private functions
  // ----------------------------------------------------------------
    
  function _init() {
    
    _cols = _image.width/_frameWidth;
    _rows = _image.height/_frameHeight;
    
    _totalFrames = _rows * _cols;
    _endFrame = _totalFrames;
    
    _isReady = true;
    
  };
  
  // ----------------------------------------------------------------
  
  function _setFrame(frame) {
        
    if (_curFrame == frame) {      
      return;
    }
    
    _curFrame = frame;
    
    if (_curFrame > _endFrame) {
      if (_loop) {
        _curFrame = _startFrame;
      } else {
        _curFrame = _endFrame;
        _isPlaying = false;
      }
    }
    
    if (_curFrame <= _startFrame) {
      if (_loop) {
        _curFrame = _endFrame;
      } else {
        _curFrame = 1;
        _isPlaying = false;
      }
    }
    
  };
  
  // ----------------------------------------------------------------
  
  function _draw(targetCtx) {
    
    var col = (_curFrame - 1)%_cols;
    var row = (_curFrame - 1)/_cols|0;
    
    var destW = _frameWidth * _scale;
    var destH = _frameHeight * _scale;
            
    var sX = col * _frameWidth;
    var sY = row * _frameHeight;
    var destX = _pos.x + (_registration.x * _scale);
    var destY = _pos.y + (_registration.y * _scale);
      
    if (_flipScale != null) {  
      targetCtx.save();
      targetCtx.scale(_flipScale.x, _flipScale.y);
      if (_flipScale.x < 0) {
        destX = _flipScale.x * (_pos.x - _registration.x);
      }
      
      if (_flipScale.y < 0) {
        destY = _flipScale.y * (_pos.y - _registration.y);
      }
    }
    
    //debug.log("destW,destH: "+destW+", "+destH);
    //debug.log("x,y: "+col * _frameWidth+", "+row * _frameHeight);
    //debug.log("sX,sY: "+sX+", "+sY);
        
    targetCtx.drawImage(pScope.getImage(), sX, sY, _frameWidth, _frameHeight, destX, destY, destW, destH);
    
    if (_flipScale != null) {
      targetCtx.restore();
    }
    
    _queuedDrawCtx = null;    
    
  };
  
  // ----------------------------------------------------------------
  
  _init();
  
  // ----------------------------------------------------------------
  // public functions
  // ----------------------------------------------------------------
  
  pScope.getImage = function() {
    return _image;
  };
  
  // ----------------------------------------------------------------
  
  pScope.setScale = function(scale) {
    
    _scale = scale;
    
  };
  
  // ----------------------------------------------------------------
  
  pScope.getBaseScale = function() {
    return _baseScale;
  };
  
  // ----------------------------------------------------------------
  
  pScope.setPosition = function( pos ) {
    _pos = pos;
  };
  
  // ----------------------------------------------------------------
    
  pScope.setDuration = function( duration ) {
    _duration = duration;
  };
  
  // ----------------------------------------------------------------
  
  pScope.setLooping = function( val ) {
    _loop = val;
  };
      
  pScope.update = function(tCur) {
    
    //debug.log("Sprite :: update()");
    if (!_isPlaying) {
      return;
    }
    
    var elapsed = tCur - _tStart;
    elapsed = (_loop) ? elapsed%_duration : elapsed;
    
    // can update current frame based on tween or just regular increment
    if (_sequenceData == null) {
      
      var destFrame = ((elapsed/_duration) * _totalFrames)|0;
      _setFrame( destFrame + 1 );
      
    } else {
      
      var destFrame = ((elapsed/_duration) * _totalFrames)|0;
            
      _setFrame( _startFrame + destFrame );
      
    }
    
  };
  
  // ----------------------------------------------------------------
  
  pScope.draw = function(targetCtx) {
    
    if (_isReady) {
      _draw(targetCtx);
    } else {
      _queuedDrawCtx = targetCtx;
    }
    
  };
  
  // ----------------------------------------------------------------
  
  pScope.play = function(duration) {
    
    if (_isPlaying) {
      return;
    }
    
    _curFrame = 1;
    
    _isPlaying = _hasPlayed = true;
    _duration = duration;
    _tStart = new Date().getTime();
    
    
  };
  
  // ----------------------------------------------------------------
  
  pScope.stop = function() {
    _isPlaying = false;
    
  };
  
  // ----------------------------------------------------------------
  
  pScope.getHasPlayed = function() {
    return _hasPlayed;
  };
  
  // ----------------------------------------------------------------
  
  pScope.getIsPlaying = function() {
    return _isPlaying;
  };
  
  // ----------------------------------------------------------------
  
  pScope.setSequence = function(sequenceName) {
    
    if (typeof _sequenceData == "undefined") {
      //debug.log("Sprite.setSequence :: WARNING no sequence data has been defined: ");
      return;
    }
    
    var sequence = _sequenceData[sequenceName];
    
    if (typeof sequence == "undefined") {
      //debug.log("Sprite.setSequence :: WARNING no sequence found for: "+sequenceName);
      return;
    }
      
    _curSequence = sequence;
    _flipScale = null;
        
    _startFrame = _curSequence.frameBounds[0];
    _endFrame = _curSequence.frameBounds[1];
    _totalFrames = _endFrame - _startFrame + 1;
    
    if (_curSequence.flipHorizontal || _curSequence.flipVertical) {
      _flipScale = {
        x:(_curSequence.flipHorizontal) ? -1 : 1,
        y:(_curSequence.flipVertical) ? -1 : 1
      };
    }
    
  };
  
  return pScope;
    
};