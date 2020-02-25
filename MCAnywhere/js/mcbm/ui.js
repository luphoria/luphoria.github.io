(function($){

  MCBM.ui = function() {
  
    
    var _styles = ''+
      '#mcbm-ui-container {'+
        'position: fixed;'+
        'bottom: 0px;'+
        'left: 0px;'+
        'width: 100%;'+
        'min-width: 1224px;'+
        'height: 73px;'+
        'overflow: hidden;'+
        'z-index: 10001;'+
      '}'+
      
      '#mcbm-ui {'+
        'position: absolute;'+
        'bottom: -73px;'+
        'left: 0px;'+
        'width: 100%;'+
        'height: 73px;'+
        'background: #444444;'+
      '}'+
      
      '#mcbm-ui-container a { text-indent: -9999px; overflow: hidden; }'+
      
      '#mcbm-ui-button-area {'+
        'position: relative;'+
        'margin: 0 205px 0 0;'+
        'overflow: hidden;'+
        'height: 93px;'+
      '}'+
      
      '#mcbm-dirt-bg {'+
        'position: absolute;'+
        'top: 0px;'+
        'left: 0px;'+
        'width: 100%;'+
        'height: 93px;'+
      '}'+
      
      '#mcbm-dirt-bg-left {'+
        'float: left;'+
        'width: 119px;'+
        'height: 93px;'+
        'background: url("'+MCBM.rootURI+'/img/ui/dirt-bg-sides.jpg") no-repeat 0 0;'+
      '}'+
      
      '#mcbm-dirt-bg-mid {'+
        'margin: 0 122px 0 119px;'+
        'height: 93px;'+
        'background: url("'+MCBM.rootURI+'/img/ui/dirt-bg-repeat-x.jpg") repeat-x;'+
      '}'+
      
      '#mcbm-dirt-bg-right {'+
        'position: absolute;'+
        'top: 0px;'+
        'right: 0px;'+
        'width: 122px;'+
        'height: 93px;'+
        'background: url("'+MCBM.rootURI+'/img/ui/dirt-bg-sides.jpg") no-repeat -119px 0;'+
      '}'+
      
      '#mcbm-ui-button-container {'+
        'position: absolute;'+
        'top: 0px;'+
        'left: 0px;'+
        'width: 100%;'+
        'height: 93px;'+
      '}'+
      
      '#mcbm-ui-buttons {'+
        'margin: 21px auto 0;'+
        'width: 888px;'+
        'height: 40px;'+
      '}'+
      
      '.mcbm-ui-button {'+
        'background: url("'+MCBM.rootURI+'/img/ui/ui-buttons.png") no-repeat;'+
      '}'+
      
      '.esp .mcbm-ui-button, .esp .mcbm-ui-button:hover {'+
        'background: url("'+MCBM.rootURI+'/img/ui/ui-buttons-esp.png") no-repeat;'+
      '}'+
      
      '#mcbm-play-creeper {'+
        'float:left;'+
        'margin-right: 21px;'+
        'width: 296px;'+
        'height: 36px;'+
        'background-position:0px 0px;'+
      '}'+
      
      '#mcbm-play-creeper:hover {'+
        'background-position: 0px -38px;'+
      '}'+
            
      '#mcbm-play-pickaxe {'+
        'float:left;'+
        'margin-right: 52px;'+
        'width: 296px;'+
        'height: 36px;'+
        'background-position: -298px 0px;'+
      '}'+
      
      '#mcbm-play-pickaxe:hover {'+
        'background-position: -298px -38px;'+
      '}'+
      
      '#mcbm-exit {'+
        'float:left;'+
        'width: 106px;'+
        'height: 36px;'+
        'background-position: -596px 0px;'+
      '}'+
      
      '#mcbm-exit:hover {'+
        'background-position: -596px -38px;'+
      '}'+
            
      '#mcbm-social {'+
        'float:left;'+
        'margin: 3px 23px 0 0;'+
      '}'+
      
      '#mcbm-fb {'+
        'float:left;'+
        'margin-right: 5px;'+
        'width: 28px;'+
        'height: 28px;'+
        'background: url("'+MCBM.rootURI+'/img/ui/share-icons.png") no-repeat 0 0;'+
      '}'+
      
      '#mcbm-fb:hover {'+
        'background-position: 0 -28px;'+
      '}'+
      
      '#mcbm-gplus {'+
        'float:left;'+
        'margin-right: 5px;'+
        'width: 28px;'+
        'height: 28px;'+
      '}'+
      
      '#mcbm-twitter {'+
        'float:left;'+
        'width: 28px;'+
        'height: 28px;'+
        'background: url("'+MCBM.rootURI+'/img/ui/share-icons.png") no-repeat -56px 0;'+
      '}'+
      
      '#mcbm-twitter:hover {'+
        'background-position: -56px -28px;'+
      '}'+
      
      '#mcbm-xperia-logo {'+
        'position: absolute;'+
        'top: 0px;'+
        'right: 0px;'+
        'width: 205px;'+
        'height: 73px;'+
      '}'+
      
      '#mcbm-show-ui {'+
        'position: absolute;'+
        'bottom: -31px;'+
        'left: 0px;'+
        'width: 203px;'+
        'height: 31px;'+
        'background: url("'+MCBM.rootURI+'/img/ui/show-ui-tab.png") no-repeat 0 0;'+
      '}'+
      
      '.esp #mcbm-show-ui {'+
        'background: url("'+MCBM.rootURI+'/img/ui/show-ui-tab-esp.png") no-repeat 0 0;'+
      '}';

    var _uiHtml = ''+    
    '<div id="mcbm-ui-container">'+
    
      '<a id="mcbm-show-ui" href="#">Show Controls</a>'+
      
      '<div id="mcbm-ui">'+      
        
        '<div id="mcbm-ui-button-area"> <!-- contains dirt background, buttons, stretches to fill area to left of logo -->'+
        
          '<div id="mcbm-dirt-bg">'+
            '<div id="mcbm-dirt-bg-left"></div>'+
            '<div id="mcbm-dirt-bg-mid"></div>'+
            '<div id="mcbm-dirt-bg-right"></div>'+
          '</div>'+
          
          '<div id="mcbm-ui-button-container">'+
            '<div id="mcbm-ui-buttons"> <!-- centered in container -->'+
              '<a id="mcbm-play-creeper" class="mcbm-ui-button" href="#">Unleash the creeper!</a>'+
              '<a id="mcbm-play-pickaxe" class="mcbm-ui-button" href="#">Get you pickaxe!</a>'+

              '<div id="mcbm-social">'+
                '<a id="mcbm-fb" href="'+MCBM.shareFbURI+'" target="_blank">Share on Facebook</a>'+
                //'<div id="mcbm-gplus"><g:plusone size="small" annotation="none"></g:plusone></div>'+
                '<a id="mcbm-twitter" href="'+MCBM.shareTwitterURI+'" target="_blank">Share on Twitter</a>'+
              '</div>'+

              '<a id="mcbm-exit" class="mcbm-ui-button" href="#">Exit</a>'+
            '</div>'+
          '</div>'+
          
        '</div>'+

        '<div id="mcbm-xperia-logo">'+
          '<img src="'+MCBM.rootURI+'/img/ui/xperia-logo.png" width+"205" height="73">'+
        '</div> <!-- anchored to the right -->'+

      '</div>'+

    '</div>';
    
    var $body = $('body'),
        $uiContainer = $(_uiHtml),
        $ui = $uiContainer.find('#mcbm-ui'),
        $dirtBg = $uiContainer.find('##mcbm-dirt-bg'),
        $playCreeperButton = $uiContainer.find('#mcbm-play-creeper'),
        $playPickaxeButton = $uiContainer.find('#mcbm-play-pickaxe'),
        $exitButton = $uiContainer.find('#mcbm-exit'),
        $showUIButton = $uiContainer.find('#mcbm-show-ui'),
        _mouseInUI = false,
        _mouseInUITab = false;
    
    var pScope = {};
    
    function _init() {
            
      $('head').append('<style>'+_styles+'</style>');
      
      MCBM.$container.append($uiContainer);
      $uiContainer = $('#mcbm-ui-container');  
      
      $playCreeperButton.bind('click', _onPlayCreeperClick);
      $playPickaxeButton.bind('click', _onPlayPickaxeClick);
      $exitButton.bind('click', _onExitClick);
      $showUIButton.bind('click', _onShowUIClick);
      
      $ui.bind('mouseenter', function () { _mouseInUI = true; } );
      $ui.bind('mouseleave', function () { _mouseInUI = false; } );
      $ui.bind('mousemove', function () { $body.trigger(MCBM.events.UI_MOUSE_MOVE); } );
      $showUIButton.bind('mouseenter', function () { _mouseInUITab = true; } );
      $showUIButton.bind('mouseleave', function () { _mouseInUITab = false; } );
      $body.bind( 'mousedown', _onMouseDown );
      
      // track share events
      $('#mcbm-fb').bind('click', function() { MCBM.gaTrackEvent('game', 'share', 'Facebook'); } );
      $('#mcbm-twitter').bind('click', function() { MCBM.gaTrackEvent('game', 'share', 'Twitter'); } );
    };
    
    function _onMouseDown(e) {
      
      if (_mouseInUI || _mouseInUITab) {
        e.stopImmediatePropagation();
      }
      
    };
    
    function _transitionUIOpen() {
      var duration = 800;
            
      $showUIButton.stop().animate({bottom: -31}, 300, "easeOutExpo");
      
      $dirtBg.stop().animate({top: 0}, duration, "easeOutExpo");
      $ui.stop().animate({bottom: 0}, duration, "easeOutExpo", _transitionUIOpenComplete);
      
    };
    
    function _transitionUIOpenComplete() {
      $body.trigger(MCBM.events.OPEN_UI_COMPLETE);      
    };
    
    function _transitionUIClose() {    
      var duration = 500;
      
      $showUIButton.stop().animate({bottom: 0}, 500, "easeInOutExpo");
       
      $dirtBg.stop().animate({top: -32}, duration, "easeInOutExpo");
      $ui.stop().animate({bottom: -63}, duration, "easeInOutExpo", _transitionUICloseComplete);

    };
    
    function _transitionUICloseComplete() {
      //debug.log("_transitionUICloseComplete");
      $body.trigger(MCBM.events.CLOSE_UI_COMPLETE);
    };
    
    function _onPlayCreeperClick(e) {
      e.preventDefault();
      
      $body.trigger(MCBM.events.PLAY_CREEPER_CLICK);
    };
    
    function _onPlayPickaxeClick(e) {
      e.preventDefault();
      
      $body.trigger(MCBM.events.PLAY_PICKAXE_CLICK);
    };
        
    function _onExitClick(e) {
      e.preventDefault();
      
      $body.trigger(MCBM.events.EXIT_CLICK);
    };
    
    function _onShowUIClick(e) {
      e.preventDefault();
      
      $body.trigger(MCBM.events.OPEN_UI);
    };
    
    
        
    _init();
    
    // ----------------------------------------------------------------
    // public methods
    // ----------------------------------------------------------------
    
    pScope.open = function () {
      _transitionUIOpen();
    };
    
    pScope.close = function() {
      _transitionUIClose();
    };
    
    return pScope;
  };

})(jQuery);
