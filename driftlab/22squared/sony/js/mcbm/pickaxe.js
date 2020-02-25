(function($){

  MCBM.pickaxe = function() {
    
    var $pickaxeCursorDiv,
        _swingInterval = null,
        _swingDuration = 125,
        _isDown = false,
        _isPaused = true,
        _tStart = 0;
    
    var pScope = {};
    
    function _init() {
    
      $pickaxeCursorDiv = $('<div id="pickaxe"></div>');
      $pickaxeCursorDiv.css({
        'position':'absolute',
        top:0,
        left:0,
        width:315,
        height:340,
        'cursor': 'crosshair',
        'background':'url('+MCBM.rootURI+'/img/sprites/pickaxe.png)'
      });
      MCBM.$container.append($pickaxeCursorDiv);
    
      $pickaxeCursorDiv.css('display', 'none');
    };
    
    function _swingCycle() {
      
      if (_isDown) {
        _swingUp();
      } else {
        _swingDown();
      }
      
      _tStart = new Date().getTime();
      
    }
    
    function _swingDown() {
      _isDown = true;
      $pickaxeCursorDiv.css('background-position','0 -340px');
    };
    
    function _swingUp() {
      _isDown = false;
      $pickaxeCursorDiv.css('background-position','0 0');
    };
    
    _init();
    
    pScope.start = function() {
      if (_isPaused) {
        _isPaused = false;
        _tStart = new Date().getTime();
      
        _swingDown();
      } else {
        return;
      }
    };
    
    pScope.stop = function() {
      
      if (_isPaused) {
        return;
      }
      
      _isPaused = true;
      
      _swingUp();
    };
    
    pScope.setPosition = function(x, y) {
      $pickaxeCursorDiv.css({
        left:x-5,
        top:y-253
      });
      
      $pickaxeCursorDiv.css('display', 'block');
    };
    
    pScope.update = function(tCur) {
      if (_isPaused) {
        return;
      }
      
      if (tCur - _tStart > _swingDuration) {
        _swingCycle();
      }
    };
    
    pScope.hide = function() {
      $pickaxeCursorDiv.css('display', 'none');
    };
    
    return pScope;
  }

})(jQuery);