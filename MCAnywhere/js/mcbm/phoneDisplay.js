(function($){

  MCBM.phoneDisplay = function() {
    
    var _styles = ''+
      '#mcbm-phone-container {'+
        'position: fixed;'+
        'top: 0px;'+
        'left: 0px;'+
        'width: 100%;'+
        'height: 350px;'+
        'overflow: hidden;'+
        'z-index: 10002;'+
      '}'+
      
      '#mcbm-phone {'+
        'position: relative;'+
        'margin: -200px auto 0;'+
        'width: 358px;'+
        'height: 315px;'+
      '}'+
      
      '#mcbm-phone-shadow {'+
        'position: absolute;'+
        'top: 0px;'+
        'left: 0px;'+
        'width: 358px;'+
        'height: 194px;'+
      '}'+
      
      '#mcbm-phone-display {'+
        'position: absolute;'+
        'top: 16px;'+
        'left: 16px;'+
        'width: 304px;'+
        'height: 153px;'+
        'background: url("'+MCBM.rootURI+'/img/phone/display.png") no-repeat 0 0 transparent;'+
      '}'+
      
      '#mcbm-phone-screen {'+
        'position: absolute;'+
        'top: 11px;'+
        'left: 44px;'+
        'width: 229px;'+
        'height: 130px;'+
      '}'+
            
      '#mcbm-phone-controller {'+
        'position: absolute;'+
        'top: 40px;'+
        'left: 15px;'+
        'width: 306px;'+
        'height: 129px;'+
        'background: url("'+MCBM.rootURI+'/img/phone/controller.png") no-repeat 0 0 transparent;'+
      '}';

    var _phoneHtml = ''+    
    '<div id="mcbm-phone-container">'+

      '<div id="mcbm-phone">'+
        
        '<div id="mcbm-phone-shadow">'+
          '<img src="'+MCBM.rootURI+'/img/phone/shadow.png" width="100%" height="100%">'+
        '</div>'+
        
        '<div id="mcbm-phone-controller"></div>'+
        
        '<div id="mcbm-phone-display">'+
          '<div id="mcbm-phone-screen">'+
            '<img src="'+MCBM.rootURI+'/img/phone/minecraft-screen.jpg" width="229" height="130">'+
          '</div>'+
        '</div>'+        

      '</div>'+
  
    '</div>';
    
    var $body = $('body'),
        $phoneContainer = $(_phoneHtml),
        $phone = $phoneContainer.find('#mcbm-phone'),
        $phoneShadow = $phoneContainer.find('#mcbm-phone-shadow'),
        $phoneDisplay = $phoneContainer.find('#mcbm-phone-display'),
        $phoneController = $phoneContainer.find('#mcbm-phone-controller'),
        _firstOpen = true;
    
    var pScope = {};
    
    function _init() {
            
      $('head').append('<style>'+_styles+'</style>');
      
      MCBM.$container.append($phoneContainer);
      $phoneContainer = $('#mcbm-phone-container');
      
    };
    
    function _transitionIn() {
      var duration = 700;
      
      $phoneContainer.css({
        'visibility': 'visible',
        'display': 'block'
      });
      
      $phone.stop().animate({marginTop: 0}, duration, "easeOutBack", _transitionInComplete);
      
      if (_firstOpen) {
        setTimeout(_transitionOpen, 450);
      } else {
        _transitionOpen();
      }
    };
    
    function _transitionOut() {
      var duration = 450;
      
      $phone.animate({marginTop: -300}, duration, "easeInOutExpo", _transitionOutComplete);
    };
    
    function _transitionOpen() {
      _firstOpen = false;
      var duration = 500;
      
      $phoneController.stop().animate({top: 146}, duration, "easeInOutExpo");
      $phoneShadow.stop().animate({height: 311}, duration, "easeInOutExpo");
      
    };    
    
    function _transitionClose() {
      var duration = 400;
      
      $phoneController.animate({top: 40}, duration, "easeInOutExpo");
      $phoneShadow.animate({height: 194}, duration, "easeInOutExpo");

    };
    
    function _transitionInComplete() {
      
    };
    
    function _transitionOutComplete() {
      $phoneContainer.css({
        'visibility': 'hidden',
        'display': 'none'
      });
    };
        
    _init();
    
    // ----------------------------------------------------------------
    // public methods
    // ----------------------------------------------------------------
    
    pScope.transitionIn = function () {
      _transitionIn();
    };
    
    pScope.transitionOut = function() {
      _transitionOut();
    };
    
    return pScope;
  };

})(jQuery);
