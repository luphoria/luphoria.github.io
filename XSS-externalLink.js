//Use this to test a JS injection XSS.
var proGamerTime = "<h1>JavaScript injected HTML</h1><p>Credit: luphoria#7667<br /><button onclick='window.location.href=\"//luphoria.github.io\"'>luphoria.github.io</button></p>"

alert("Successfully injected!");
alert("document.cookie would contain your credentials. Here is your document.cookie for this website: \n\n\n " + document.cookie);
alert("Don't worry though, this info isn't being sent to any other website. This is a mere test page.");

document.write(proGamerTime);