(function($){

  MCBM.creeper = function(targetCtx) {
    
    var $win = $(window),
        $body = $('body'),
        _targetCtx = targetCtx,
        _pos = null,
        _registration = new THREE.Vector2(55, 140),
        _vel = new THREE.Vector2(0, 0),
        _speed = 0,
        _dir,
        _duration = 0,
        _mousePos,
        _activateDist = 500,  // <------  !! IMPORTANT; remeber that for optimization these should get pre-squared for distance checking in init()
        _contactRadius = 20,  // <------
        _isChasing = false,
        _dirChangeReady = false,
        _dirChangeTimeout = null,
        _explodeTimeout = null,
        _explodeDelay = 2500,
        _boundsMargin = 50,
        _bounds = { // will need to make this resizeable
          min: new THREE.Vector2(_boundsMargin, _boundsMargin),
          max: new THREE.Vector2( MCBM.$container.outerWidth() - _boundsMargin,  MCBM.$container.outerHeight() - _boundsMargin)
        };
        
    
    // audio vars
    var fuseAudio,
        explodeAudio,
        _audioElementsLoaded = 0,
        _numAudioElements = 0,
        _audioAvailable = $('html').hasClass('audio');
        
    
    // sprite vars
    var _creeperSpriteURI = MCBM.rootURI + '/img/sprites/creeper.png',
        _creeperSpriteImg,
        _spriteDuration = 0,
        _sprite;
      
    var _spriteSequenceData = {
      up: { frameBounds:[1, 12] },
      upRight: { frameBounds:[13, 24] },
      right: { frameBounds:[25, 36] },
      downRight: { frameBounds:[37, 48] },
      down: { frameBounds:[49, 60] },
      upLeft: { frameBounds:[85, 96  ] },
      left: { frameBounds:[73, 84] },
      downLeft: { frameBounds:[61, 72] }  
    };
    
    var _movementTypes = {
      walk: {
              duration: 750,
              speed: 0.6
            },
          
      run: {
              duration: 470,
              speed: 3
            }
    };
  
    var unit45 = 0.707106781186548; // precomputed x,y component of unit vector at 45 degrees
    var _directions = {
      up: new THREE.Vector2(0, -1),
      upLeft: new THREE.Vector2(-unit45, -unit45),
      upRight: new THREE.Vector2(unit45, -unit45),
      left: new THREE.Vector2(-1, 0),
      right: new THREE.Vector2(1, 0),
      downLeft: new THREE.Vector2(-unit45, unit45),
      downRight: new THREE.Vector2(unit45, unit45),
      down: new THREE.Vector2(0, 1)
    };
    var _directionsArray = [
    "up",
    "upLeft",
    "upRight",
    "left",
    "right",
    "downLeft",
    "downRight",
    "down"
    ];
        
    var pScope = {};
  
    pScope.isAlive = false;
    
    // ----------------------------------------------------------------
    // ----------------------------------------------------------------
  
    function _init() {
      _activateDist = _activateDist*_activateDist; // square the activate distance so we can check against dist squared and avoid taking square root for speed
      _contactRadius = _contactRadius*_contactRadius;
      
      _mousePos = new THREE.Vector2(0, 0);
      
      $body.bind(MCBM.events.CREEPER_AUDIO_LOAD_COMPLETE, _initImages);
      $body.bind(MCBM.events.CREEPER_AUDIO_LOAD_ERROR, _initImages);
      
      if (_audioAvailable) {
        _initAudio();
      } else {
        _onAudioLoadError();
      }
    };
    
    // ----------------------------------------------------------------
    
    function _reset() {
      _pos = new THREE.Vector2( 
                                MCBM.randomInRange(_boundsMargin*2,  MCBM.$container.outerWidth() - _boundsMargin*2), 
                                MCBM.randomInRange(_boundsMargin*2,  $win.height() - _boundsMargin*2)
                              );
                                    
      _dir = MCBM.randomFromArray(_directionsArray);
      _speed = _movementTypes["walk"].speed;
      _duration = _movementTypes["walk"].duration;
      
      _vel.copy(_directions[_dir]);
      _vel.multiplyScalar(_speed);
      
      _sprite.setPosition(_pos);
      _sprite.setSequence(_dir);
      
      _isChasing = false;
      
      // reset explosion
    };
        
    // ----------------------------------------------------------------
      
    function _initAudio() {
    
      fuseAudio = document.createElement('audio');
      explodeAudio = document.createElement('audio');
        
      var audioElements = [
        {
          filename:"fuse",
          element:fuseAudio
        },
        {
          filename:"explode",
          element:explodeAudio
        }
      ];
    
      _numAudioElements = audioElements.length;
    
      for (var i=0; i < _numAudioElements; i++) {
        var audioElement = audioElements[i].element;
        var filename = audioElements[i].filename;
      
        audioElement.addEventListener("loadeddata", _onAudioLoaded, false);
        audioElement.addEventListener("error", _onAudioLoadError, false);
            
        if (audioElement.canPlayType) {
     
          var filetype = "";
          if (audioElement.canPlayType('audio/ogg; codecs="vorbis"') != "") {
            filetype = ".ogg";
          } else if (audioElement.canPlayType('audio/mpeg') != "") {
            filetype = ".mp3";
          } else {
            // audio filetype not supported
            _onAudioLoadError();
          }
        
        }
    
        audioElement.src = MCBM.rootURI + "/audio/"+filename+filetype;;
        audioElement.load();
      }
  
    };
    
    // ----------------------------------------------------------------
    
    function _onAudioLoaded(e) {
      _audioElementsLoaded++;
    
      if (_audioElementsLoaded == _numAudioElements) {
        // audio load complete
        $body.trigger(MCBM.events.CREEPER_AUDIO_LOAD_COMPLETE);
      }
    };
    
    function _onAudioLoadError(e) {
      // handle error
      //debug.log('Unable to load Creeper Audio');
      
      $body.trigger(MCBM.events.LOAD_ERROR); 
      
      // if we wanted to get more granular, we could still play without audio
      //_audioAvailable = false;
      //$body.trigger(MCBM.events.CREEPER_AUDIO_LOAD_ERROR);
      //$body.trigger(MCBM.events.CREEPER_AUDIO_LOAD_COMPLETE);
    };
    
    
    // ----------------------------------------------------------------
    
    function _checkFuseEnded() {
      // for some reason checking the "ended" attribute on the audio element
      // fixes a bug where the audio was getting cut-off prematurely
    
      var ended = fuseAudio.ended;
      if (!ended) {
        setTimeout(_checkFuseEnded, 500);
      }
    };
    
    // ----------------------------------------------------------------
  
    function _onFuseAudioEnded(e) {
      fuseAudio.removeEventListener("ended", _onFuseAudioEnded, false);
      _explode();
    };
    
    // ----------------------------------------------------------------
    
    function _initImages() {
      // load image
      _creeperSpriteImg = document.createElement('img');
      _creeperSpriteImg.crossOrigin = '';
    
      _creeperSpriteImg.onload = _onImageLoaded;
      _creeperSpriteImg.src = _creeperSpriteURI;
    };
  
    function _onImageLoaded(e) {
      // setup sprite
        
      _sprite = MCBM.sprite(_creeperSpriteImg, 225, 200, 1, _spriteSequenceData, _registration);
      _sprite.setLooping(true);
      _reset();
      
      $body.trigger(MCBM.events.CREEPER_LOADED);
    };
  
    function _onMouseMove(e) {
      if (!pScope.isAlive) {
        return;
      }
      
      _mousePos.x = e.pageX - MCBM.$container.offset().left;
      _mousePos.y = e.pageY;
      
      var d = _pos.distanceToSquared(_mousePos);
      
      // check distance to mouse
      if (!_isChasing) {
        
        if (d < _activateDist) {
          
          if (_dirChangeTimeout !== null) {
            clearTimeout(_dirChangeTimeout);
            _dirChangeTimeout = null;
          }
          
          _isChasing = true;
          _dirChangeReady = true;
          _speed = _movementTypes.run.speed;
          _duration = _movementTypes.run.duration;
          _sprite.setDuration(_duration);
          _setDirection(_dir);
        
          // explode timer
          if (_audioAvailable) {
            _checkFuseEnded();
            fuseAudio.addEventListener("ended", _onFuseAudioEnded, false);
            fuseAudio.play();
          } else {
            _explodeTimeout = setTimeout(_explode, _explodeDelay);
          }
        }
        
      } else if (d > _activateDist) {
        _stopChasing();
      }
    
    };
    
    function _onMouseLeave() {
      if (!pScope.isAlive) {
        return;
      }
      
      if (_isChasing) {
        _stopChasing();
      }
    };
        
    function _stopChasing() {
      
      _clearChaseTimeouts()
      
      _dirChangeReady = false;
      _dirChangeTimeout = setTimeout(  _onDirectionChangeTimeout, MCBM.randomInRange(1000, 3000)  );
      
      _speed = _movementTypes.walk.speed;
      _duration = _movementTypes.walk.duration;
      _sprite.setDuration(_duration);
      _setDirection(_dir);
    };
    
    function _clearChaseTimeouts() {
      if (_explodeTimeout !== null) {
        clearTimeout(_explodeTimeout);
        _explodeTimeout = null;
      }
      
      _isChasing = false;
      
      if (_audioAvailable) {
        fuseAudio.currentTime = 0;
        fuseAudio.pause();
      }
     
      if (_dirChangeTimeout !== null) {
        clearTimeout(_dirChangeTimeout);
        _dirChangeTimeout = null;
      }
    };
  
    function _getDirection(fromVec2, toVec2) {
      // use precomputed values for tan to speed things up
      //   62.5 deg = 2.4142
      //   22.5 deg = 0.4142

      var dirVec2 = new THREE.Vector2(0, 0);
      dirVec2.sub(toVec2, fromVec2);

      var dir;

      if (dirVec2.x == 0) {
        dir = (dirVec2.y < 0) ? "up" : "down"; // y flipped in browser coordinate space where y increases moving down the page
      } else {
        var t = Math.abs(dirVec2.y / dirVec2.x);

        if (t > 2.4142) { // vertical

          dir = (dirVec2.y < 0) ? "up" : "down";

        } else if (t <= 0.4142) { // horizontal

          dir = (dirVec2.x > 0) ? "right" : "left";

        } else if (0.4142 < t && t <= 2.4142) { // angular

          dir = (dirVec2.y < 0) ? "up" : "down";
          dir = (dirVec2.x > 0) ? dir+"Right" : dir+"Left";

        }
      }

      //debug.log("direction: "+dir);
      return dir; //directions[dir];
    };
    
    function _setDirection(newDir) {
      // change velocity vector
      _vel.copy(_directions[newDir]);
      _vel.multiplyScalar(_speed);

      // set sprite sequence based on direction
      _sprite.setSequence(newDir);
      _dir = newDir;
    };
    
    function _onDirectionChangeTimeout() {
      _dirChangeTimeout = null;
      _dirChangeReady = true;
    };
  
    function _explode() {
      
      if (_audioAvailable) {
        explodeAudio.play();
      }
      
      pScope.isAlive = false;
      _sprite.stop();
      
      _clearChaseTimeouts();
      
      $body.trigger(MCBM.events.CREEPER_EXPLODED);
      
    };
    
    function _checkOutOfBounds() {
      return (_pos.x < _bounds.min.x ||
              _pos.x > _bounds.max.x ||
              _pos.y < _bounds.min.y ||
              _pos.y > _bounds.max.y);
    };
  
    _init();
  
    // ----------------------------------------------------------------
    // ----------------------------------------------------------------
  
    pScope.getPosition = function() {
      return _pos.clone();
    };
  
    // ----------------------------------------------------------------
  
    pScope.update = function(tCur) {
      
      // update sprite frame
      if (!_sprite.getIsPlaying()) {
        return;
      }
      
      if (_isChasing) {
        var d = _pos.distanceToSquared(_mousePos);

        if (d < _contactRadius) {
          _explode();
        }
      }
        
      if (_checkOutOfBounds()) {
        
        //debug.log("out of bounds");
        if (_dirChangeTimeout !== null) {
          clearTimeout(_dirChangeTimeout);
          _dirChangeTimeout = null;
        }
        
        // get direction based on center of window
        var newDir = _getDirection(_pos, new THREE.Vector2( $win.width() * 0.5, $win.height() * 0.5 ) );
        _setDirection(newDir);
        
        _dirChangeReady = false;
        _dirChangeTimeout = setTimeout(  _onDirectionChangeTimeout, 5000  );
        
      } else if (_isChasing && _dirChangeReady) {
        
        // get direction based on mouse position
        var newDir = _getDirection(_pos, _mousePos);
    
        // check if direction has changed
        if (_dir != newDir) {
          
          _setDirection(newDir);
          
          _dirChangeReady = false;
          _dirChangeTimeout = setTimeout(  _onDirectionChangeTimeout, 500);
        }
        
      } else if (_dirChangeReady) {
        
        // get direction from wandering
        var newDir = MCBM.randomFromArray(_directionsArray);

        if (_dir != newDir) {
          
          _setDirection(newDir);
          
           _dirChangeReady = false;
           _dirChangeTimeout = setTimeout(  _onDirectionChangeTimeout, MCBM.randomInRange(2000, 5000)  );
        }
      }
          
      // update position
      _pos.addSelf(_vel);
      _sprite.setPosition(_pos);
      _sprite.update(tCur);
    
    };
  
    // ----------------------------------------------------------------
  
    pScope.render = function() {
    
      if (_sprite.getIsPlaying()) {
        _sprite.draw(_targetCtx);
      }
      
    };
    
    pScope.play = function() {
      _sprite.play(_duration);
      
      _dirChangeReady = true;
      pScope.isAlive = true;
      
      // setup mousemove handler to check mouse proximity to see if chasing
      $body.bind("mousemove.creeper", _onMouseMove);
      $body.bind("mouseleave.creeper", _onMouseLeave);
    }
    
    pScope.stop = function() {

      if (_isChasing) {
        _stopChasing();
      }
      
      _sprite.stop();
      
      pScope.isAlive = false;
      
      $body.unbind("mousemove.creeper", _onMouseMove);
      $body.unbind("mouseleave.creeper", _onMouseLeave);
    };
    
    pScope.reset = function() {
      _reset();
    };
    
    pScope.resizeBounds = function(w) {
      _bounds.max = new THREE.Vector2(w - _boundsMargin,  $win.height() - _boundsMargin)
    }
  
    return pScope;
  
  };

})(jQuery);