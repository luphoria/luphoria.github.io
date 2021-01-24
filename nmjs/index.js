import * as THREE from "./lib/three.module.js"

var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight

var rd = new THREE.WebGLRenderer({antialias:true}) // creates webgl rendering area
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(60,WIDTH/HEIGHT) // creates camera

rd.setSize(WIDTH,HEIGHT) // configs area..
rd.setClearColor(0x005CE6,1)
document.getElementById("container").appendChild(rd.domElement)

scene.add(camera)

/* define functions */
function render() {
    requestAnimationFrame(render)
    var i = 0
    while(i < cubes.length) {
        var randNum1 = Math.random()
        var randNum2 = Math.random()
        var randNum3 = Math.random()
        if(Math.round(randNum1*2) == 0) randNum1 = -randNum1
        if(Math.round(randNum2*2) == 0) randNum2 = -randNum2
        if(Math.round(randNum3*2) == 0) randNum3 = -randNum3
        cubes[i].rotation.x += randNum1 / (Math.random()*1000)
        cubes[i].rotation.y += randNum2 / (Math.random()*1000)
        cubes[i].rotation.z += randNum3 / (Math.random()*1000)
        i += 1
    }
    camera.rotation.x += Math.random() / 200
    camera.rotation.y -= Math.random() / 1000
    camera.rotation.z += Math.random() / 1600
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
    var material = new THREE.MeshBasicMaterial({color: 0x0066FF})
    if(counterGoal / 4 > counter) var material = new THREE.MeshBasicMaterial({color: 0x005CE6})
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
