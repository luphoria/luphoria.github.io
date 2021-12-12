"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var THREE = _interopRequireWildcard(require("./lib/three.module.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var rd = new THREE.WebGLRenderer({
  antialias: true
}); // creates webgl rendering area

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT); // creates camera

rd.setSize(WIDTH, HEIGHT); // configs area..

rd.setClearColor(0x412E41, 1);
document.getElementById("container").appendChild(rd.domElement);
scene.add(camera);
/* define functions */

function render() {
  requestAnimationFrame(render);
  rd.render(scene, camera);
}

var counter = 0;
var counterGoal = 120;
var cubes = [];

while (counter <= counterGoal) {
  var cubeX = Math.random() * 69;
  var cubeY = Math.random() * 69;
  var cubeZ = Math.random() * 69;
  if (Math.round(cubeX / 69) == 0) cubeX = -cubeX;
  if (Math.round(cubeY / 69) == 0) cubeY = -cubeY;
  if (Math.round(cubeZ / 69) == 0) cubeZ = -cubeZ;
  var geometry = new THREE.BoxGeometry(Math.random() * 20, Math.random() * 20, Math.random() * 20);
  var material = new THREE.MeshBasicMaterial({
    color: 0x513E51
  });
  if (counterGoal / 4 > counter) material = new THREE.MeshBasicMaterial({
    color: 0x412E41
  });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.x = cubeX;
  cube.position.y = cubeY;
  cube.position.z = cubeZ;
  cubes[counter] = cube;
  counter += 1;
}

var i = 0;

while (i < cubes.length) {
  scene.add(cubes[i]);
  i += 1;
}

window.addEventListener("mousemove", function (h) {
  i = 0;

  while (i < cubes.length) {
    var randNum1 = Math.random();
    var randNum2 = Math.random();
    var randNum3 = Math.random();
    if (Math.round(randNum1 * 2) == 0) randNum1 = -randNum1;
    if (Math.round(randNum2 * 2) == 0) randNum2 = -randNum2;
    if (Math.round(randNum3 * 2) == 0) randNum3 = -randNum3;
    cubes[i].rotation.x += randNum1 / (Math.random() * 50);
    cubes[i].rotation.y += randNum2 / (Math.random() * 50);
    cubes[i].rotation.z += randNum3 / (Math.random() * 50);
    i += 1;
  }

  camera.rotation.x += Math.random() / 100;
  camera.rotation.y -= Math.random() / 500;
  camera.rotation.z += Math.random() / 800;
});
render();