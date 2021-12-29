import * as THREE from "./lib/three.module.js";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const rd = new THREE.WebGLRenderer({ antialias: true }); // creates webgl rendering area
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT); // creates camera

rd.setSize(WIDTH, HEIGHT); // configs area..
rd.setClearColor(0x412e41, 1);
document.getElementById("container").appendChild(rd.domElement);

scene.add(camera);
// TODO completely change this look
/* define functions */
function render() {
  requestAnimationFrame(render);
  rd.render(scene, camera);
}

let counter = 0;
let counterGoal = 120;

let cubes = [];
while (counter <= counterGoal) {
  let cubeX = Math.random() * 69;
  let cubeY = Math.random() * 69;
  let cubeZ = Math.random() * 69;

  if (Math.round(cubeX / 69) == 0) cubeX = -cubeX;
  if (Math.round(cubeY / 69) == 0) cubeY = -cubeY;
  if (Math.round(cubeZ / 69) == 0) cubeZ = -cubeZ;

  let geometry = new THREE.BoxGeometry(
    Math.random() * 20,
    Math.random() * 20,
    Math.random() * 20
  );
  let material = new THREE.MeshBasicMaterial({ color: 0x513e51 });
  if (counterGoal / 4 > counter)
    material = new THREE.MeshBasicMaterial({ color: 0x412e41 });
  let cube = new THREE.Mesh(geometry, material);

  cube.position.x = cubeX;
  cube.position.y = cubeY;
  cube.position.z = cubeZ;

  cubes[counter] = cube;

  counter += 1;
}
let i = 0;
while (i < cubes.length) {
  scene.add(cubes[i]);
  i += 1;
}
window.addEventListener("mousemove", (h) => {
  i = 0;
  while (i < cubes.length) {
    let randNum1 = Math.random();
    let randNum2 = Math.random();
    let randNum3 = Math.random();
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
