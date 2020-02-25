(function($){
	
	MCBM.main = function() {
		
	  var $body = $('body'),
	      _testDisplay = null,
				_gameCreeper = null;

		function _init() {

		  _testDisplay = MCBM.testDisplay(true);
      
      $body.bind(MCBM.events.CREEPER_LOADED, _onCreeperLoaded);
	    _gameCreeper = MCBM.gameCreeper(_testDisplay);
	  
		};
		
		function _onCreeperLoaded() {
		  _gameCreeper.newGame();
		};

		_init();

	};
	
})(jQuery);