(function($){

	MCBM.main = function() {
		
		var _testDisplay = null,
				_gamePickaxe = null;
				
		function _init() {
		  
		  _testDisplay = MCBM.testDisplay(true);
	    
	    _gamePickaxe = MCBM.gamePickaxe(_testDisplay);
	    _gamePickaxe.newGame();
	    
		};
		
		_init();
		
	};
	
})(jQuery);