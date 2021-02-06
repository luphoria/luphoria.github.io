function BoxGeometry(x,y,z) { 
    return [-(x/2),-(y/2),-(z/2),(x/2),(y/2),(z/2)]
}
function modPos(input,dir,amount) { 
    console.log(input)
    output = input
    switch(dir) {
        case "x":
            output[0] += amount
            output[3] += amount
            break
        case "y":
            output[1] += amount
            output[4] += amount
            break
        case "z":
            output[2] += amount
            output[5] += amount
            break
    }
    console.log(output)
    return output
}
function getPos(input,dir) {
    console.log("getPos(" + input + ",\"" + dir + "\")")
    console.log(input)
    switch(dir) {
        case "x":
            output = (Math.abs(input[0]) + Math.abs(input[3])) / 2
            output = (output - input[3]) * 2
            break
        case "y":
            output = (Math.abs(input[1]) + Math.abs(input[4])) / 2
            output = (output - input[4]) * 2
            break
        case "z":
            output = (Math.abs(input[2]) + Math.abs(input[5])) / 2
            output = (output - input[5]) * 2
            break
    }
    console.log(output)
    return output
}
/* DEFINE YOUR COLLISION CUBES HERE */

let colCube1 = BoxGeometry(100,100,60)
colCube1 = modPos(colCube1,"z",65)

let colCube2 = BoxGeometry(50,100,33)
colCube2 = modPos(colCube2,"x",35)
colCube2 = modPos(colCube2,"z",20)

let colCube3 = BoxGeometry(50,100,33)
colCube3 = modPos(colCube3,"x",-35)
colCube3 = modPos(colCube3,"z",20)
/* DO NOT DEFINE COLLISION CUBES BEYOND THIS POINT */

let cubes = [colCube1,colCube2,colCube3] // Array with all of the cubes
console.log(cubes)
let col = false // Modifies collision to be LESS accurate so that it is more like the game.


function getCoords(box,collision) { // Spent way too long trying to make a giant detection for negative/positive, realised i could add a modifier to a "master" return anyways. Think fucking smarter, not harder.
    collisionModifier = 0 // defines collisionModifier to not return undefined on collision == false
    if(collision == true) collisionModifier = -3

    console.log("box " + box)

    console.log("x1 -- " + (getPos(box,"x") - (Math.abs(box[0]) + Math.abs(box[3])) - collisionModifier)) // should be -12

    return [
        box[0] - collisionModifier, // x1
        box[1],                     // y1
        box[2] - collisionModifier, // z1

        box[3] + collisionModifier, // x2
        box[4],                     // y2
        box[5] + collisionModifier  // z2
    ]
}

let inc = 0
let toReturn = "let col = [" // defining string it will return

while(cubes.length - 1 >= inc) {
    toReturn = toReturn + "[" + getCoords(cubes[inc],col) + "]"
    if(cubes.length - 1 > inc) toReturn += ","
    inc++
}

toReturn = toReturn + "]"

console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n========================================\n" + toReturn + "\n========================================\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
