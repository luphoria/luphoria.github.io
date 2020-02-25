// ====================================================================
// Test Display - basic setup for canvas display and framerate testing
// 
//
// author: Nate Horstmann nate@natehorstmann.com
// ====================================================================

(function($){ // requires jQuery
  
  // ====================================================================
  // @testDisplay object
  // ====================================================================
  MCBM.testDisplay = function(showStats, use3D) {
    
    var $body = $('body'),
        displayCanvas = document.createElement('canvas'),
        displayCanvasCtx = displayCanvas.getContext((use3D === true) ? 'experimental-webgl' : '2d'),
        $stats = null;
    
    var  pScope = {};
    
    pScope.canvas = displayCanvas;
    pScope.dirty = false;
    
    displayCanvas.width = MCBM.$container.outerWidth();
    displayCanvas.height = MCBM.$container.outerHeight();
    
    $displayCanvas = $(displayCanvas);
    $displayCanvas.css({
      'position':"absolute",
      'top':'0px',
      'left':'0px'
    });
    MCBM.$container.append($displayCanvas);
    
    // framerate display
    if (showStats) {
      pScope.stats = new Stats();
      $stats = $(pScope.stats.domElement);
      $stats.css({
        'position': 'absolute',
        'top': '0px'
      });
      MCBM.$container.append( $stats );
    }
    
    pScope.getContext = function() {
      return displayCanvasCtx;
    };
    
    pScope.getCanvas = function() {
      return displayCanvas;
    };
    
    pScope.getContainer = function() {
      return $container;
    }
    
    pScope.clear = function() {
      
      displayCanvasCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
      pScope.dirty = false;
      
    }
    
    return pScope;
    
  };
  
})(jQuery);