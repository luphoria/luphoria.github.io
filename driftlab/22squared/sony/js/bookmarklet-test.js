var scripts = [
                { filename: 'mcbm.min.js', desc: "Full Bookmarklet Experience Test", lang:'eng'},
                { filename: 'mcbm.min.js', desc: "Spanish - Full Bookmarklet Experience Test", lang:'esp'}
              ],
// --------------------------------------------------------------------
		href = window.location.href,
    rootURI = href.substring(0, href.lastIndexOf('/') + 1);

		bookmarkletBase = "javascript:(function(){window.mcbmRootURI='"+rootURI+"';window.mcbmScriptURI='{SCRIPT_URI}';window.mcbmLang='{LANG}';var s,ss=window.mcbmRootURI+'js/mcbm-load.min.js';s=document.createElement('script');s.src=ss;document.body.appendChild(s);})();";
    
		/*/
		// if we end up needing to load multiple scripts first use this
bookmarkletBase = "javascript:(function(){window.mcbmRootURI='"+rootURI+"';window.mcbmScriptURI='{SCRIPT_URI}';var i,s,ss=['"+rootURI+"/js/mcbm-load.js'];for(i=0;i!=ss.length;i++){s=document.createElement('script');s.src=ss[i];document.body.appendChild(s);}})();";
    //*/


jQuery(function($){
  
  var $buttonsHolder = $('#radio-buttons'),
      $buttonsList = $('<ul></ul>'),
      $textArea = $('#script-copy'),
      $link = $('#bookmarklet-button'),
      thisWindow = window,
      experienceWindow = null;

  $buttonsHolder.append($buttonsList);
  
  // Add the radio buttons.
  for(var i = 0; i < scripts.length; i++) {
    var buttonID = 'scriptOption' + i,
        buttonMarkup = '<li><input type="radio" id="'+buttonID+'" name="script-group" value="'+scripts[i]['filename']+'" data-language="'+scripts[i]['lang']+'"> <label for="'+buttonID+'">' + scripts[i]['desc'] + '</label></li>',
        $buttonLI = $(buttonMarkup);
    $buttonsList.append($buttonLI);
  }
  
  var $radioButtons = $buttonsList.find('input[type="radio"]');
  
  $radioButtons.each(function(n){
    var $button = $(this),
        $label = $(this).parent().find('label'),
        descTxt = $label.text();
    
    // descTxt = descTxt.substr(1);
    // descTxt = descTxt.substring(0, descTxt.length - 1);
    
    $button.click(function(e){
      var toCopy = bookmarkletBase.split('{SCRIPT_URI}').join($button.attr('value'));
      toCopy = toCopy.split('{LANG}').join($button.attr('data-language'));    
      
      $textArea.html(toCopy);
      
      $link.attr('href', toCopy);
      $link.html(descTxt);
    });
  });
  
  // Now automatically select the first button.
  setTimeout(function(){
    $radioButtons.first().attr('checked', 'checked').click();
  }, 100);
  
  // Show (or attempt to show) the browser version.
  BrowserDetect.init();
  var $browser = $('#browser-version'),
      browserVersion = '<p>Your OS: <strong>'+BrowserDetect.OS+'</strong><br>Your Browser: <strong>'+BrowserDetect.browser+'</strong><br>Browser Version: <strong>' + BrowserDetect.version + '</strong></p>';
  $browser.html(browserVersion);
  
});