(function($){

  MCBM.gamePickaxe = function(display) {
    
    var $win = $(window),
        $body = $('body'),
        _display = display,
        $displayCanvas = $(_display.getCanvas()),
        _playfieldGrid = null,
        _pickaxe = null,
        _mouseX,
        _mouseY,
        _w,
        _queuedResize = false,
        _blockBreaks = [],
        _stoneBreakAudio = null,
        _dirtBreakAudio = null,
        _audioElementsLoaded = 0,
        _numAudioElements = 0,
        _audioAvailable = $('html').hasClass('audio'),
        _audioLoaded = false,
        _audioLookup = {},
        _continueBreaking = false,
        _isGameRunning = false,
        _isMouseDownReady = true;
        
    var pScope = {};
        pScope.id = "gamePickaxe";
    
    // ----------------------------------------------------------------
    // private functions
    // ----------------------------------------------------------------
    
    function _init() {
      
      $body.bind(MCBM.events.PICKAXE_AUDIO_LOAD_COMPLETE, _onAudioLoadComplete);
      
      // create playfieldGrid instance
      _playfieldGrid = MCBM.playfieldGrid(_display.getCanvas(), 80);
      
      _pickaxe = MCBM.pickaxe();
      
      if (_audioAvailable) {
        _initAudio();
      } else {
        _onAudioLoadError();
      }
    };
    
    function _initAudio() {
          
      _stoneBreakAudio = document.createElement('audio');
      _dirtBreakAudio = document.createElement('audio');
    
      var audioElements = [
        {
          filename:"stone2",
          element:_stoneBreakAudio
        },
        {
          filename:"grass2",
          element:_dirtBreakAudio
        }
      ];
      
      _audioLookup.stone = _stoneBreakAudio;
      _audioLookup.dirt = _dirtBreakAudio;
    
      _numAudioElements = audioElements.length;
    
      for (var i=0; i < _numAudioElements; i++) {
        var audioElement = audioElements[i].element;
        var filename = audioElements[i].filename;
      
        audioElement.addEventListener("loadeddata", _onAudioElementLoaded, false);
        audioElement.addEventListener("error", _onAudioLoadError, false);
                  
        if (audioElement.canPlayType) {
     
          var filetype = "";
          if (audioElement.canPlayType('audio/ogg; codecs="vorbis"') != "") {
            filetype = ".ogg";
          } else if (audioElement.canPlayType('audio/mpeg') != "") {
            filetype = ".mp3";
          } else {
            // audio filetype not supported
            _onAudioLoadError() 
          }
        
        }
    
        audioElement.src = MCBM.rootURI + "/audio/"+filename+filetype;
        audioElement.load();
      }
  
    };
    
    // ----------------------------------------------------------------
    
    function _onAudioElementLoaded(e) {
      _audioElementsLoaded++;
      
      if (_audioElementsLoaded == _numAudioElements) {
        // audio load complete
        $body.trigger(MCBM.events.PICKAXE_AUDIO_LOAD_COMPLETE);
        _audioLoaded = true;
        _audioAvailable = true;
      }
    };
    
    function _onAudioLoadError(e) {
      // handle error
      //debug.log('Unable to load Pickaxe Audio');
            
      $body.trigger(MCBM.events.LOAD_ERROR); 
      
      // if we wanted to get more granular, we could still play without audio
      // _audioAvailable = false;
      //$body.trigger(MCBM.events.PICKAXE_AUDIO_LOAD_ERROR); 
      //_onAudioLoadComplete();
    };
    
    function _onAudioLoadComplete() {
      //debug.log("gamePickaxe loaded");
      $body.trigger(MCBM.events.ITEM_LOADED);
    }
    
    function _startGame() {
      //debug.log("pickaxeGame :: _startGame");
      
      $displayCanvas.css('display', 'none');
      
      // bind events 
      $body.bind('mousemove.gamePickaxe', _onMouseMove);
      //$body.bind( 'mousedown.gamePickaxe', _onMouseDown );
      //$body.bind( 'mouseup.gamePickaxe', _onMouseUp );
      
      $body.bind( 'mousedown', _onMouseDown );
      $body.bind( 'mouseup', _onMouseUp );
      $body.bind( 'mouseleave', _onMouseUp );
      
      // setup resize handler
      $win.bind('resize.gamePickaxe', _onResize);
      
      _isGameRunning = true;
      if (_queuedResize) {
        _resize();
        _queuedResize = false;
      }
      
      _animate();
      
    };
    
    function _endGame() {
      //debug.log("pickaxeGame :: _endGame");
      
      // unbind events 
      $body.unbind('mousemove.gamePickaxe', _onMouseMove);
      //$body.unbind( 'mousedown.gamePickaxe', _onMouseDown );
      //$body.unbind( 'mouseup.gamePickaxe', _onMouseUp );
      
      $body.unbind( 'mousedown', _onMouseDown );
      $body.unbind( 'mouseup', _onMouseUp );
      $body.unbind( 'mouseleave', _onMouseUp );
      
      // setup resize handler
      $win.unbind('resize.gamePickaxe', _onResize);
      
      _pickaxe.stop();
      _pickaxe.hide();
      
      _isGameRunning = false;
      _playfieldGrid.reset();
      _display.clear();
    };
    
    function _onMouseMove(e) {
      $displayCanvas.css({
       'display': 'block',
       'cursor': 'crosshair'
      });
            
      _mouseX = e.pageX - MCBM.$container.offset().left;
      _mouseY = e.pageY;
      _pickaxe.setPosition(_mouseX, _mouseY);
    };
    
    function _onMouseDown(e) {
      e.preventDefault();
      
      _mouseX = e.pageX - MCBM.$container.offset().left; //clientX + scrollLeft;
      _mouseY = e.pageY; //clientY + scrollTop;
      
      // rate limit mouse input
      if (_isMouseDownReady) {
        _isMouseDownReady = false;
        _doMouseDown();
        $.doTimeout(300, function () { _isMouseDownReady = true; });
      }
      
    };
        
    function _doMouseDown() {
      var scrollTop = $win.scrollTop();
      var scrollLeft = $win.scrollLeft();
     
      _continueBreaking = true;
      _doBlockBreak();
      
      $.doTimeout("breakInterval", 500, _doBlockBreak);
      _pickaxe.start();
    }
    
    function _doBlockBreak() {
      
      var type = _playfieldGrid.mineAtPosition(_mouseX, _mouseY);  
      if (type != "lava" && type !== undefined) {
        
        if (type == "grassDirt" || typeof type == "undefined") {
          type = "dirt";
        }
        
        if (_audioLoaded) {
          var audioType = (type == "dirt") ? type : "stone",
              audioElement = _audioLookup[audioType];
          audioElement.pause();
          audioElement.currentTime = 0;
          audioElement.play();
        }
                 
        var blockbreak = MCBM.blockBreak(type, new THREE.Vector3(_mouseX, _mouseY, 0.5));
        _blockBreaks.push(blockbreak);
      }
      
      if (_continueBreaking) {
        return true;
      } else {
        return false;
      }
    };
    
    function _onMouseUp(e) {
      e.preventDefault();
      
      _continueBreaking = false;
      $.doTimeout("breakInterval");
      
      _pickaxe.stop();
    };
    
    function _onResize() {
            
    };
    
    function _animate() {
      
      if (_isGameRunning) {
        requestAnimationFrame( _animate );
      };
      
      _render();
      
      if (typeof _display.stats != "undefined") {
        _display.stats.update();
      }
            
      var tCur = new Date().getTime();
      
      _pickaxe.update(tCur);
      
      /*
      if (_playfieldGrid.isDirty) {
        _playfieldGrid.update(tCur);
      }
      */
      
      var i = _blockBreaks.length;
      while (i--) {
      
        var blockbreak = _blockBreaks[i];
        if (blockbreak.running) {
          blockbreak.update(tCur);
        } else {
          blockbreak.destroy();
          _blockBreaks.splice(i, 1);
        }        

      };
      
            
    };
    
    function _render() {
      
      if (_playfieldGrid.isDirty) {
        _playfieldGrid.render();
      }
      
    };
    
    function _resize() {
      if (_isGameRunning) {
        _playfieldGrid.resize(_w); 
      } else {
        _queuedResize = true;
      }
    }
    
    
    _init();
    
    // ----------------------------------------------------------------
    // public methods
    // ----------------------------------------------------------------
    
    pScope.newGame = function() {
      
      if (_isGameRunning) {
        //debug.log("game running: delay new game");
        _endGame();
        
        $.doTimeout( 'newGame.pickaxe', 250, _startGame);
      } else {
        //debug.log("pickaxe :: newGame");
        _startGame();
        
      }
                  
    };
    
    pScope.endGame = function() {
      
      _endGame();
            
    };
    
    pScope.destroy = function() {
            
    };
    
    pScope.getIsRunning = function() {
      return _isGameRunning;
    };
    
    pScope.resize = function(w) {
      
      _w = w;
      
      _resize();
    };
    
    return pScope;
    
  };
  
})(jQuery);
