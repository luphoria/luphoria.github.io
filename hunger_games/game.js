//game.js for the Hunger Games simulator.
//by luphoria: luphoria#7667 - luphoria.github.io

console.log("game.js loaded!");
console.log("Notice: every single event that occurs including randomizers are all logged here.\nIf you want the logs, they will also be viewable at the end.");

function init(players, useDistricts){ 
    console.log("Initializing game");
    console.log("useDistricts = " + useDistricts);
    if(useDistricts = true) {
        var districtsAmount = Math.ceil(players.length / 2);
    }
    else {
        var districtsAmount = false;
    }
    console.log("District count: " + districtsAmount);
}

//TODO DELETE v
var playerArrayDebug = [
    "DebugPlayer1||basehp||",
    "DebugPlayer2||~2hp||",
    "OPHPplayer3||100hp||",
    "DebugPlayer4||~-3hp||",
]
init(playerArrayDebug, true);
//TODO DELETE ^