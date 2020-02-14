/* 
   mainWrite.js
   luphoria - luphoria.github.io
*/
let bookmarklets = ['<a href="javascript:alert(1)">Firebug Lite</a><br>','<a href="javascript:void+function%28%29%7B%2F%2%28function%28%29%7Bvar+t%3Dprompt%28%22Welcome+to+UBer+v2.8.%5Cn%5CbEnter+URL.+The+one+already+there+is+Google.%5Cn%5CbMake+sure+you+put+an+http%3A%2F%2F+or+https%3A%2F%2F+at+the+beginnng.%5Cn%5Cb+You+may+need+to+load+unsafe+scripts.%5Cn%5Cb%5C%25F3%25A0%2581%25A5NOTICE%3A+The+development+of+UBer+is+slowing%2C+as+there%27s+not+much+more+to+add.+I+am+open+to+suggestions.%5Cn%5Cb%5C%25F3%25A0%2581%25A5%5Cn%5Cb%5C%25F3%25A0%2581%25A5%5Cn%5Cb%5C%25F3%25A0%2581%25A5%22%2Cplaceholder%3D%22%2F%2Fwww.google.com%2Fwebhp%3Figu%3D1%22%29%3B%22%22%21%3Dt%26%26null%21%3Dt%26%26document.write%28%22%3Ctitle%3EUBer+2.8+by+luphoria%3A+https%3A%2F%2Fluphoria.github.io%3C%2Ftitle%3E%3Cdiv+position%3Aabsolute%3B+left%3A+0%3B+right%3A+0%3B+bottom%3A+0%3B+top%3A+0px%3B+%3E%3Ciframe+src%3D%27%22%2Bt%2B%22%27+style%3D%27+position%3A+fixed%3B+top%3A+0px%3B+bottom%3A+0px%3B+right%3A+0px%3B+width%3A+100%25%3B+border%3A+none%3B+margin%3A+0%3B+padding%3A+0%3B+overflow%3A+hidden%3B+z-index%3A+999999%3B+height%3A+100%25%3B%27+%3E%3E%3C%2Fiframe%3E%3C%2Fdiv%3E%22%29%7D%29%28%29%7D%28%29%3B">UBer v2.8</a><br>']
let bkmltNo = bookmarklets.length;
let i = 0;
function getList(returnTF) {
    while (i <= bkmltNo) { // checks for variable i being smaller than amount of bookmarklets
        if (returnTF == true) { // checks for if return value wanted to be true
            document.getElementById('list').innerHTML = 'bookmarklets[' + i + ']';
            var i = i + 1; // it's like for i in range but in JavaScript!!! also i messed up bc python is being big dumb and messing w my js knowledge
        }
    }
}
var frame = document.createElement('body');
frame.innerHTML = '<div id="container"><div id="header">Bookmarklet Hub test</div><div id="list">' + getList(true) + '</div></div>';
