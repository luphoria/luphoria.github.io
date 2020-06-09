// main.js for plan editor v0
// luphoria#7667
function loadFile() {
    var input = prompt("Due to limitations of Windows clipboard and certain hexadecimal values, they can only be viewed in hex value in the first place.\nTo add them you'll have to paste the HEX VALUES from HxD here:");
    input = input.replace(/\s/g, '');
    console.log("Modified string:\n\n" + input);
    document.getElementById('output').value = input;
}

//FUNCTIONS FOR MANIPULATION
alert("Open your JS console to see the logs this leaves.");
function dependencies() {
    var hex = document.getElementById('output').value;
    var iconSHA1 = hex.substring(780, 820);
    console.log("SHA1 for icon: " + iconSHA1);
}