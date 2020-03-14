console.log('canvas.js initialize');
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('scroll', noScroll);
function noScroll() {
    window.scrollTo(0, 0);
  }
window.onresize = function()
{
    console.log('window size changed. recommended size is 1920x1080.')
}
var c = canvas.getContext('2d');
window.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 37: // Left
        console.log('left');
      break;
  
      case 38: // Up
        console.log('up');
      break;
  
      case 39: // Right
        console.log('right');
      break;
  
      case 40: // Down
        console.log('down');
      break;
    }
  }, false);  

var x = Math.random() * innerWidth;
var y = Math.random() * innerHeight;
var dx = (Math.random() - 0.5)*8;
var dy = (Math.random() - 0.5)*8;
var radius = 30;

// begin drawing
function circle(x,y,dx,dy,radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;

  this.draw = function() {
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.strokeStyle = 'red';
    c.stroke();
  }
  this.update = function() {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }  
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
}
var circleArray = [];

for(var i = 0; i < 100; i++) {
  circleArray.push(new circle(x,y,dx,dy,radius))
} //nice

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0,0,innerWidth,innerHeight);
  for(var i = 0; i < circleArray.length; i++) {
    circleArray[i]
  }
}
animate();