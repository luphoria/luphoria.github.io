(function($){

  MCBM.main = function() {
    
    var $win = $(window),
        $body = $('body'),
        _ui  = null,
        _phone = null,
        _gameDisplay = null,
        _gameCreeper = null,
        _gamePickaxe = null,
        _curGame = null,
        _queuedGame = null,
        _hasUIOpened = false,
        _isAutoClosingUi = false,
        _autoCloseUIDelay = 1500,
        _autoCloseUITimeout = null,
        _itemsLoaded = 0,
        _numLoadItems = 0;
        
    // ----------------------------------------------------------------
    
    function _init() {
      //debug.log("MCBM.main :: _init()");

      _gameDisplay = MCBM.display(false);
      
      _ui = MCBM.ui();
      _phone = MCBM.phoneDisplay();
      
      _numLoadItems = 2;
      $body.bind(MCBM.events.ITEM_LOADED, _onItemLoaded);
      $body.bind(MCBM.events.LOAD_ERROR, _onLoadError);
      
      _gameCreeper = MCBM.gameCreeper(_gameDisplay);
      _gamePickaxe = MCBM.gamePickaxe(_gameDisplay);
                
      $body.bind(MCBM.events.PLAY_CREEPER_CLICK, _onPlayCreeper);
      $body.bind(MCBM.events.PLAY_PICKAXE_CLICK, _onPlayPickaxe);
      $body.bind(MCBM.events.EXIT_CLICK, _onExit);
      $body.bind(MCBM.events.OPEN_UI, _onOpenUI);
      
      $body.bind(MCBM.events.OPEN_UI_COMPLETE, _onOpenUIComplete);
      $body.bind(MCBM.events.CLOSE_UI_COMPLETE, _onCloseUIComplete);
      
      $.doTimeout('loadTimeout', MCBM.LOAD_TIMEOUT, _loadTimeout);
    }
    
    function _onItemLoaded() {
      
      _itemsLoaded++;
      
      if (_itemsLoaded === _numLoadItems) {
        _onLoadComplete();
      }
      
    }
    
    function _loadTimeout() {
      //debug.log('Loading timed out');
      $body.trigger(MCBM.events.LOAD_ERROR);
    }
    
    function _onLoadError() {
      $body.unbind(MCBM.events.ITEM_LOADED, _onItemLoaded);
      $body.unbind(MCBM.events.LOAD_ERROR, _onLoadError);
      
      // swap loader for error message
      MCBM.$loading.animate({opacity:0}, 350, "easeOutQuad", function() { 
        
        MCBM.$loading.addClass('mcbm-hidden');
        
        MCBM.$error.removeClass('mcbm-hidden');
        MCBM.$error.animate({opacity:1}, 350, "easeOutQuad");
        
      });
    }
    
    function _onLoadComplete() {
      
      // cancel timeout
      $.doTimeout('loadTimeout');
      
      // hide loader
      MCBM.$loading.animate({opacity:0}, 350, "easeOutQuad", function() { } ); //$(this).remove();
      
      _ui.open();
      _phone.transitionIn();
      
      $win.bind('resize', _onResize);
    }
    
    // ----------------------------------------------------------------
    
    function _onPlayCreeper() {
      
      //debug.log("_onPlayCreeper");
      MCBM.gaTrackEvent('game', 'play', 'Creeper Game');
      _swapGames(_gameCreeper);
      
    }
    
    // ----------------------------------------------------------------
    
    function _onPlayPickaxe() {
      
      //debug.log("_onPlayPickaxe");
      MCBM.gaTrackEvent('game', 'play', 'Pickaxe Game');
      _swapGames(_gamePickaxe);
      
    }
    
    // ----------------------------------------------------------------
    
    function _swapGames(newGame) {
      
      _queuedGame = newGame;
      
      if (_curGame !== null) {
        _curGame.endGame();
        _curGame = null;
      }
      
      _closeUI();      
    }
    
    // ----------------------------------------------------------------
    
    function _closeUI() {
      if (_autoCloseUITimeout != null) {
        clearTimeout(_autoCloseUITimeout);
        _autoCloseUITimeout = null;
      }
      
      _ui.close();
      _phone.transitionOut();
    }
    
    function _onCloseUIComplete() {
      
      if (_queuedGame == null) {
        return;
      }
      
      _curGame = _queuedGame;
      _queuedGame = null;
      _curGame.newGame();
      
    }
    
    // ----------------------------------------------------------------
    
    function _onOpenUIComplete() {
      
      if (_curGame != null) {
        _isAutoClosingUi = _curGame.getIsRunning();
      }
      
      if (_hasUIOpened && _isAutoClosingUi) {
        // start auto close timer
        // add ui mouse movement listener to clear auto close timer
        $body.bind(MCBM.events.UI_MOUSE_MOVE, _onUIMouseMove);
        _autoCloseUITimeout = setTimeout(_autoCloseUI, _autoCloseUIDelay);
      } else {
        _hasUIOpened = true;
      }
      
    }
    
    function _onUIMouseMove() {
      
      if (_autoCloseUITimeout != null) {
        clearTimeout(_autoCloseUITimeout);
        _autoCloseUITimeout = null;
      }
      
      _autoCloseUITimeout = setTimeout(_autoCloseUI, _autoCloseUIDelay);
    }
    
    // ----------------------------------------------------------------
    
    function _autoCloseUI() {
      $body.unbind(MCBM.events.UI_MOUSE_MOVE, _onUIMouseMove);
      
      if (_autoCloseUITimeout != null) {
        clearTimeout(_autoCloseUITimeout);
        _autoCloseUITimeout = null;
      }
      
      if (_curGame != null) {
        if (_curGame.getIsRunning()) { // game may have ended during timeout, only close if game is still running
          _closeUI();
        }
      }
      
    }
    
    // ----------------------------------------------------------------
    
    function _onOpenUI() {
      if (_autoCloseUITimeout != null) {
        clearTimeout(_autoCloseUITimeout);
        _autoCloseUITimeout = null;
      }
      
      _phone.transitionIn(); 
      _ui.open();
      
    }
    
    // ----------------------------------------------------------------
    
    function _onExit() {
      
      // clear events
      $body.unbind(MCBM.events.PLAY_CREEPER_CLICK, _onPlayCreeper);
      $body.unbind(MCBM.events.PLAY_PICKAXE_CLICK, _onPlayPickaxe);
      $body.unbind(MCBM.events.EXIT_CLICK, _onExit);
      $body.unbind(MCBM.events.OPEN_UI, _onOpenUI);
      
      $body.unbind(MCBM.events.OPEN_UI_COMPLETE, _onOpenUIComplete);
      $body.unbind(MCBM.events.CLOSE_UI_COMPLETE, _onCloseUIComplete);
      
      //debug.log("_onExit");
      if (_autoCloseUITimeout != null) {
        clearTimeout(_autoCloseUITimeout);
        _autoCloseUITimeout = null;
      }
      
      if (_curGame !== null) {
          _curGame.endGame();
          _curGame = null;
      }
      
      MCBM.$container.remove();
      
      MCBM.gaTrackEvent('game', 'exit', MCBM.getDuration());
      
      window.location.reload(true);
      
    }
    
    // ----------------------------------------------------------------
    
    function _onResize() {
      // debounce the resize
      $.doTimeout( 'resize', 250, function(){
        
        // only updating the width, height is determined by container size or MAX_HEIGHT
        if ($win.width() > MCBM.MAX_WIDTH) {
          MCBM.$container.css({
            'width': MCBM.MAX_WIDTH+'px',
            'left': '50%',
            'margin-left': Math.floor(-MCBM.MAX_WIDTH * 0.5) + 'px'
          });
        } else {
          MCBM.$container.css({
            'width': '100%',
            'left': '0',
            'margin-left': '0'
          });
        }
        
        var w = MCBM.$container.outerWidth();
        
        _gameDisplay.resize(w);
        _gameCreeper.resize(w);
        _gamePickaxe.resize(w);
        
      });      
    }
    
    // ----------------------------------------------------------------
    // ----------------------------------------------------------------
    
    _init();
    
  };

})(jQuery);
