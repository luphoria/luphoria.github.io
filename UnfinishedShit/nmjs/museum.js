import { OBJLoader2} from "./lib/OBJLoader2.js"
import * as THREE from "./lib/three.module.js"

var WIDTH = 320
var HEIGHT = 224

var rd = new THREE.WebGLRenderer({antialias:true}) // creates webgl rendering area
rd.setSize(WIDTH,HEIGHT) // configs area..
rd.setClearColor(0x00C0DD,1)
window.document.body.appendChild(rd.domElement)

var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(80,WIDTH/HEIGHT) // creates camera
camera.position.y = 3
camera.position.z = 140
var dir = new THREE.Vector3()
var spd = 2
scene.add(camera)

console.error("fuck"); console.error("somebody opened the console"); console.error("shit"); console.error("what do i do now"); console.warn("Please do be careful, the console can be used to steal your data! It may also make the game react in odd ways.\n\nNot as much as you may expect can be done here, due to everything being obfuscated on runtime. Hate to get your hopes down.")

// var mvmtModifier = -0.5

/* define functions */
function render() {
    requestAnimationFrame(render)
    /*if(debugCube.position.y < -20) mvmtModifier = +0.5
    if(debugCube.position.y > +20) mvmtModifier = -0.5
    debugCube.position.y += mvmtModifier*/
    rd.render(scene,camera)
}
function getCoords(box,collision) { // Spent way too long trying to make a giant detection for negative/positive, realised i could add a modifier to a "master" return anyways. Think fucking smarter, not harder.
    var collisionModifier = 0 // defines collisionModifier to not return undefined on collision == false
    if(collision == true) collisionModifier = 5 
    return [(box.position.x - box.geometry.parameters.width / 2) - collisionModifier,(box.position.y - box.geometry.parameters.height / 2),(box.position.z - box.geometry.parameters.depth / 2) - collisionModifier,(box.position.x + box.geometry.parameters.width / 2) + collisionModifier,(box.position.y + box.geometry.parameters.height / 2),(box.position.z + box.geometry.parameters.depth / 2 + collisionModifier)]
}
function collisionCheck() {
    var inc = 0
    while(col.length > inc) {
        if(camera.position.x > col[inc][0] && camera.position.x < col[inc][3] && camera.position.z > col[inc][2] && camera.position.z < col[inc][5]) return true
        inc += 2
    }
    return false
}
var geometry = new THREE.BoxGeometry( 250, 100, 280 )
var material = new THREE.MeshBasicMaterial( {color: 0xFF00FF} )
var debugCube = new THREE.Mesh( geometry, material )
scene.add( debugCube )
debugCube.position.x += 30
var debugCubeCollision = getCoords(debugCube,false)
/*
var geometry = new THREE.BoxGeometry(25,25,25)
var material = new THREE.MeshBasicMaterial({color: 0xFFFF00})
var debugCube2 = new THREE.Mesh(geometry,material)
scene.add(debugCube2)
debugCube2.position.x += 80
var debugCube2Collision = getCoords(debugCube2,true)
*/
var col = [debugCubeCollision,"&"/*,debugCube2Collision*/]


const loader = new OBJLoader2()
loader.load(
    "./assets/obj/1_opt.obj",
    function(object) {scene.add(object);object.position.y -= 40;/*object.scale.set(0.4,0.4,0.4)*/},
    function(xhr){console.log( xhr.loaded / xhr.total * 100 + '% OBJ loaded' )}
)

document.onkeydown = function(k) {
    if(k.code != "KeyE") camera.rotation.x -= 0.05
    if(camera.rotation.x < 0) camera.rotation.x = 0
    switch (k.code) {
        case "KeyA": // left
            camera.rotation.y += 0.2
            if(camera.rotation.y >= 6 || camera.rotation.y <= -6) camera.rotation.y = 0 // 6 = full rotation
            else if(Math.round(camera.rotation.y) == 3) 
            break
        case "KeyW": // up
            camera.getWorldDirection(dir)
            camera.position.addScaledVector(dir,spd)
            if(!collisionCheck()) {
                camera.position.addScaledVector(dir,-spd)
            }
            break
        case "KeyD": // right
            camera.rotation.y -= 0.2
            if(camera.rotation.y >= 6 || camera.rotation.y <= -6) camera.rotation.y = 0 // 6 = full rotation
            break
        case "KeyS": // down
            camera.getWorldDirection(dir)
            camera.position.addScaledVector(dir,-spd)
            if(!collisionCheck()) {
                camera.position.addScaledVector(dir,spd)
            }
            break
        case "KeyE": // triangle/look up
            if(camera.position.x >= 0) camera.rotation.x += 0.05
            if(camera.rotation.x > 0.6) camera.rotation.x = 0.6
            break
        default: break
    }
}

render()