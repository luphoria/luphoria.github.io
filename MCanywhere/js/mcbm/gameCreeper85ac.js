(function($){
  
  MCBM.gameCreeper = function(display) {
    
    var $win = $(window),
        $body = $('body'),
        _w,
        _display = display,
        _displayCtx = _display.getContext(),
        _creeperDisplay = null,
        _creeperDisplayCtx = null
        _creeper = null,
        _explosion = null,
        _playfieldGrid = null,
        _gridCellSize = 80,
        _isGameRunning = false,
        _queuedResize = false,
        _isExplosionComplete = false;
        
    var pScope = {};
        pScope.id = "gameCreeper";
    
    // ----------------------------------------------------------------
    // private functions
    // ----------------------------------------------------------------
    
    function _init() {
        
      $body.bind(MCBM.events.CREEPER_EXPLODED, _onCreeperExplode);
      
      _creeperDisplay = MCBM.display();
      _creeperDisplayCtx = _creeperDisplay.getContext();
      
      _playfieldGrid = MCBM.playfieldGrid(_display.getCanvas(), _gridCellSize);
      
      $body.bind(MCBM.events.CREEPER_LOADED, _onCreeperLoaded);
      _creeper = MCBM.creeper( _creeperDisplayCtx );
      _explosion = MCBM.explosion(new THREE.Vector2(0, 0), _creeperDisplayCtx);
              
    };
    
    function _onCreeperLoaded() {
      //debug.log("gameCreeper loaded");
      $body.trigger(MCBM.events.ITEM_LOADED);
    }
    
    // ----------------------------------------------------------------
        
    function _onCreeperExplode() {
        var creeperPos = _creeper.getPosition();

        _playfieldGrid.generateCreeperDamage(creeperPos.clone());
        
        _explosion.setPosition(creeperPos.clone());
        _explosion.play();
    };
    
    function _onCreeperExplodeComplete() {
      
      _isExplosionComplete = true;
      $body.trigger(MCBM.events.OPEN_UI);
      
    };
    
    function _startGame() {
      //debug.log("gameCreeper :: _startGame");
      
      $body.bind(MCBM.events.EXPLOSION_COMPLETE, _onCreeperExplodeComplete);
      
      _isExplosionComplete = false;
      _isGameRunning = true;
      
      if (_queuedResize) {
        _resize();
        _queuedResize = false;
      }
      
      _creeper.reset();
      _creeper.play();
          
      _animate();
      
    };
    
    function _endGame() {
      
      _creeper.stop();
      
      _explosion.stop();
      _explosion.reset(); 
      
      _playfieldGrid.reset();     
      
      _isGameRunning = false;
      _display.clear();
      _creeperDisplay.clear();
    };
    
    function _animate() {
      
      if (!_isExplosionComplete) {
        requestAnimationFrame( _animate );
      };
      
      _render();
      
      if (typeof _display.stats != "undefined") {
        _display.stats.update();
      }
      
      var tCur = new Date().getTime();
      
      if (_creeper.isAlive) {
        _creeper.update(tCur);
      }
      
      if (_explosion.isPlaying) {
        _explosion.update(tCur);
      }
    };
    
    function _render() {
        
      if (_playfieldGrid.isDirty) {
        _playfieldGrid.render();
      }
      
      if (_creeperDisplay.dirty) {
        _creeperDisplay.clear();
      }
      
      if (_creeper.isAlive) {
        _creeper.render();
        _creeperDisplay.dirty = true;
      }
      
      if (_explosion.isPlaying) {
        _explosion.render();
        _creeperDisplay.dirty = true;
      }
                  
    };
    
    function _resize() {
      if (_isGameRunning) {
        
        _creeper.resizeBounds(_w);
        _creeperDisplay.resize(_w);
        _playfieldGrid.resize(_w);
        _queuedResize = false;
        
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
        
        _endGame();
        $.doTimeout( 'newGame.creeper', 250, _startGame);
        
      } else {
        
        _startGame();
        
      }
           
    };
    
    pScope.endGame = function() {
      
      _endGame();
            
    };
    
    pScope.destroy = function() {
            
    };
    
    pScope.getIsRunning = function() {
      return !_isExplosionComplete;
    };
    
    pScope.resize = function(w) {
      
      _w = w;
      
      _resize();
      
    };
    
    return pScope;
    
  };
  
})(jQuery);