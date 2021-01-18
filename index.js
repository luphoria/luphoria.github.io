import * as THREE from "./lib/three.module.js"

var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight

var rd = new THREE.WebGLRenderer({antialias:true}) // creates webgl rendering area
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(60,WIDTH/HEIGHT) // creates camera

rd.setSize(WIDTH,HEIGHT) // configs area..
rd.setClearColor(0x412E41,1)
document.getElementById("container").appendChild(rd.domElement)

scene.add(camera)

/* define functions */
function render() {
    requestAnimationFrame(render)
    var i = 0
    while(i < cubes.length) {
        var randNum = Math.random()
        cubes[i].rotation.x += randNum / 1000
        cubes[i].rotation.y += randNum / 1000
        cubes[i].rotation.z += randNum / 1000
        i += 1
    }
    camera.rotation.x += Math.random() / 100
    camera.rotation.y -= Math.random() / 500
    camera.rotation.z += Math.random() / 800
    rd.render(scene,camera)
}

var counter = 0
var counterGoal = 120

var cubes = []
while(counter <= counterGoal) {
    var cubeX = Math.random() * 69
    var cubeY = Math.random() * 69
    var cubeZ = Math.random() * 69

    if(Math.round(cubeX / 69) == 0) cubeX = -cubeX
    if(Math.round(cubeY / 69) == 0) cubeY = -cubeY
    if(Math.round(cubeZ / 69) == 0) cubeZ = -cubeZ

    var geometry = new THREE.BoxGeometry(Math.random() * 20,Math.random() * 20,Math.random() * 20)
    var material = new THREE.MeshBasicMaterial({color: 0x513E51})
    if(counterGoal / 4 > counter) var material = new THREE.MeshBasicMaterial({color: 0x412E41})
    var cube = new THREE.Mesh(geometry,material)

    cube.position.x = cubeX
    cube.position.y = cubeY
    cube.position.z = cubeZ

    cubes[counter] = cube

    counter += 1
}
var i = 0
while(i < cubes.length) {
    scene.add(cubes[i])
    i += 1
}
render()
