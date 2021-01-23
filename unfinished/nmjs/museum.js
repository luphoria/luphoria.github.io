import { OBJLoader} from "./lib/OBJLoader.js"
import * as THREE from "./lib/three.module.js"
import { MTLLoader } from './lib/MTLLoader.js'
import "./lib/keydrown.min.js"

var WIDTH = 320
var HEIGHT = 224

var manager = new THREE.LoadingManager();
var rd = new THREE.WebGLRenderer({antialias:false}) // creates webgl rendering area
var scene = new THREE.Scene()
var loader = new OBJLoader()
var camera = new THREE.PerspectiveCamera(60,WIDTH/HEIGHT) // creates camera
var dir = new THREE.Vector3()
var material = new THREE.MeshBasicMaterial({visible: false})
var debugMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000})

rd.setSize(WIDTH,HEIGHT) // configs area..
rd.setClearColor(0x930000,1)
document.getElementById("gameContainer").appendChild(rd.domElement)

var spd = 0.5
var lookUpToggler = false
scene.add(camera)

/* define functions */
function render() {
    requestAnimationFrame(render)
    player.getWorldDirection(dir)

    camera.position.x = player.position.x
    camera.position.y = player.position.y
    camera.position.z = player.position.z
    camera.rotation.y = player.rotation.y

    if(lookUpToggler) { 
      camera.rotation.x += dir.x * 0.01
      camera.rotation.z -= dir.z * 0.01
    } else { 
      camera.rotation.x -= 0.01 
      camera.rotation.z -= 0.01
    }
    if(camera.rotation.x > 0.6) { camera.rotation.x = 0.6 } else if(camera.rotation.x < 0) { camera.rotation.x = 0 }
    if(camera.rotation.z > 0.6) { camera.rotation.z = 0.6 } else if(camera.rotation.z < 0) { camera.rotation.z = 0 }
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
        inc += 1
    }
    return false
}

var playergeo = new THREE.BoxGeometry(40,40,40)
var player = new THREE.Mesh(playergeo,material)
scene.add(player)


player.position.y = -30

/*opt
player.position.x = 160
player.position.z = 145
player.rotation.y = 1.57
*/
// fro

const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 1 );
scene.add( ambientLight );

player.position.x = 0
player.position.z = 0
player.rotation.y = 1.57
var geometry = new THREE.BoxGeometry( 220, 100, 290 )
var colCube1 = new THREE.Mesh( geometry, material )
scene.add( colCube1 )
colCube1.position.x -= 20
colCube1.position.z += 10
var colCube1_c = getCoords(colCube1,false)

var geometry = new THREE.BoxGeometry(100,100,25)
var colCube2 = new THREE.Mesh(geometry,material)
scene.add(colCube2)
colCube2.position.x += 120
colCube2.position.z += 140
var colCube2_c = getCoords(colCube2,true)

var geometry = new THREE.BoxGeometry(75,100,55)
var colCube3 = new THREE.Mesh(geometry,material)
scene.add(colCube3)
colCube3.position.x += 100
colCube3.position.z -= 140
var colCube3_c = getCoords(colCube3,true)

var col = [colCube1_c,colCube2_c,colCube3_c]
/*
loader.load(
    "./assets/obj/1/FRO/FRO.obj",
    function(object) {scene.add(object);object.position.y -= 40;object.scale.set(6,6,6)},
    function(xhr){if(xhr.loaded / xhr.total * 100 != 100) {document.getElementById("loading").style.visibility = "visible"} else {document.getElementById("loading").style.visibility = "hidden"}}
)
*/
var mtlLoader = new MTLLoader( manager )
mtlLoader.setPath( './assets/obj/1/FRO/' )
mtlLoader.load( 'FRO.mtl', function ( materials ) {

    materials.preload();

    var objLoader = new OBJLoader( manager );
        objLoader.setMaterials( materials ); // TODO FIX THIS
        objLoader.setPath( './assets/obj/1/FRO/' );
        objLoader.load( 'FRO.obj', function ( object ) {
            object.scale.set(4,4,4)
            object.position.y = - 40;
            scene.add( object );

        });

} );

function move(type,speed) {
    if(type == "move") {
        if(kd.Q.isDown()) speed *= 1.7
        player.getWorldDirection(dir)
        player.position.addScaledVector(dir,speed)
        if(!collisionCheck()) {
            player.position.addScaledVector(dir,-speed)
        }
    } else if (type == "rotate") {
        player.rotation.y += speed/50
    } else { console.error("ERROR unknown move type " + type) }
}

kd.W.down(function(){move("move",-spd)})
kd.A.down(function(){move("rotate",spd)})
kd.S.down(function(){move("move",spd)})
kd.D.down(function(){move("rotate",-spd)})
kd.E.down(function(){lookUpToggler = true})
kd.E.up(function(){lookUpToggler = false})

var bgm = new Audio('./assets/sfx/museum.mp3'); 
bgm.addEventListener('ended', function() { // Thanks @kingjeffrey on stackoverflow for FF loop support!
    this.currentTime = 0;
    this.play();
}, false);
bgm.play();

kd.run(function(){kd.tick()})
render()
