var id = prompt("Enter the name of the custom level you would like to get in to.\nNote if you enter an invalid URL simply nothing will change.");
var scriptToLoad = "https://luphoria.github.io/RockbasherMod/CustomLevels" + id + ".js";
//main script
(function(){document.body.appendChild(document.createElement('script')).src=scriptToLoad })();