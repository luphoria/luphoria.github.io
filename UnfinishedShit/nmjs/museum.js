import { OBJLoader2} from "./lib/OBJLoader2.js"
import * as THREE from "./lib/three.module.js"
import "./lib/keydrown.min.js"

var WIDTH = 640
var HEIGHT = 448

var rd = new THREE.WebGLRenderer({antialias:true}) // creates webgl rendering area
rd.setSize(WIDTH,HEIGHT) // configs area..
rd.setClearColor(0xFFFFFF,1)
window.document.body.appendChild(rd.domElement)

var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(60,WIDTH/HEIGHT) // creates camera
camera.position.y = 3
camera.position.z = 140
var dir = new THREE.Vector3()
var spd = 1
var lookUpToggler = false
scene.add(camera)

console.error("fuck"); console.error("somebody opened the console"); console.error("shit"); console.error("what do i do now"); console.warn("Please do be careful, the console can be used to steal your data! It may also make the game react in odd ways.\n\nNot as much as you may expect can be done here, due to everything being obfuscated on runtime. Hate to get your hopes down.")

// var mvmtModifier = -0.5

/* define functions */
function render() {
    requestAnimationFrame(render)
    camera.position.x = player.position.x
    camera.position.y = player.position.y
    camera.position.z = player.position.z

    camera.rotation.y = player.rotation.y

    if(lookUpToggler) {
        camera.rotation.x += 0.01
        camera.rotation.z += 0.01
    } else {
        camera.rotation.x -= 0.01
        camera.rotation.z -= 0.01
    }
    if(camera.rotation.x > 0.6 || camera.rotation.z > 0.6) {
        camera.rotation.x = 0.6
        camera.rotation.z = 0.6
    } else if(camera.rotation.x < 0 || camera.rotation.z < 0) {
        camera.rotation.x = 0
        camera.rotation.z = 0
    }
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
        if(player.position.x > col[inc][0] && player.position.x < col[inc][3] && player.position.z > col[inc][2] && player.position.z < col[inc][5]) return true
        inc += 2
    }
    return false
}

var playergeo = new THREE.BoxGeometry(40,40,40)
var material = new THREE.MeshBasicMaterial()
var player = new THREE.Mesh(playergeo,material)
scene.add(player)

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
    "./assets/obj/1/OPT.obj",
    function(object) {scene.add(object);object.position.y -= 40;object.scale.set(2.9,2.9,2.9)},
    function(xhr){console.log( xhr.loaded / xhr.total * 100 + '% OBJ loaded' )}
)
function move(type,speed) {
    if(type == "move") {
        player.getWorldDirection(dir)
        player.position.addScaledVector(dir,speed)
        if(!collisionCheck()) {
            player.position.addScaledVector(dir,-speed)
        }
    } else if (type == "rotate") {
        player.rotation.y += speed/30
    } else { console.error("ERROR unknown move type " + type) }
}

kd.W.down(function(){move("move",-spd)})
kd.A.down(function(){move("rotate",spd)})
kd.S.down(function(){move("move",spd)})
kd.D.down(function(){move("rotate",-spd)})
kd.E.down(function(){lookUpToggler = true})
kd.E.up(function(){lookUpToggler = false})

var myAudio = new Audio('./assets/sfx/museum.mp3'); 
myAudio.addEventListener('ended', function() { // Thanks @kingjeffrey on stackoverflow for FF loop support!
    this.currentTime = 0;
    this.play();
}, false);
myAudio.play();

kd.run(function(){kd.tick()})
render()