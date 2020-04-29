//game.tilesdef painstakingly annotated by luphoria#7667 :)
game.tilesdef = { 
"0": { "key": 0, "name": "Fond", "pics": [0], "eatable": true, "miam": "walk2", "glueprog": true }, //Nothing. Setting eatable to false will make this game broken asf
"1": { "key": 1, "name": "Vide temporaire", "pics": [53], "eatable": true }, //Placeholder block. Has the texture of gold-in-dirt.
"2": { "key": 2, "name": "Mur indestructible", "indestructible": true, "unstable": true, "pics": [1] }, //Indestructible item. Also the walls on unmodded levels
"3": { "key": 3, "name": "Terre", "pics": [2], "eatable": true, "miam": "walk", "glueprog": true }, //Dirt 
"4": { "key": 4, "name": "P\u00e9pite sous terre", "pics": [3], "eatable": true, "miam": "walk", "glueprog": true }, //DOES NOT WORK. Reason for being here is unknown.
"5": { "key": 5, "name": "Mur destructible", "unstable": true, "pics": [4] }, //The breakable version of 2
"6": { "key": 6, "name": "Mur blan avec herbe", "unstable": true, "pics": [5] }, //Mossy white bricks
"7": { "key": 7, "name": "Mur blan sans herbe", "unstable": true, "pics": [6] }, //White bricks
"8": { "key": 8, "name": "Crystal sphere", "pics": [191], "cycle": true, "algo": "crystal", "unstable": true, "pushable": 1, "clonable": 1, "anim": { "pics": [188, 189, 190, 191, 192, 193], "nbpic": 6, "modulo": 8 }, "choc": "diams" }, //The spinny crystal, kills npcs
"9": { "key": 9, "name": "Caillou", "pics": [16], "unstable_pics": [16, 17, 16, 18], "algo": "chutte", "unstable": true, "heavy": true, "pushable": 1, "clonable": 1, "choc": "rock" }, //Rocks
"10": { "key": 10, "name": "Mur transformeur inactif", "pics": [63] }, //"Wall with transformer inactive" - Invisible block
"11": { "key": 11, "name": "Mur transformeur actif", "pics": [19, 20], "cycle": true }, //"Wall with transformer active" - Weird animation between pics 19/20 or Bricks/Mossy Bricks.
"12": { "key": 12, "name": "Grosse Bombe inactive", "pics": [32], "algo": "chutte", "heavy": true, "pushable": 1, "unstable": true, "clonable": 1, "stoptrans": "largebombe", "crushtrans": "largebombe", "onexp": 35, "onheat": 35 }, //Larger bomb
"13": { "key": 13, "name": "D\u00e9tonateur inactif", "pics": [22], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "choc": "rock", "crushtrans": "detonateur", "stoptrans": "detonateur" }, //Dynamite switch non-activated
"14": { "key": 14, "name": "D\u00e9tonateur actif", "pics": [23], "algo": "activedetonateur", "unstable": true, "pushable": 1, "clonable": 1, "choc": "rock" }, //Dynamite switch activated
"15": { "key": 15, "name": "Explo Jaune", "algo": "explo", "anim": { "pics": [144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155], "nbpic": 12, "modulo": 2 }, "pics": [32, 33, 34, 35] }, //Yellow explosion
"16": { "key": 16, "name": "Explo Grise", "algo": "explo", "anim": { "pics": [160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171], "nbpic": 12, "modulo": 2 }, "pics": [36, 37, 38, 39] }, //Gray explosion
"17": { "key": 17, "name": "Oeuf Bleu", "pics": [158], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "crushtrans": "oeuf1bleu", "stoptrans": "oeuf1bleu" }, //Butterfly egg
"18": { "key": 18, "name": "Oeuf Bleu Bris\u00e9", "pics": [174], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "crushtrans": "oeuf2bleu", "stoptrans": "oeuf2bleu" }, //Butterfly egg (cracked)
"19": { "key": 19, "name": "Dynamite inactive", "pics": [42], "algo": "chutte", "unstable": true, "miam": "miam", "item": "dyna", "eatable": true, "pushable": 1, "clonable": 1, "choc": "rock" }, //Dynamite non-activated
"20": { "key": 20, "name": "Dynamite active", "pics": [43], "algo": "activedyna", "unstable": true, "pushable": 1, "clonable": 1, "choc": "rock" }, //Dynamite activated
"21": { "key": 21, "name": "Bombe inactive", "pics": [34], "algo": "chutte", "unstable": true, "heavy": true, "pushable": 1, "clonable": 1, "stoptrans": "bombe", "crushtrans": "bombe", "onexp": 33, "onheat": 33 }, //Non-activated bomb
"22": { "key": 22, "name": "Bombe p\u00e9n\u00e9trante", "pics": [38], "algo": "penebombe", "crushfunc": "cf_penebombe", "onexp": 35, "unstable": true, "heavy": true, "clonable": 1, "pushable": 1 }, //Penetration bomb
"23": { "key": 23, "name": "Grenade inactive", "pics": [36], "algo": "chutte", "unstable": true, "pushable": 1, "onexp": 24, "onheat": 24, "clonable": 1, "stoptrans": "grenade", "crushtrans": "grenade", "eatable": true, "item": "gren", "miam": "miam" }, //Inactive grenade
"24": { "key": 24, "name": "Grenade active", "indestructible": true, "clonable": 1, "pics": [37], "algo": "activegren", "unstable": true, "pushable": 1, "choc": "grenade" }, //Active grenade
"25": { "key": 25, "name": "P\u00e9pite Ferm\u00e9e", "pics": [48], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "stoptrans": "pepite1", "crushtrans": "pepite1" }, //Rock-covered gold
"26": { "key": 26, "name": "P\u00e9pite partiellement ouverte", "pics": [49], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "stoptrans": "pepite2", "crushtrans": "pepite2" }, //Rock-covered gold 2
"27": { "key": 27, "name": "Boule de m\u00e9tal", "onexp": 28, "pics": [134], "algo": "chutte", "unstable": true, "heavy": true, "pushable": 2, "clonable": 1, "choc": "rock" }, //Metal rock
"28": { "key": 28, "name": "Boule de m\u00e9tal chaude", "onexp": 28, "pics": [135, 136, 137], "cycle": true, "algo": "boulechaude", "unstable": true, "heavy": true, "pushable": 2, "clonable": 1, "anim": { "pics": [135, 136, 137], "nbpic": 3, "modulo": 6 }, "choc": "rock" }, //Activated metal rock (one of the few modded items that can be modded in a REAL level via POST)
"29": { "key": 29, "name": "Cloneur source", "indestructible": true, "pics": [56, 57], "algo": "clonersource", "unstable": true }, //Clone source
"30": { "key": 30, "name": "Cloneur producteur", "indestructible": true, "pics": [58, 59], "algo": "clonertarget", "unstable": true }, //Cloner
"31": { "key": 31, "name": "Lave", "pics": [124], "algo": "lave", "anim": { "pics": [124, 125, 126, 127], "nbpic": 4, "modulo": 18 }, "indestructible": true }, //Lava
"32": { "key": 32, "name": "Sablier", "pics": [7, 24, 25], "cycle": true, "eatable": true, "algo": "chutte", "unstable": true, "clonable": 1, "anim": { "pics": [7, 24, 25], "nbpic": 3, "modulo": 12 }, "miam": "miam", "time": 100, "choc": "crush", "crushtrans": "disapear", "stoptrans": "disapear" }, //Hourglass (resets time)
"33": { "key": 33, "name": "Bombe active", "algo": "autoexp", "indestructible": true, "pics": [35] }, //Active bomb
"34": { "key": 34, "name": "Percuteur", "algo": "chutte", "pushable": 1, "pics": [39] }, //A part of the penetration bomb. Does not break and is affected by gravity.
"35": { "key": 35, "name": "Grosse Bombe Active", "algo": "autoexplarge", "indestructible": true, "pics": [33] }, //Active large bomb.
"36": { "key": 36, "name": "Mur de brique", "unstable": true, "onexp": 37, "pics": [19] }, //Bricks
"37": { "key": 37, "name": "Mur de brique fissur\u00e9", "pics": [20] }, //Bricks with moss
"38": { "key": 38, "name": "Boule de verre", "pushable": 1, "pics": [140], "algo": "chutte", "unstable": true, "choc": "crush", "crushtrans": "disapear", "stoptrans": "disapear" }, //"Glass ball" - Does not work
"39": { "key": 39, "name": "Oeuf Vert", "pics": [156], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "crushtrans": "oeuf1vert", "stoptrans": "oeuf1vert" }, //Scarabe egg
"40": { "key": 40, "name": "Oeuf Vert Bris\u00e9", "pics": [172], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "crushtrans": "oeuf2vert", "stoptrans": "oeuf2vert" }, //Scarabe egg 2
"41": { "key": 41, "name": "Oeuf Rouge", "pics": [157], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "crushtrans": "oeuf1rouge", "stoptrans": "oeuf1rouge" }, //Limace egg
"42": { "key": 42, "name": "Oeuf Rouge Bris\u00e9", "pics": [173], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "crushtrans": "oeuf2rouge", "stoptrans": "oeuf2rouge" }, //Limace egg 2
"43": { "key": 43, "name": "Oeuf Jaune", "pics": [159], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "crushtrans": "oeuf1jaune", "stoptrans": "oeuf1jaune" }, //Bee egg
"44": { "key": 44, "name": "Oeuf Jaune Bris\u00e9", "pics": [175], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "crushtrans": "oeuf2jaune", "stoptrans": "oeuf2jaune" }, //Bee egg 2 
"45": { "key": 45, "name": "Caillou de sable", "pics": [60], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "crushtrans": "sandrock", "stoptrans": "sandrock" }, //"Sand rock" - A rock that has 3 stages of breaking when falling. Went unused.
"46": { "key": 46, "name": "Caillou de sable faiblement bris\u00e9", "pics": [61], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "crushtrans": "sandrock2", "stoptrans": "sandrock2" }, //"Sand rock 2" - Stage 2 of sand rock
"47": { "key": 47, "name": "Caillou de sable fortement bris\u00e9", "pics": [62], "algo": "chutte", "unstable": true, "pushable": 1, "clonable": 1, "crushtrans": "sandrock3", "stoptrans": "sandrock3" }, //"Sand rock 3" - Stage 3 of sand rock
// 48/49 missing?
"50": { "key": 50, "name": "Diamant Vert", "pics": [176], "eatable": true, "algo": "chutte", "unstable": true, "clonable": 1, "anim": { "pics": [176, 177, 178, 179, 180, 181], "nbpic": 6, "modulo": 8 }, "miam": "miam", "score": 3, "choc": "diams" }, //Green diamond
"51": { "key": 51, "name": "Diamant Bleu", "pics": [184], "eatable": true, "algo": "chutte", "unstable": true, "clonable": 1, "anim": { "pics": [182, 183, 184, 185, 186, 187], "nbpic": 6, "modulo": 8 }, "miam": "miam", "score": 2, "choc": "diams" }, //Blue diamond
"52": { "key": 52, "name": "P\u00e9pite", "pics": [100], "cycle": true, "eatable": true, "algo": "chutte", "unstable": true, "clonable": 1, "anim": { "pics": [100, 101, 102, 101], "nbpic": 4, "modulo": 6 }, "miam": "miam", "score": 4, "choc": "diams" }, //Gold
"53": { "key": 53, "name": "P\u00e9pites terreuses", "pics": [53], "score": 4, "eatable": true, "miam": "miam" }, //Gold in dirt
"54": { "key": 54, "name": "Tomate", "pics": [21], "eatable": true, "algo": "chutte", "unstable": true, "crushtrans": "disapear", "clonable": 1, "miam": "slurp", "score": 1, "choc": "rock" }, //Tomato (HAS THE SLURP SOUND)
"55": { "key": 55, "name": "Diamants bleus terreux", "pics": [52], "score": 2, "eatable": true, "miam": "miam" }, //Blue diamond in dirt
"56": { "key": 56, "name": "Diamants verts terreux", "pics": [50], "score": 3, "eatable": true, "miam": "miam" }, //Green diamond in dirt
"57": { "key": 57, "name": "Tomates terreuses", "pics": [51], "score": 1, "eatable": true, "miam": "slurp" }, //Tomato in dirt (HAS THE SLURP SOUND)
//58 and 59 missing???
"60": { "key": 60, "name": "Cl\u00e9 verte", "pics": [96], "eatable": true, "algo": "chutte", "unstable": true, "miam": "miam", "choc": "diams", "item": "key-g" }, //Green key
"61": { "key": 61, "name": "Cl\u00e9 rouge", "pics": [97], "eatable": true, "algo": "chutte", "unstable": true, "miam": "miam", "choc": "diams", "item": "key-r" }, //Red key
"62": { "key": 62, "name": "Cl\u00e9 bleue", "pics": [98], "eatable": true, "algo": "chutte", "unstable": true, "miam": "miam", "choc": "diams", "item": "key-b" }, //Blue key
"63": { "key": 63, "name": "Cl\u00e9 jaune", "pics": [99], "eatable": true, "algo": "chutte", "unstable": true, "miam": "miam", "choc": "diams", "item": "key-y" }, //Yellow key
"64": { "key": 64, "name": "Porte verte", "door": "key-g", "indestructible": true, "pics": [8] }, //Green door
"65": { "key": 65, "name": "Porte rouge", "door": "key-r", "indestructible": true, "pics": [9] }, //Red door
"66": { "key": 66, "name": "Porte bleue", "door": "key-b", "indestructible": true, "pics": [10] }, //Blue door
"67": { "key": 67, "name": "Porte jaune", "door": "key-y", "indestructible": true, "pics": [11] }, //Yellow door
//68 and 69 missing.. especially sad about 69
"70": { "key": 70, "name": "Glue verte", "anim": { "pics": [12, 12, 12, 28, 44, 44, 44, 28], "nbpic": 8, "modulo": 8 }, "pics": [12], "algo": "glue_verte", "cycle": true }, //Green "glue"
"71": { "key": 71, "name": "Glue rouge", "anim": { "pics": [13, 13, 13, 29, 45, 45, 45, 29], "nbpic": 8, "modulo": 8 }, "pics": [13], "algo": "glue_rouge", "cycle": true }, //Red "glue"
"72": { "key": 72, "name": "Glue bleue", "anim": { "pics": [14, 14, 14, 30, 46, 46, 46, 30], "nbpic": 8, "modulo": 8 }, "pics": [14], "algo": "glue_bleue", "cycle": true }, //Blue "glue"
"73": { "key": 73, "name": "Glue jaune", "anim": { "pics": [15, 15, 15, 31, 47, 47, 47, 31], "nbpic": 8, "modulo": 8 }, "pics": [15], "algo": "glue_jaune", "cycle": true }, //Yellow "glue"
"74": { "key": 74, "name": "Fiolle verte", "pics": [104], "algo": "chutte", "unstable": true, "pushable": 1, "stopfunc": "fiollechoc", "crushfunc": "fiollechoc" }, //Green flask
"75": { "key": 75, "name": "Fiolle rouge", "pics": [105], "algo": "chutte", "unstable": true, "pushable": 1, "stopfunc": "fiollechoc", "crushfunc": "fiollechoc" }, //Red flask
"76": { "key": 76, "name": "Fiolle bleue", "pics": [106], "algo": "chutte", "unstable": true, "pushable": 1, "stopfunc": "fiollechoc", "crushfunc": "fiollechoc" }, //Blue flask
"77": { "key": 77, "name": "Fiolle jaune", "pics": [107], "algo": "chutte", "unstable": true, "pushable": 1, "stopfunc": "fiollechoc", "crushfunc": "fiollechoc" }, //Yellow flask
//many missing...
"100": { "key": 100, "name": "Rockbasher", "onexp": 16, "crushtrans": "disapear", "onheat": 16, "pics": [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95] }, //The rockbasher (Only 1 can be controlled)
"101": { "key": 101, "name": "Exit inactive", "indestructible": true, "unstable": true, "pics": [108], "algo": "exit" }, //Inactive exit
"102": { "key": 102, "name": "Exit active", "indestructible": true, "unstable": true, "anim": { "pics": [109, 110, 111], "nbpic": 3, "modulo": 6 }, "pics": [109, 110, 111], "cycle": true }, //Active exit
"103": { "key": 103, "name": "Exit leaving", "indestructible": true, "unstable": true, "pics": [128, 129, 130, 131, 132, 133], "algo": "exitleaving" }, //Exit leaving animation block (Will not end level immediately)
"128": { "key": 128, "name": "Scarab\u00e9", "pics": [64], "algo": "scarabe", "crushtrans": "scarabe", "crystaltrans": "scarabe", "heattrans": "scarabe", "clonable": 1 }, //This and the next three are the scarabe bug
"129": { "key": 129, "name": "Scarab\u00e9", "pics": [68], "algo": "scarabe", "crushtrans": "scarabe", "crystaltrans": "scarabe", "heattrans": "scarabe", "clonable": 1 }, 
"130": { "key": 130, "name": "Scarab\u00e9", "pics": [72], "algo": "scarabe", "crushtrans": "scarabe", "crystaltrans": "scarabe", "heattrans": "scarabe", "clonable": 1 }, 
"131": { "key": 131, "name": "Scarab\u00e9", "pics": [76], "algo": "scarabe", "crushtrans": "scarabe", "crystaltrans": "scarabe", "heattrans": "scarabe", "clonable": 1 }, 
"132": { "key": 132, "name": "Limace", "pics": [65], "algo": "limace", "crushtrans": "limace", "crystaltrans": "limace", "heattrans": "limace", "clonable": 1 }, //This and the next three are the limace bug
"133": { "key": 133, "name": "Limace", "pics": [69], "algo": "limace", "crushtrans": "limace", "crystaltrans": "limace", "heattrans": "limace", "clonable": 1 }, 
"134": { "key": 134, "name": "Limace", "pics": [73], "algo": "limace", "crushtrans": "limace", "crystaltrans": "limace", "heattrans": "limace", "clonable": 1 }, 
"135": { "key": 135, "name": "Limace", "pics": [77], "algo": "limace", "crushtrans": "limace", "crystaltrans": "limace", "heattrans": "limace", "clonable": 1 }, 
"136": { "key": 136, "name": "Papillon", "pics": [66], "algo": "papillon", "crushtrans": "papillon", "crystaltrans": "papillon", "heattrans": "papillon", "clonable": 1 }, //This and the next three are the butterfly bug
"137": { "key": 137, "name": "Papillon", "pics": [70], "algo": "papillon", "crushtrans": "papillon", "crystaltrans": "papillon", "heattrans": "papillon", "clonable": 1 }, 
"138": { "key": 138, "name": "Papillon", "pics": [74], "algo": "papillon", "crushtrans": "papillon", "crystaltrans": "papillon", "heattrans": "papillon", "clonable": 1 },
"139": { "key": 139, "name": "Papillon", "pics": [78], "algo": "papillon", "crushtrans": "papillon", "crystaltrans": "papillon", "heattrans": "papillon", "clonable": 1 }, 
"140": { "key": 140, "name": "Gu\u00eape", "pics": [67], "algo": "guepe", "crushtrans": "guepe", "crystaltrans": "guepe", "heattrans": "guepe", "clonable": 1 }, //This and the next three are the bee/mosquito bug
"141": { "key": 141, "name": "Gu\u00eape", "pics": [71], "algo": "guepe", "crushtrans": "guepe", "crystaltrans": "guepe", "heattrans": "guepe", "clonable": 1 }, 
"142": { "key": 142, "name": "Gu\u00eape", "pics": [75], "algo": "guepe", "crushtrans": "guepe", "crystaltrans": "guepe", "heattrans": "guepe", "clonable": 1 }, 
"143": { "key": 143, "name": "Gu\u00eape", "pics": [79], "algo": "guepe", "crushtrans": "guepe", "crystaltrans": "guepe", "heattrans": "guepe", "clonable": 1 } };
/*

~~~ITEMS THAT REQUIRE MODDING IN~~~

1 - "Temporary vacuum"
4 - "Gold in dirt"
10 - "Wall with transformer inactive"
11 - "Wall with transformer active"
15 - "Yellow explosion"
16 - "Gray explosion"
28 - "Activated metal rock"
34 - "Striker"
38 - "Glass ball"
45 - "Sand rock"
46 - "Sand rock 2"
47 - "Sand rock 3"
100 - "Rockbasher"
103 - "Exit leaving"




HOW TO ADD MOD:
Currently to add it you need to paste the modded attributes into the console.

DOCS OF ATTRIBUTES:
"eatable": whether you can simply go through the tile. DEFAULTS TO false
"name": the name of the tile. DEFAULTS TO ""
"pics": picture[s] to be displayed. DEFAULTS TO ""
"miam": the noise made when run through. DEFAULTS TO ""
"glueprog":whether glue breaks through/destroys it. DEFAULTS TO false
"indestructible": whether the item is destructible. DEFAULTS TO false
"pushable": whether the item is pushable. DEFAULTS TO false
"algo": Type of item (chutte means it falls as a rock for example.)
"clonable": whether it can be cloned. DEFAULTS TO false
"heavy": whether it takes a longer amount of ms to push. DEFAULTS TO false
"score": amount of points you gain from running through item. DEFAULTS TO null
"anim": Animation of photos that display. Syntax: "anim": {"pics": [x,y,z], "nbpic": (number of pics), "modulo": (speed, the lower the number the faster)}

There are more, but not documented.
*/