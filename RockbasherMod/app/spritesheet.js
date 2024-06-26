/*
ANNOTATION app-main.js by luphoria: luphoria.github.io
I will make an unmodified version with as close to full annotations soon! ^^
 -- If you want to know the amount of work i put into this, basically this had no annotations before and also was not formatted for easy viewing. --
*/
game.tilesdef = {
    "0": {
        "key": 0,
        "name": "Fond",
        "pics": [0],
        "eatable": true,
        "miam": "walk2",
        "glueprog": true
    }, //Nothing. Setting eatable to false will make this game broken asf
    "1": {
        "key": 1,
        "name": "Vide temporaire",
        "pics": [53],
        "eatable": true
    }, //Placeholder block. Has the texture of gold-in-dirt.
    "2": {
        "key": 2,
        "name": "Mur indestructible",
        "indestructible": true,
        "unstable": true,
        "pics": [1]
    }, //Indestructible item. Also the walls on unmodded levels
    "3": {
        "key": 3,
        "name": "Terre",
        "pics": [2],
        "eatable": true,
        "miam": "walk",
        "glueprog": true
    }, //Dirt 
    "4": {
        "key": 4,
        "name": "P\u00e9pite sous terre",
        "pics": [3],
        "eatable": true,
        "miam": "walk",
        "glueprog": true
    }, //DOES NOT WORK. Reason for being here is unknown.
    "5": {
        "key": 5,
        "name": "Mur destructible",
        "unstable": true,
        "pics": [4]
    }, //The breakable version of 2
    "6": {
        "key": 6,
        "name": "Mur blan avec herbe",
        "unstable": true,
        "pics": [5]
    }, //Mossy white bricks
    "7": {
        "key": 7,
        "name": "Mur blan sans herbe",
        "unstable": true,
        "pics": [6]
    }, //White bricks
    "8": {
        "key": 8,
        "name": "Crystal sphere",
        "pics": [191],
        "cycle": true,
        "algo": "crystal",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "anim": {
            "pics": [188, 189, 190, 191, 192, 193],
            "nbpic": 6,
            "modulo": 8
        },
        "choc": "diams"
    }, //The spinny crystal, kills npcs
    "9": {
        "key": 9,
        "name": "Caillou",
        "pics": [16],
        "unstable_pics": [16, 17, 16, 18],
        "algo": "chutte",
        "unstable": true,
        "heavy": true,
        "pushable": 1,
        "clonable": 1,
        "choc": "rock"
    }, //Rocks
    "10": {
        "key": 10,
        "name": "Mur transformeur inactif",
        "pics": [63]
    }, //"Wall with transformer inactive" - Invisible block
    "11": {
        "key": 11,
        "name": "Mur transformeur actif",
        "pics": [19, 20],
        "cycle": true
    }, //"Wall with transformer active" - Weird animation between pics 19/20 or Bricks/Mossy Bricks.
    "12": {
        "key": 12,
        "name": "Grosse Bombe inactive",
        "pics": [32],
        "algo": "chutte",
        "heavy": true,
        "pushable": 1,
        "unstable": true,
        "clonable": 1,
        "stoptrans": "largebombe",
        "crushtrans": "largebombe",
        "onexp": 35,
        "onheat": 35
    }, //Larger bomb
    "13": {
        "key": 13,
        "name": "D\u00e9tonateur inactif",
        "pics": [22],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "choc": "rock",
        "crushtrans": "detonateur",
        "stoptrans": "detonateur"
    }, //Dynamite switch non-activated
    "14": {
        "key": 14,
        "name": "D\u00e9tonateur actif",
        "pics": [23],
        "algo": "activedetonateur",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "choc": "rock"
    }, //Dynamite switch activated
    "15": {
        "key": 15,
        "name": "Explo Jaune",
        "algo": "explo",
        "anim": {
            "pics": [144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155],
            "nbpic": 12,
            "modulo": 2
        },
        "pics": [32, 33, 34, 35]
    }, //Yellow explosion
    "16": {
        "key": 16,
        "name": "Explo Grise",
        "algo": "explo",
        "anim": {
            "pics": [160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171],
            "nbpic": 12,
            "modulo": 2
        },
        "pics": [36, 37, 38, 39]
    }, //Gray explosion
    "17": {
        "key": 17,
        "name": "Oeuf Bleu",
        "pics": [158],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "crushtrans": "oeuf1bleu",
        "stoptrans": "oeuf1bleu"
    }, //Butterfly egg
    "18": {
        "key": 18,
        "name": "Oeuf Bleu Bris\u00e9",
        "pics": [174],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "crushtrans": "oeuf2bleu",
        "stoptrans": "oeuf2bleu"
    }, //Butterfly egg (cracked)
    "19": {
        "key": 19,
        "name": "Dynamite inactive",
        "pics": [42],
        "algo": "chutte",
        "unstable": true,
        "miam": "miam",
        "item": "dyna",
        "eatable": true,
        "pushable": 1,
        "clonable": 1,
        "choc": "rock"
    }, //Dynamite non-activated
    "20": {
        "key": 20,
        "name": "Dynamite active",
        "pics": [43],
        "algo": "activedyna",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "choc": "rock"
    }, //Dynamite activated
    "21": {
        "key": 21,
        "name": "Bombe inactive",
        "pics": [34],
        "algo": "chutte",
        "unstable": true,
        "heavy": true,
        "pushable": 1,
        "clonable": 1,
        "stoptrans": "bombe",
        "crushtrans": "bombe",
        "onexp": 33,
        "onheat": 33
    }, //Non-activated bomb
    "22": {
        "key": 22,
        "name": "Bombe p\u00e9n\u00e9trante",
        "pics": [38],
        "algo": "penebombe",
        "crushfunc": "cf_penebombe",
        "onexp": 35,
        "unstable": true,
        "heavy": true,
        "clonable": 1,
        "pushable": 1
    }, //Penetration bomb
    "23": {
        "key": 23,
        "name": "Grenade inactive",
        "pics": [36],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "onexp": 24,
        "onheat": 24,
        "clonable": 1,
        "stoptrans": "grenade",
        "crushtrans": "grenade",
        "eatable": true,
        "item": "gren",
        "miam": "miam"
    }, //Inactive grenade
    "24": {
        "key": 24,
        "name": "Grenade active",
        "indestructible": true,
        "clonable": 1,
        "pics": [37],
        "algo": "activegren",
        "unstable": true,
        "pushable": 1,
        "choc": "grenade"
    }, //Active grenade
    "25": {
        "key": 25,
        "name": "P\u00e9pite Ferm\u00e9e",
        "pics": [48],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "stoptrans": "pepite1",
        "crushtrans": "pepite1"
    }, //Rock-covered gold
    "26": {
        "key": 26,
        "name": "P\u00e9pite partiellement ouverte",
        "pics": [49],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "stoptrans": "pepite2",
        "crushtrans": "pepite2"
    }, //Rock-covered gold 2
    "27": {
        "key": 27,
        "name": "Boule de m\u00e9tal",
        "onexp": 28,
        "pics": [134],
        "algo": "chutte",
        "unstable": true,
        "heavy": true,
        "pushable": 2,
        "clonable": 1,
        "choc": "rock"
    }, //Metal rock
    "28": {
        "key": 28,
        "name": "Boule de m\u00e9tal chaude",
        "onexp": 28,
        "pics": [135, 136, 137],
        "cycle": true,
        "algo": "boulechaude",
        "unstable": true,
        "heavy": true,
        "pushable": 2,
        "clonable": 1,
        "anim": {
            "pics": [135, 136, 137],
            "nbpic": 3,
            "modulo": 6
        },
        "choc": "rock"
    }, //Activated metal rock (one of the few modded items that can be modded in a REAL level via POST)
    "29": {
        "key": 29,
        "name": "Cloneur source",
        "indestructible": true,
        "pics": [56, 57],
        "algo": "clonersource",
        "unstable": true
    }, //Clone source
    "30": {
        "key": 30,
        "name": "Cloneur producteur",
        "indestructible": true,
        "pics": [58, 59],
        "algo": "clonertarget",
        "unstable": true
    }, //Cloner
    "31": {
        "key": 31,
        "name": "Lave",
        "pics": [124],
        "algo": "lave",
        "anim": {
            "pics": [124, 125, 126, 127],
            "nbpic": 4,
            "modulo": 18
        },
        "indestructible": true
    }, //Lava
    "32": {
        "key": 32,
        "name": "Sablier",
        "pics": [7, 24, 25],
        "cycle": true,
        "eatable": true,
        "algo": "chutte",
        "unstable": true,
        "clonable": 1,
        "anim": {
            "pics": [7, 24, 25],
            "nbpic": 3,
            "modulo": 12
        },
        "miam": "miam",
        "time": 100,
        "choc": "crush",
        "crushtrans": "disapear",
        "stoptrans": "disapear"
    }, //Hourglass (resets time)
    "33": {
        "key": 33,
        "name": "Bombe active",
        "algo": "autoexp",
        "indestructible": true,
        "pics": [35]
    }, //Active bomb
    "34": {
        "key": 34,
        "name": "Percuteur",
        "algo": "chutte",
        "pushable": 1,
        "pics": [39]
    }, //A part of the penetration bomb. Does not break and is affected by gravity.
    "35": {
        "key": 35,
        "name": "Grosse Bombe Active",
        "algo": "autoexplarge",
        "indestructible": true,
        "pics": [33]
    }, //Active large bomb.
    "36": {
        "key": 36,
        "name": "Mur de brique",
        "unstable": true,
        "onexp": 37,
        "pics": [19]
    }, //Bricks
    "37": {
        "key": 37,
        "name": "Mur de brique fissur\u00e9",
        "pics": [20]
    }, //Bricks with moss
    "38": {
        "key": 38,
        "name": "Boule de verre",
        "pushable": 1,
        "pics": [140],
        "algo": "chutte",
        "unstable": true,
        "choc": "crush",
        "crushtrans": "disapear",
        "stoptrans": "disapear"
    }, //"Glass ball" - Does not work
    "39": {
        "key": 39,
        "name": "Oeuf Vert",
        "pics": [156],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "crushtrans": "oeuf1vert",
        "stoptrans": "oeuf1vert"
    }, //Scarabe egg
    "40": {
        "key": 40,
        "name": "Oeuf Vert Bris\u00e9",
        "pics": [172],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "crushtrans": "oeuf2vert",
        "stoptrans": "oeuf2vert"
    }, //Scarabe egg 2
    "41": {
        "key": 41,
        "name": "Oeuf Rouge",
        "pics": [157],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "crushtrans": "oeuf1rouge",
        "stoptrans": "oeuf1rouge"
    }, //Limace egg
    "42": {
        "key": 42,
        "name": "Oeuf Rouge Bris\u00e9",
        "pics": [173],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "crushtrans": "oeuf2rouge",
        "stoptrans": "oeuf2rouge"
    }, //Limace egg 2
    "43": {
        "key": 43,
        "name": "Oeuf Jaune",
        "pics": [159],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "crushtrans": "oeuf1jaune",
        "stoptrans": "oeuf1jaune"
    }, //Bee egg
    "44": {
        "key": 44,
        "name": "Oeuf Jaune Bris\u00e9",
        "pics": [175],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "crushtrans": "oeuf2jaune",
        "stoptrans": "oeuf2jaune"
    }, //Bee egg 2 
    "45": {
        "key": 45,
        "name": "Caillou de sable",
        "pics": [60],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "crushtrans": "sandrock",
        "stoptrans": "sandrock"
    }, //"Sand rock" - A rock that has 3 stages of breaking when falling. Went unused.
    "46": {
        "key": 46,
        "name": "Caillou de sable faiblement bris\u00e9",
        "pics": [61],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "crushtrans": "sandrock2",
        "stoptrans": "sandrock2"
    }, //"Sand rock 2" - Stage 2 of sand rock
    "47": {
        "key": 47,
        "name": "Caillou de sable fortement bris\u00e9",
        "pics": [62],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "clonable": 1,
        "crushtrans": "sandrock3",
        "stoptrans": "sandrock3"
    }, //"Sand rock 3" - Stage 3 of sand rock
    // 48/49 missing?
    "50": {
        "key": 50,
        "name": "Diamant Vert",
        "pics": [176],
        "eatable": true,
        "algo": "chutte",
        "unstable": true,
        "clonable": 1,
        "anim": {
            "pics": [176, 177, 178, 179, 180, 181],
            "nbpic": 6,
            "modulo": 8
        },
        "miam": "miam",
        "score": 3,
        "choc": "diams"
    }, //Green diamond
    "51": {
        "key": 51,
        "name": "Diamant Bleu",
        "pics": [184],
        "eatable": true,
        "algo": "chutte",
        "unstable": true,
        "clonable": 1,
        "anim": {
            "pics": [182, 183, 184, 185, 186, 187],
            "nbpic": 6,
            "modulo": 8
        },
        "miam": "miam",
        "score": 2,
        "choc": "diams"
    }, //Blue diamond
    "52": {
        "key": 52,
        "name": "P\u00e9pite",
        "pics": [100],
        "cycle": true,
        "eatable": true,
        "algo": "chutte",
        "unstable": true,
        "clonable": 1,
        "anim": {
            "pics": [100, 101, 102, 101],
            "nbpic": 4,
            "modulo": 6
        },
        "miam": "miam",
        "score": 4,
        "choc": "diams"
    }, //Gold
    "53": {
        "key": 53,
        "name": "P\u00e9pites terreuses",
        "pics": [53],
        "score": 4,
        "eatable": true,
        "miam": "miam"
    }, //Gold in dirt
    "54": {
        "key": 54,
        "name": "Tomate",
        "pics": [21],
        "eatable": true,
        "algo": "chutte",
        "unstable": true,
        "crushtrans": "disapear",
        "clonable": 1,
        "miam": "slurp",
        "score": 1,
        "choc": "rock"
    }, //Tomato (HAS THE SLURP SOUND)
    "55": {
        "key": 55,
        "name": "Diamants bleus terreux",
        "pics": [52],
        "score": 2,
        "eatable": true,
        "miam": "miam"
    }, //Blue diamond in dirt
    "56": {
        "key": 56,
        "name": "Diamants verts terreux",
        "pics": [50],
        "score": 3,
        "eatable": true,
        "miam": "miam"
    }, //Green diamond in dirt
    "57": {
        "key": 57,
        "name": "Tomates terreuses",
        "pics": [51],
        "score": 1,
        "eatable": true,
        "miam": "slurp"
    }, //Tomato in dirt (HAS THE SLURP SOUND)
    //58 and 59 missing???
    "60": {
        "key": 60,
        "name": "Cl\u00e9 verte",
        "pics": [96],
        "eatable": true,
        "algo": "chutte",
        "unstable": true,
        "miam": "miam",
        "choc": "diams",
        "item": "key-g"
    }, //Green key
    "61": {
        "key": 61,
        "name": "Cl\u00e9 rouge",
        "pics": [97],
        "eatable": true,
        "algo": "chutte",
        "unstable": true,
        "miam": "miam",
        "choc": "diams",
        "item": "key-r"
    }, //Red key
    "62": {
        "key": 62,
        "name": "Cl\u00e9 bleue",
        "pics": [98],
        "eatable": true,
        "algo": "chutte",
        "unstable": true,
        "miam": "miam",
        "choc": "diams",
        "item": "key-b"
    }, //Blue key
    "63": {
        "key": 63,
        "name": "Cl\u00e9 jaune",
        "pics": [99],
        "eatable": true,
        "algo": "chutte",
        "unstable": true,
        "miam": "miam",
        "choc": "diams",
        "item": "key-y"
    }, //Yellow key
    "64": {
        "key": 64,
        "name": "Porte verte",
        "door": "key-g",
        "indestructible": true,
        "pics": [8]
    }, //Green door
    "65": {
        "key": 65,
        "name": "Porte rouge",
        "door": "key-r",
        "indestructible": true,
        "pics": [9]
    }, //Red door
    "66": {
        "key": 66,
        "name": "Porte bleue",
        "door": "key-b",
        "indestructible": true,
        "pics": [10]
    }, //Blue door
    "67": {
        "key": 67,
        "name": "Porte jaune",
        "door": "key-y",
        "indestructible": true,
        "pics": [11]
    }, //Yellow door
    //68 and 69 missing.. especially sad about 69
    "70": {
        "key": 70,
        "name": "Glue verte",
        "anim": {
            "pics": [12, 12, 12, 28, 44, 44, 44, 28],
            "nbpic": 8,
            "modulo": 8
        },
        "pics": [12],
        "algo": "glue_verte",
        "cycle": true
    }, //Green "glue"
    "71": {
        "key": 71,
        "name": "Glue rouge",
        "anim": {
            "pics": [13, 13, 13, 29, 45, 45, 45, 29],
            "nbpic": 8,
            "modulo": 8
        },
        "pics": [13],
        "algo": "glue_rouge",
        "cycle": true
    }, //Red "glue"
    "72": {
        "key": 72,
        "name": "Glue bleue",
        "anim": {
            "pics": [14, 14, 14, 30, 46, 46, 46, 30],
            "nbpic": 8,
            "modulo": 8
        },
        "pics": [14],
        "algo": "glue_bleue",
        "cycle": true
    }, //Blue "glue"
    "73": {
        "key": 73,
        "name": "Glue jaune",
        "anim": {
            "pics": [15, 15, 15, 31, 47, 47, 47, 31],
            "nbpic": 8,
            "modulo": 8
        },
        "pics": [15],
        "algo": "glue_jaune",
        "cycle": true
    }, //Yellow "glue"
    "74": {
        "key": 74,
        "name": "Fiolle verte",
        "pics": [104],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "stopfunc": "fiollechoc",
        "crushfunc": "fiollechoc"
    }, //Green flask
    "75": {
        "key": 75,
        "name": "Fiolle rouge",
        "pics": [105],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "stopfunc": "fiollechoc",
        "crushfunc": "fiollechoc"
    }, //Red flask
    "76": {
        "key": 76,
        "name": "Fiolle bleue",
        "pics": [106],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "stopfunc": "fiollechoc",
        "crushfunc": "fiollechoc"
    }, //Blue flask
    "77": {
        "key": 77,
        "name": "Fiolle jaune",
        "pics": [107],
        "algo": "chutte",
        "unstable": true,
        "pushable": 1,
        "stopfunc": "fiollechoc",
        "crushfunc": "fiollechoc"
    }, //Yellow flask
    //many missing...
    "100": {
        "key": 100,
        "name": "Rockbasher",
        "onexp": 16,
        "crushtrans": "disapear",
        "onheat": 16,
        "pics": [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95]
    }, //The rockbasher (Only 1 can be controlled)
    "101": {
        "key": 101,
        "name": "Exit inactive",
        "indestructible": true,
        "unstable": true,
        "pics": [108],
        "algo": "exit"
    }, //Inactive exit
    "102": {
        "key": 102,
        "name": "Exit active",
        "indestructible": true,
        "unstable": true,
        "anim": {
            "pics": [109, 110, 111],
            "nbpic": 3,
            "modulo": 6
        },
        "pics": [109, 110, 111],
        "cycle": true
    }, //Active exit
    "103": {
        "key": 103,
        "name": "Exit leaving",
        "indestructible": true,
        "unstable": true,
        "pics": [128, 129, 130, 131, 132, 133],
        "algo": "exitleaving"
    }, //Exit leaving animation block (Will not end level immediately)
    "128": {
        "key": 128,
        "name": "Scarab\u00e9",
        "pics": [64],
        "algo": "scarabe",
        "crushtrans": "scarabe",
        "crystaltrans": "scarabe",
        "heattrans": "scarabe",
        "clonable": 1
    }, //This and the next three are the scarabe bug
    "129": {
        "key": 129,
        "name": "Scarab\u00e9",
        "pics": [68],
        "algo": "scarabe",
        "crushtrans": "scarabe",
        "crystaltrans": "scarabe",
        "heattrans": "scarabe",
        "clonable": 1
    },
    "130": {
        "key": 130,
        "name": "Scarab\u00e9",
        "pics": [72],
        "algo": "scarabe",
        "crushtrans": "scarabe",
        "crystaltrans": "scarabe",
        "heattrans": "scarabe",
        "clonable": 1
    },
    "131": {
        "key": 131,
        "name": "Scarab\u00e9",
        "pics": [76],
        "algo": "scarabe",
        "crushtrans": "scarabe",
        "crystaltrans": "scarabe",
        "heattrans": "scarabe",
        "clonable": 1
    },
    "132": {
        "key": 132,
        "name": "Limace",
        "pics": [65],
        "algo": "limace",
        "crushtrans": "limace",
        "crystaltrans": "limace",
        "heattrans": "limace",
        "clonable": 1
    }, //This and the next three are the limace bug
    "133": {
        "key": 133,
        "name": "Limace",
        "pics": [69],
        "algo": "limace",
        "crushtrans": "limace",
        "crystaltrans": "limace",
        "heattrans": "limace",
        "clonable": 1
    },
    "134": {
        "key": 134,
        "name": "Limace",
        "pics": [73],
        "algo": "limace",
        "crushtrans": "limace",
        "crystaltrans": "limace",
        "heattrans": "limace",
        "clonable": 1
    },
    "135": {
        "key": 135,
        "name": "Limace",
        "pics": [77],
        "algo": "limace",
        "crushtrans": "limace",
        "crystaltrans": "limace",
        "heattrans": "limace",
        "clonable": 1
    },
    "136": {
        "key": 136,
        "name": "Papillon",
        "pics": [66],
        "algo": "papillon",
        "crushtrans": "papillon",
        "crystaltrans": "papillon",
        "heattrans": "papillon",
        "clonable": 1
    }, //This and the next three are the butterfly bug
    "137": {
        "key": 137,
        "name": "Papillon",
        "pics": [70],
        "algo": "papillon",
        "crushtrans": "papillon",
        "crystaltrans": "papillon",
        "heattrans": "papillon",
        "clonable": 1
    },
    "138": {
        "key": 138,
        "name": "Papillon",
        "pics": [74],
        "algo": "papillon",
        "crushtrans": "papillon",
        "crystaltrans": "papillon",
        "heattrans": "papillon",
        "clonable": 1
    },
    "139": {
        "key": 139,
        "name": "Papillon",
        "pics": [78],
        "algo": "papillon",
        "crushtrans": "papillon",
        "crystaltrans": "papillon",
        "heattrans": "papillon",
        "clonable": 1
    },
    "140": {
        "key": 140,
        "name": "Gu\u00eape",
        "pics": [67],
        "algo": "guepe",
        "crushtrans": "guepe",
        "crystaltrans": "guepe",
        "heattrans": "guepe",
        "clonable": 1
    }, //This and the next three are the bee/mosquito bug
    "141": {
        "key": 141,
        "name": "Gu\u00eape",
        "pics": [71],
        "algo": "guepe",
        "crushtrans": "guepe",
        "crystaltrans": "guepe",
        "heattrans": "guepe",
        "clonable": 1
    },
    "142": {
        "key": 142,
        "name": "Gu\u00eape",
        "pics": [75],
        "algo": "guepe",
        "crushtrans": "guepe",
        "crystaltrans": "guepe",
        "heattrans": "guepe",
        "clonable": 1
    },
    "143": {
        "key": 143,
        "name": "Gu\u00eape",
        "pics": [79],
        "algo": "guepe",
        "crushtrans": "guepe",
        "crystaltrans": "guepe",
        "heattrans": "guepe",
        "clonable": 1
    }
};
/*
 
~~~ITEMS THAT REQUIRE MODDING IN~~~
 
1   - "Temporary vacuum"
4   - "Gold in dirt"
10  - "Wall with transformer inactive"
11  - "Wall with transformer active"
15  - "Yellow explosion"
16  - "Gray explosion"
28  - "Activated metal rock"
34  - "Striker"
38  - "Glass ball"
45  - "Sand rock"
46  - "Sand rock 2"
47  - "Sand rock 3"
100 - "Rockbasher"
103 - "Exit leaving"
 
 
 
 
HOW TO ADD MOD:
Use my level editor mod menu bookmarklet to add them directly into the editor. However, note that 1, 4, 100, and 103 do not have proper compatibility and for those you may need to paste the modified level directly into the console.
 
DOCS OF ATTRIBUTES:
"eatable": whether you can simply go through the tile. DEFAULTS TO false
"name": the name of the tile. DEFAULTS TO ""
"pics": picture[s] to be displayed. DEFAULTS TO "" - This is also why 1 and 4 cannot be placed in the editor, as there is no photo attributed to the item.
"miam": the noise made when run through. DEFAULTS TO ""
"glueprog":whether glue breaks through/destroys it. DEFAULTS TO false
"indestructible": whether the item is destructible. DEFAULTS TO false
"pushable": whether the item is pushable. DEFAULTS TO false
"algo": Type of item (chutte means it falls as a rock for example.)
"clonable": whether it can be cloned. DEFAULTS TO false
"heavy": whether it takes a longer amount of ms to push. DEFAULTS TO false
"score": amount of points you gain from running through item. DEFAULTS TO null
"anim": Animation of photos that display. Syntax: "anim": {"pics": [x,y,z], "nbpic": (number of pics), "modulo": (speed, the lower the number the faster)}
 
There are more, but not documented here (because there are a LOT).
*/
game.resources = [{
    "name": "main-bg",
    "type": "image",
    "url": "\/app\/data\/img\/main-bg.png"
}, {
    "name": "tiles64",
    "type": "image",
    "url": "\/app\/data\/img\/tiles64.png"
}, {
    "name": "spritesheet",
    "type": "image",
    "url": "\/app\/data\/img\/spritesheet.png?1519470495"
}, {
    "name": "audioSprite",
    "type": "howler",
    "args": {
        "src": ["\/app\/data\/sfx\/audioSprite.mp3?1518441905", "\/app\/data\/sfx\/audioSprite.ogg?1518441905", "\/app\/data\/sfx\/audioSprite.wav?1517509779"],
        "sprite": {
            "diams": [2000, 244],
            "cant": [2525, 775],
            "explosion": [3697, 1142],
            "timelimit": [5241, 86],
            "dead": [5725, 948],
            "rock2": [7075, 82],
            "walk": [7555, 70],
            "timelimit3": [8005, 67],
            "porte": [8422, 180],
            "boule": [8873, 271],
            "guepe": [9523, 189],
            "limace": [10110, 100],
            "scarabe": [10531, 62],
            "timelimit2": [10992, 66],
            "exit": [11408, 2197],
            "electro": [14075, 135],
            "rock": [14608, 163],
            "respi1": [15182, 585],
            "push": [16114, 409],
            "score": [16915, 602],
            "miam": [17929, 185],
            "crush": [18473, 113],
            "slurp": [19003, 248],
            "respi2": [19611, 628],
            "oeuf": [20585, 129],
            "papillon": [21068, 208],
            "walk2": [21678, 122],
            "grenade": [22079, 92]
        }
    }
}];
//game.resources isn't actually that important, this is mostly references to textures.

/*! howler.js v2.0.9 | (c) 2013-2018, James Simpson of GoldFire Studios | MIT License | howlerjs.com -- GENERALLY NOT USEFUL, this is an audio javascript library*/
!function () { "use strict"; var e = function () { this.init() }; e.prototype = { init: function () { var e = this || n; return e._counter = 1e3, e._codecs = {}, e._howls = [], e._muted = !1, e._volume = 1, e._canPlayEvent = "canplaythrough", e._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null, e.masterGain = null, e.noAudio = !1, e.usingWebAudio = !0, e.autoSuspend = !0, e.ctx = null, e.mobileAutoEnable = !0, e._setup(), e }, volume: function (e) { var t = this || n; if (e = parseFloat(e), t.ctx || _(), void 0 !== e && e >= 0 && e <= 1) { if (t._volume = e, t._muted) return t; t.usingWebAudio && t.masterGain.gain.setValueAtTime(e, n.ctx.currentTime); for (var o = 0; o < t._howls.length; o++)if (!t._howls[o]._webAudio) for (var r = t._howls[o]._getSoundIds(), a = 0; a < r.length; a++) { var u = t._howls[o]._soundById(r[a]); u && u._node && (u._node.volume = u._volume * e) } return t } return t._volume }, mute: function (e) { var t = this || n; t.ctx || _(), t._muted = e, t.usingWebAudio && t.masterGain.gain.setValueAtTime(e ? 0 : t._volume, n.ctx.currentTime); for (var o = 0; o < t._howls.length; o++)if (!t._howls[o]._webAudio) for (var r = t._howls[o]._getSoundIds(), a = 0; a < r.length; a++) { var u = t._howls[o]._soundById(r[a]); u && u._node && (u._node.muted = !!e || u._muted) } return t }, unload: function () { for (var e = this || n, t = e._howls.length - 1; t >= 0; t--)e._howls[t].unload(); return e.usingWebAudio && e.ctx && void 0 !== e.ctx.close && (e.ctx.close(), e.ctx = null, _()), e }, codecs: function (e) { return (this || n)._codecs[e.replace(/^x-/, "")] }, _setup: function () { var e = this || n; if (e.state = e.ctx ? e.ctx.state || "running" : "running", e._autoSuspend(), !e.usingWebAudio) if ("undefined" != typeof Audio) try { var t = new Audio; void 0 === t.oncanplaythrough && (e._canPlayEvent = "canplay") } catch (n) { e.noAudio = !0 } else e.noAudio = !0; try { var t = new Audio; t.muted && (e.noAudio = !0) } catch (e) { } return e.noAudio || e._setupCodecs(), e }, _setupCodecs: function () { var e = this || n, t = null; try { t = "undefined" != typeof Audio ? new Audio : null } catch (n) { return e } if (!t || "function" != typeof t.canPlayType) return e; var o = t.canPlayType("audio/mpeg;").replace(/^no$/, ""), r = e._navigator && e._navigator.userAgent.match(/OPR\/([0-6].)/g), a = r && parseInt(r[0].split("/")[1], 10) < 33; return e._codecs = { mp3: !(a || !o && !t.canPlayType("audio/mp3;").replace(/^no$/, "")), mpeg: !!o, opus: !!t.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""), ogg: !!t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), oga: !!t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), wav: !!t.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), aac: !!t.canPlayType("audio/aac;").replace(/^no$/, ""), caf: !!t.canPlayType("audio/x-caf;").replace(/^no$/, ""), m4a: !!(t.canPlayType("audio/x-m4a;") || t.canPlayType("audio/m4a;") || t.canPlayType("audio/aac;")).replace(/^no$/, ""), mp4: !!(t.canPlayType("audio/x-mp4;") || t.canPlayType("audio/mp4;") || t.canPlayType("audio/aac;")).replace(/^no$/, ""), weba: !!t.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""), webm: !!t.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""), dolby: !!t.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""), flac: !!(t.canPlayType("audio/x-flac;") || t.canPlayType("audio/flac;")).replace(/^no$/, "") }, e }, _enableMobileAudio: function () { var e = this || n, t = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(e._navigator && e._navigator.userAgent), o = !!("ontouchend" in window || e._navigator && e._navigator.maxTouchPoints > 0 || e._navigator && e._navigator.msMaxTouchPoints > 0); if (!e._mobileEnabled && e.ctx && (t || o)) { e._mobileEnabled = !1, e._mobileUnloaded || 44100 === e.ctx.sampleRate || (e._mobileUnloaded = !0, e.unload()), e._scratchBuffer = e.ctx.createBuffer(1, 1, 22050); var r = function () { n._autoResume(); var t = e.ctx.createBufferSource(); t.buffer = e._scratchBuffer, t.connect(e.ctx.destination), void 0 === t.start ? t.noteOn(0) : t.start(0), "function" == typeof e.ctx.resume && e.ctx.resume(), t.onended = function () { t.disconnect(0), e._mobileEnabled = !0, e.mobileAutoEnable = !1, document.removeEventListener("touchstart", r, !0), document.removeEventListener("touchend", r, !0) } }; return document.addEventListener("touchstart", r, !0), document.addEventListener("touchend", r, !0), e } }, _autoSuspend: function () { var e = this; if (e.autoSuspend && e.ctx && void 0 !== e.ctx.suspend && n.usingWebAudio) { for (var t = 0; t < e._howls.length; t++)if (e._howls[t]._webAudio) for (var o = 0; o < e._howls[t]._sounds.length; o++)if (!e._howls[t]._sounds[o]._paused) return e; return e._suspendTimer && clearTimeout(e._suspendTimer), e._suspendTimer = setTimeout(function () { e.autoSuspend && (e._suspendTimer = null, e.state = "suspending", e.ctx.suspend().then(function () { e.state = "suspended", e._resumeAfterSuspend && (delete e._resumeAfterSuspend, e._autoResume()) })) }, 3e4), e } }, _autoResume: function () { var e = this; if (e.ctx && void 0 !== e.ctx.resume && n.usingWebAudio) return "running" === e.state && e._suspendTimer ? (clearTimeout(e._suspendTimer), e._suspendTimer = null) : "suspended" === e.state ? (e.ctx.resume().then(function () { e.state = "running"; for (var n = 0; n < e._howls.length; n++)e._howls[n]._emit("resume") }), e._suspendTimer && (clearTimeout(e._suspendTimer), e._suspendTimer = null)) : "suspending" === e.state && (e._resumeAfterSuspend = !0), e } }; var n = new e, t = function (e) { var n = this; if (!e.src || 0 === e.src.length) return void console.error("An array of source files must be passed with any new Howl."); n.init(e) }; t.prototype = { init: function (e) { var t = this; return n.ctx || _(), t._autoplay = e.autoplay || !1, t._format = "string" != typeof e.format ? e.format : [e.format], t._html5 = e.html5 || !1, t._muted = e.mute || !1, t._loop = e.loop || !1, t._pool = e.pool || 5, t._preload = "boolean" != typeof e.preload || e.preload, t._rate = e.rate || 1, t._sprite = e.sprite || {}, t._src = "string" != typeof e.src ? e.src : [e.src], t._volume = void 0 !== e.volume ? e.volume : 1, t._xhrWithCredentials = e.xhrWithCredentials || !1, t._duration = 0, t._state = "unloaded", t._sounds = [], t._endTimers = {}, t._queue = [], t._playLock = !1, t._onend = e.onend ? [{ fn: e.onend }] : [], t._onfade = e.onfade ? [{ fn: e.onfade }] : [], t._onload = e.onload ? [{ fn: e.onload }] : [], t._onloaderror = e.onloaderror ? [{ fn: e.onloaderror }] : [], t._onplayerror = e.onplayerror ? [{ fn: e.onplayerror }] : [], t._onpause = e.onpause ? [{ fn: e.onpause }] : [], t._onplay = e.onplay ? [{ fn: e.onplay }] : [], t._onstop = e.onstop ? [{ fn: e.onstop }] : [], t._onmute = e.onmute ? [{ fn: e.onmute }] : [], t._onvolume = e.onvolume ? [{ fn: e.onvolume }] : [], t._onrate = e.onrate ? [{ fn: e.onrate }] : [], t._onseek = e.onseek ? [{ fn: e.onseek }] : [], t._onresume = [], t._webAudio = n.usingWebAudio && !t._html5, void 0 !== n.ctx && n.ctx && n.mobileAutoEnable && n._enableMobileAudio(), n._howls.push(t), t._autoplay && t._queue.push({ event: "play", action: function () { t.play() } }), t._preload && t.load(), t }, load: function () { var e = this, t = null; if (n.noAudio) return void e._emit("loaderror", null, "No audio support."); "string" == typeof e._src && (e._src = [e._src]); for (var r = 0; r < e._src.length; r++) { var u, i; if (e._format && e._format[r]) u = e._format[r]; else { if ("string" != typeof (i = e._src[r])) { e._emit("loaderror", null, "Non-string found in selected audio sources - ignoring."); continue } u = /^data:audio\/([^;,]+);/i.exec(i), u || (u = /\.([^.]+)$/.exec(i.split("?", 1)[0])), u && (u = u[1].toLowerCase()) } if (u || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'), u && n.codecs(u)) { t = e._src[r]; break } } return t ? (e._src = t, e._state = "loading", "https:" === window.location.protocol && "http:" === t.slice(0, 5) && (e._html5 = !0, e._webAudio = !1), new o(e), e._webAudio && a(e), e) : void e._emit("loaderror", null, "No codec support for selected audio sources.") }, play: function (e, t) { var o = this, r = null; if ("number" == typeof e) r = e, e = null; else { if ("string" == typeof e && "loaded" === o._state && !o._sprite[e]) return null; if (void 0 === e) { e = "__default"; for (var a = 0, u = 0; u < o._sounds.length; u++)o._sounds[u]._paused && !o._sounds[u]._ended && (a++ , r = o._sounds[u]._id); 1 === a ? e = null : r = null } } var i = r ? o._soundById(r) : o._inactiveSound(); if (!i) return null; if (r && !e && (e = i._sprite || "__default"), "loaded" !== o._state) { i._sprite = e, i._ended = !1; var d = i._id; return o._queue.push({ event: "play", action: function () { o.play(d) } }), d } if (r && !i._paused) return t || o._loadQueue("play"), i._id; o._webAudio && n._autoResume(); var _ = Math.max(0, i._seek > 0 ? i._seek : o._sprite[e][0] / 1e3), s = Math.max(0, (o._sprite[e][0] + o._sprite[e][1]) / 1e3 - _), l = 1e3 * s / Math.abs(i._rate); i._paused = !1, i._ended = !1, i._sprite = e, i._seek = _, i._start = o._sprite[e][0] / 1e3, i._stop = (o._sprite[e][0] + o._sprite[e][1]) / 1e3, i._loop = !(!i._loop && !o._sprite[e][2]); var c = i._node; if (o._webAudio) { var f = function () { o._refreshBuffer(i); var e = i._muted || o._muted ? 0 : i._volume; c.gain.setValueAtTime(e, n.ctx.currentTime), i._playStart = n.ctx.currentTime, void 0 === c.bufferSource.start ? i._loop ? c.bufferSource.noteGrainOn(0, _, 86400) : c.bufferSource.noteGrainOn(0, _, s) : i._loop ? c.bufferSource.start(0, _, 86400) : c.bufferSource.start(0, _, s), l !== 1 / 0 && (o._endTimers[i._id] = setTimeout(o._ended.bind(o, i), l)), t || setTimeout(function () { o._emit("play", i._id) }, 0) }; "running" === n.state ? f() : (o.once("resume", f), o._clearTimer(i._id)) } else { var p = function () { c.currentTime = _, c.muted = i._muted || o._muted || n._muted || c.muted, c.volume = i._volume * n.volume(), c.playbackRate = i._rate; try { var r = c.play(); if ("undefined" != typeof Promise && r instanceof Promise) { o._playLock = !0; var a = function () { o._playLock = !1, t || o._emit("play", i._id) }; r.then(a, a) } else t || o._emit("play", i._id); if (c.paused) return void o._emit("playerror", i._id, "Playback was unable to start. This is most commonly an issue on mobile devices where playback was not within a user interaction."); "__default" !== e ? o._endTimers[i._id] = setTimeout(o._ended.bind(o, i), l) : (o._endTimers[i._id] = function () { o._ended(i), c.removeEventListener("ended", o._endTimers[i._id], !1) }, c.addEventListener("ended", o._endTimers[i._id], !1)) } catch (e) { o._emit("playerror", i._id, e) } }, m = window && window.ejecta || !c.readyState && n._navigator.isCocoonJS; if (c.readyState >= 3 || m) p(); else { var v = function () { p(), c.removeEventListener(n._canPlayEvent, v, !1) }; c.addEventListener(n._canPlayEvent, v, !1), o._clearTimer(i._id) } } return i._id }, pause: function (e) { var n = this; if ("loaded" !== n._state || n._playLock) return n._queue.push({ event: "pause", action: function () { n.pause(e) } }), n; for (var t = n._getSoundIds(e), o = 0; o < t.length; o++) { n._clearTimer(t[o]); var r = n._soundById(t[o]); if (r && !r._paused && (r._seek = n.seek(t[o]), r._rateSeek = 0, r._paused = !0, n._stopFade(t[o]), r._node)) if (n._webAudio) { if (!r._node.bufferSource) continue; void 0 === r._node.bufferSource.stop ? r._node.bufferSource.noteOff(0) : r._node.bufferSource.stop(0), n._cleanBuffer(r._node) } else isNaN(r._node.duration) && r._node.duration !== 1 / 0 || r._node.pause(); arguments[1] || n._emit("pause", r ? r._id : null) } return n }, stop: function (e, n) { var t = this; if ("loaded" !== t._state) return t._queue.push({ event: "stop", action: function () { t.stop(e) } }), t; for (var o = t._getSoundIds(e), r = 0; r < o.length; r++) { t._clearTimer(o[r]); var a = t._soundById(o[r]); a && (a._seek = a._start || 0, a._rateSeek = 0, a._paused = !0, a._ended = !0, t._stopFade(o[r]), a._node && (t._webAudio ? a._node.bufferSource && (void 0 === a._node.bufferSource.stop ? a._node.bufferSource.noteOff(0) : a._node.bufferSource.stop(0), t._cleanBuffer(a._node)) : isNaN(a._node.duration) && a._node.duration !== 1 / 0 || (a._node.currentTime = a._start || 0, a._node.pause())), n || t._emit("stop", a._id)) } return t }, mute: function (e, t) { var o = this; if ("loaded" !== o._state) return o._queue.push({ event: "mute", action: function () { o.mute(e, t) } }), o; if (void 0 === t) { if ("boolean" != typeof e) return o._muted; o._muted = e } for (var r = o._getSoundIds(t), a = 0; a < r.length; a++) { var u = o._soundById(r[a]); u && (u._muted = e, u._interval && o._stopFade(u._id), o._webAudio && u._node ? u._node.gain.setValueAtTime(e ? 0 : u._volume, n.ctx.currentTime) : u._node && (u._node.muted = !!n._muted || e), o._emit("mute", u._id)) } return o }, volume: function () { var e, t, o = this, r = arguments; if (0 === r.length) return o._volume; if (1 === r.length || 2 === r.length && void 0 === r[1]) { o._getSoundIds().indexOf(r[0]) >= 0 ? t = parseInt(r[0], 10) : e = parseFloat(r[0]) } else r.length >= 2 && (e = parseFloat(r[0]), t = parseInt(r[1], 10)); var a; if (!(void 0 !== e && e >= 0 && e <= 1)) return a = t ? o._soundById(t) : o._sounds[0], a ? a._volume : 0; if ("loaded" !== o._state) return o._queue.push({ event: "volume", action: function () { o.volume.apply(o, r) } }), o; void 0 === t && (o._volume = e), t = o._getSoundIds(t); for (var u = 0; u < t.length; u++)(a = o._soundById(t[u])) && (a._volume = e, r[2] || o._stopFade(t[u]), o._webAudio && a._node && !a._muted ? a._node.gain.setValueAtTime(e, n.ctx.currentTime) : a._node && !a._muted && (a._node.volume = e * n.volume()), o._emit("volume", a._id)); return o }, fade: function (e, t, o, r) { var a = this; if ("loaded" !== a._state) return a._queue.push({ event: "fade", action: function () { a.fade(e, t, o, r) } }), a; a.volume(e, r); for (var u = a._getSoundIds(r), i = 0; i < u.length; i++) { var d = a._soundById(u[i]); if (d) { if (r || a._stopFade(u[i]), a._webAudio && !d._muted) { var _ = n.ctx.currentTime, s = _ + o / 1e3; d._volume = e, d._node.gain.setValueAtTime(e, _), d._node.gain.linearRampToValueAtTime(t, s) } a._startFadeInterval(d, e, t, o, u[i], void 0 === r) } } return a }, _startFadeInterval: function (e, n, t, o, r, a) { var u = this, i = n, d = t - n, _ = Math.abs(d / .01), s = Math.max(4, _ > 0 ? o / _ : o), l = Date.now(); e._fadeTo = t, e._interval = setInterval(function () { var r = (Date.now() - l) / o; l = Date.now(), i += d * r, i = Math.max(0, i), i = Math.min(1, i), i = Math.round(100 * i) / 100, u._webAudio ? e._volume = i : u.volume(i, e._id, !0), a && (u._volume = i), (t < n && i <= t || t > n && i >= t) && (clearInterval(e._interval), e._interval = null, e._fadeTo = null, u.volume(t, e._id), u._emit("fade", e._id)) }, s) }, _stopFade: function (e) { var t = this, o = t._soundById(e); return o && o._interval && (t._webAudio && o._node.gain.cancelScheduledValues(n.ctx.currentTime), clearInterval(o._interval), o._interval = null, t.volume(o._fadeTo, e), o._fadeTo = null, t._emit("fade", e)), t }, loop: function () { var e, n, t, o = this, r = arguments; if (0 === r.length) return o._loop; if (1 === r.length) { if ("boolean" != typeof r[0]) return !!(t = o._soundById(parseInt(r[0], 10))) && t._loop; e = r[0], o._loop = e } else 2 === r.length && (e = r[0], n = parseInt(r[1], 10)); for (var a = o._getSoundIds(n), u = 0; u < a.length; u++)(t = o._soundById(a[u])) && (t._loop = e, o._webAudio && t._node && t._node.bufferSource && (t._node.bufferSource.loop = e, e && (t._node.bufferSource.loopStart = t._start || 0, t._node.bufferSource.loopEnd = t._stop))); return o }, rate: function () { var e, t, o = this, r = arguments; if (0 === r.length) t = o._sounds[0]._id; else if (1 === r.length) { var a = o._getSoundIds(), u = a.indexOf(r[0]); u >= 0 ? t = parseInt(r[0], 10) : e = parseFloat(r[0]) } else 2 === r.length && (e = parseFloat(r[0]), t = parseInt(r[1], 10)); var i; if ("number" != typeof e) return i = o._soundById(t), i ? i._rate : o._rate; if ("loaded" !== o._state) return o._queue.push({ event: "rate", action: function () { o.rate.apply(o, r) } }), o; void 0 === t && (o._rate = e), t = o._getSoundIds(t); for (var d = 0; d < t.length; d++)if (i = o._soundById(t[d])) { i._rateSeek = o.seek(t[d]), i._playStart = o._webAudio ? n.ctx.currentTime : i._playStart, i._rate = e, o._webAudio && i._node && i._node.bufferSource ? i._node.bufferSource.playbackRate.setValueAtTime(e, n.ctx.currentTime) : i._node && (i._node.playbackRate = e); var _ = o.seek(t[d]), s = (o._sprite[i._sprite][0] + o._sprite[i._sprite][1]) / 1e3 - _, l = 1e3 * s / Math.abs(i._rate); !o._endTimers[t[d]] && i._paused || (o._clearTimer(t[d]), o._endTimers[t[d]] = setTimeout(o._ended.bind(o, i), l)), o._emit("rate", i._id) } return o }, seek: function () { var e, t, o = this, r = arguments; if (0 === r.length) t = o._sounds[0]._id; else if (1 === r.length) { var a = o._getSoundIds(), u = a.indexOf(r[0]); u >= 0 ? t = parseInt(r[0], 10) : o._sounds.length && (t = o._sounds[0]._id, e = parseFloat(r[0])) } else 2 === r.length && (e = parseFloat(r[0]), t = parseInt(r[1], 10)); if (void 0 === t) return o; if ("loaded" !== o._state) return o._queue.push({ event: "seek", action: function () { o.seek.apply(o, r) } }), o; var i = o._soundById(t); if (i) { if (!("number" == typeof e && e >= 0)) { if (o._webAudio) { var d = o.playing(t) ? n.ctx.currentTime - i._playStart : 0, _ = i._rateSeek ? i._rateSeek - i._seek : 0; return i._seek + (_ + d * Math.abs(i._rate)) } return i._node.currentTime } var s = o.playing(t); if (s && o.pause(t, !0), i._seek = e, i._ended = !1, o._clearTimer(t), s && o.play(t, !0), !o._webAudio && i._node && (i._node.currentTime = e), s && !o._webAudio) { var l = function () { o._playLock ? setTimeout(l, 0) : o._emit("seek", t) }; setTimeout(l, 0) } else o._emit("seek", t) } return o }, playing: function (e) { var n = this; if ("number" == typeof e) { var t = n._soundById(e); return !!t && !t._paused } for (var o = 0; o < n._sounds.length; o++)if (!n._sounds[o]._paused) return !0; return !1 }, duration: function (e) { var n = this, t = n._duration, o = n._soundById(e); return o && (t = n._sprite[o._sprite][1] / 1e3), t }, state: function () { return this._state }, unload: function () { for (var e = this, t = e._sounds, o = 0; o < t.length; o++) { if (t[o]._paused || e.stop(t[o]._id), !e._webAudio) { /MSIE |Trident\//.test(n._navigator && n._navigator.userAgent) || (t[o]._node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"), t[o]._node.removeEventListener("error", t[o]._errorFn, !1), t[o]._node.removeEventListener(n._canPlayEvent, t[o]._loadFn, !1) } delete t[o]._node, e._clearTimer(t[o]._id); var a = n._howls.indexOf(e); a >= 0 && n._howls.splice(a, 1) } var u = !0; for (o = 0; o < n._howls.length; o++)if (n._howls[o]._src === e._src) { u = !1; break } return r && u && delete r[e._src], n.noAudio = !1, e._state = "unloaded", e._sounds = [], e = null, null }, on: function (e, n, t, o) { var r = this, a = r["_on" + e]; return "function" == typeof n && a.push(o ? { id: t, fn: n, once: o } : { id: t, fn: n }), r }, off: function (e, n, t) { var o = this, r = o["_on" + e], a = 0; if ("number" == typeof n && (t = n, n = null), n || t) for (a = 0; a < r.length; a++) { var u = t === r[a].id; if (n === r[a].fn && u || !n && u) { r.splice(a, 1); break } } else if (e) o["_on" + e] = []; else { var i = Object.keys(o); for (a = 0; a < i.length; a++)0 === i[a].indexOf("_on") && Array.isArray(o[i[a]]) && (o[i[a]] = []) } return o }, once: function (e, n, t) { var o = this; return o.on(e, n, t, 1), o }, _emit: function (e, n, t) { for (var o = this, r = o["_on" + e], a = r.length - 1; a >= 0; a--)r[a].id && r[a].id !== n && "load" !== e || (setTimeout(function (e) { e.call(this, n, t) }.bind(o, r[a].fn), 0), r[a].once && o.off(e, r[a].fn, r[a].id)); return o._loadQueue(e), o }, _loadQueue: function (e) { var n = this; if (n._queue.length > 0) { var t = n._queue[0]; t.event === e && (n._queue.shift(), n._loadQueue()), e || t.action() } return n }, _ended: function (e) { var t = this, o = e._sprite; if (!t._webAudio && e._node && !e._node.paused && !e._node.ended && e._node.currentTime < e._stop) return setTimeout(t._ended.bind(t, e), 100), t; var r = !(!e._loop && !t._sprite[o][2]); if (t._emit("end", e._id), !t._webAudio && r && t.stop(e._id, !0).play(e._id), t._webAudio && r) { t._emit("play", e._id), e._seek = e._start || 0, e._rateSeek = 0, e._playStart = n.ctx.currentTime; var a = 1e3 * (e._stop - e._start) / Math.abs(e._rate); t._endTimers[e._id] = setTimeout(t._ended.bind(t, e), a) } return t._webAudio && !r && (e._paused = !0, e._ended = !0, e._seek = e._start || 0, e._rateSeek = 0, t._clearTimer(e._id), t._cleanBuffer(e._node), n._autoSuspend()), t._webAudio || r || t.stop(e._id), t }, _clearTimer: function (e) { var n = this; if (n._endTimers[e]) { if ("function" != typeof n._endTimers[e]) clearTimeout(n._endTimers[e]); else { var t = n._soundById(e); t && t._node && t._node.removeEventListener("ended", n._endTimers[e], !1) } delete n._endTimers[e] } return n }, _soundById: function (e) { for (var n = this, t = 0; t < n._sounds.length; t++)if (e === n._sounds[t]._id) return n._sounds[t]; return null }, _inactiveSound: function () { var e = this; e._drain(); for (var n = 0; n < e._sounds.length; n++)if (e._sounds[n]._ended) return e._sounds[n].reset(); return new o(e) }, _drain: function () { var e = this, n = e._pool, t = 0, o = 0; if (!(e._sounds.length < n)) { for (o = 0; o < e._sounds.length; o++)e._sounds[o]._ended && t++; for (o = e._sounds.length - 1; o >= 0; o--) { if (t <= n) return; e._sounds[o]._ended && (e._webAudio && e._sounds[o]._node && e._sounds[o]._node.disconnect(0), e._sounds.splice(o, 1), t--) } } }, _getSoundIds: function (e) { var n = this; if (void 0 === e) { for (var t = [], o = 0; o < n._sounds.length; o++)t.push(n._sounds[o]._id); return t } return [e] }, _refreshBuffer: function (e) { var t = this; return e._node.bufferSource = n.ctx.createBufferSource(), e._node.bufferSource.buffer = r[t._src], e._panner ? e._node.bufferSource.connect(e._panner) : e._node.bufferSource.connect(e._node), e._node.bufferSource.loop = e._loop, e._loop && (e._node.bufferSource.loopStart = e._start || 0, e._node.bufferSource.loopEnd = e._stop), e._node.bufferSource.playbackRate.setValueAtTime(e._rate, n.ctx.currentTime), t }, _cleanBuffer: function (e) { var t = this; if (n._scratchBuffer) { e.bufferSource.onended = null, e.bufferSource.disconnect(0); try { e.bufferSource.buffer = n._scratchBuffer } catch (e) { } } return e.bufferSource = null, t } }; var o = function (e) { this._parent = e, this.init() }; o.prototype = { init: function () { var e = this, t = e._parent; return e._muted = t._muted, e._loop = t._loop, e._volume = t._volume, e._rate = t._rate, e._seek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++n._counter, t._sounds.push(e), e.create(), e }, create: function () { var e = this, t = e._parent, o = n._muted || e._muted || e._parent._muted ? 0 : e._volume; return t._webAudio ? (e._node = void 0 === n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(), e._node.gain.setValueAtTime(o, n.ctx.currentTime), e._node.paused = !0, e._node.connect(n.masterGain)) : (e._node = new Audio, e._errorFn = e._errorListener.bind(e), e._node.addEventListener("error", e._errorFn, !1), e._loadFn = e._loadListener.bind(e), e._node.addEventListener(n._canPlayEvent, e._loadFn, !1), e._node.src = t._src, e._node.preload = "auto", e._node.volume = o * n.volume(), e._node.load()), e }, reset: function () { var e = this, t = e._parent; return e._muted = t._muted, e._loop = t._loop, e._volume = t._volume, e._rate = t._rate, e._seek = 0, e._rateSeek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++n._counter, e }, _errorListener: function () { var e = this; e._parent._emit("loaderror", e._id, e._node.error ? e._node.error.code : 0), e._node.removeEventListener("error", e._errorFn, !1) }, _loadListener: function () { var e = this, t = e._parent; t._duration = Math.ceil(10 * e._node.duration) / 10, 0 === Object.keys(t._sprite).length && (t._sprite = { __default: [0, 1e3 * t._duration] }), "loaded" !== t._state && (t._state = "loaded", t._emit("load"), t._loadQueue()), e._node.removeEventListener(n._canPlayEvent, e._loadFn, !1) } }; var r = {}, a = function (e) { var n = e._src; if (r[n]) return e._duration = r[n].duration, void d(e); if (/^data:[^;]+;base64,/.test(n)) { for (var t = atob(n.split(",")[1]), o = new Uint8Array(t.length), a = 0; a < t.length; ++a)o[a] = t.charCodeAt(a); i(o.buffer, e) } else { var _ = new XMLHttpRequest; _.open("GET", n, !0), _.withCredentials = e._xhrWithCredentials, _.responseType = "arraybuffer", _.onload = function () { var n = (_.status + "")[0]; if ("0" !== n && "2" !== n && "3" !== n) return void e._emit("loaderror", null, "Failed loading audio file with status: " + _.status + "."); i(_.response, e) }, _.onerror = function () { e._webAudio && (e._html5 = !0, e._webAudio = !1, e._sounds = [], delete r[n], e.load()) }, u(_) } }, u = function (e) { try { e.send() } catch (n) { e.onerror() } }, i = function (e, t) { n.ctx.decodeAudioData(e, function (e) { e && t._sounds.length > 0 && (r[t._src] = e, d(t, e)) }, function () { t._emit("loaderror", null, "Decoding audio data failed.") }) }, d = function (e, n) { n && !e._duration && (e._duration = n.duration), 0 === Object.keys(e._sprite).length && (e._sprite = { __default: [0, 1e3 * e._duration] }), "loaded" !== e._state && (e._state = "loaded", e._emit("load"), e._loadQueue()) }, _ = function () { try { "undefined" != typeof AudioContext ? n.ctx = new AudioContext : "undefined" != typeof webkitAudioContext ? n.ctx = new webkitAudioContext : n.usingWebAudio = !1 } catch (e) { n.usingWebAudio = !1 } var e = /iP(hone|od|ad)/.test(n._navigator && n._navigator.platform), t = n._navigator && n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/), o = t ? parseInt(t[1], 10) : null; if (e && o && o < 9) { var r = /safari/.test(n._navigator && n._navigator.userAgent.toLowerCase()); (n._navigator && n._navigator.standalone && !r || n._navigator && !n._navigator.standalone && !r) && (n.usingWebAudio = !1) } n.usingWebAudio && (n.masterGain = void 0 === n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(), n.masterGain.gain.setValueAtTime(n._muted ? 0 : 1, n.ctx.currentTime), n.masterGain.connect(n.ctx.destination)), n._setup() }; "function" == typeof define && define.amd && define([], function () { return { Howler: n, Howl: t } }), "undefined" != typeof exports && (exports.Howler = n, exports.Howl = t), "undefined" != typeof window ? (window.HowlerGlobal = e, window.Howler = n, window.Howl = t, window.Sound = o) : "undefined" != typeof global && (global.HowlerGlobal = e, global.Howler = n, global.Howl = t, global.Sound = o) }();
/*! howler.js v2.0.9 | Spatial Plugin | (c) 2013-2018, James Simpson of GoldFire Studios | MIT License | howlerjs.com  -- GENERALLY NOT USEFUL, this is an audio javascript library*/
!function () { "use strict"; HowlerGlobal.prototype._pos = [0, 0, 0], HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0], HowlerGlobal.prototype.stereo = function (n) { var e = this; if (!e.ctx || !e.ctx.listener) return e; for (var t = e._howls.length - 1; t >= 0; t--)e._howls[t].stereo(n); return e }, HowlerGlobal.prototype.pos = function (n, e, t) { var o = this; return o.ctx && o.ctx.listener ? (e = "number" != typeof e ? o._pos[1] : e, t = "number" != typeof t ? o._pos[2] : t, "number" != typeof n ? o._pos : (o._pos = [n, e, t], o.ctx.listener.setPosition(o._pos[0], o._pos[1], o._pos[2]), o)) : o }, HowlerGlobal.prototype.orientation = function (n, e, t, o, r, a) { var i = this; if (!i.ctx || !i.ctx.listener) return i; var p = i._orientation; return e = "number" != typeof e ? p[1] : e, t = "number" != typeof t ? p[2] : t, o = "number" != typeof o ? p[3] : o, r = "number" != typeof r ? p[4] : r, a = "number" != typeof a ? p[5] : a, "number" != typeof n ? p : (i._orientation = [n, e, t, o, r, a], i.ctx.listener.setOrientation(n, e, t, o, r, a), i) }, Howl.prototype.init = function (n) { return function (e) { var t = this; return t._orientation = e.orientation || [1, 0, 0], t._stereo = e.stereo || null, t._pos = e.pos || null, t._pannerAttr = { coneInnerAngle: void 0 !== e.coneInnerAngle ? e.coneInnerAngle : 360, coneOuterAngle: void 0 !== e.coneOuterAngle ? e.coneOuterAngle : 360, coneOuterGain: void 0 !== e.coneOuterGain ? e.coneOuterGain : 0, distanceModel: void 0 !== e.distanceModel ? e.distanceModel : "inverse", maxDistance: void 0 !== e.maxDistance ? e.maxDistance : 1e4, panningModel: void 0 !== e.panningModel ? e.panningModel : "HRTF", refDistance: void 0 !== e.refDistance ? e.refDistance : 1, rolloffFactor: void 0 !== e.rolloffFactor ? e.rolloffFactor : 1 }, t._onstereo = e.onstereo ? [{ fn: e.onstereo }] : [], t._onpos = e.onpos ? [{ fn: e.onpos }] : [], t._onorientation = e.onorientation ? [{ fn: e.onorientation }] : [], n.call(this, e) } }(Howl.prototype.init), Howl.prototype.stereo = function (e, t) { var o = this; if (!o._webAudio) return o; if ("loaded" !== o._state) return o._queue.push({ event: "stereo", action: function () { o.stereo(e, t) } }), o; var r = void 0 === Howler.ctx.createStereoPanner ? "spatial" : "stereo"; if (void 0 === t) { if ("number" != typeof e) return o._stereo; o._stereo = e, o._pos = [e, 0, 0] } for (var a = o._getSoundIds(t), i = 0; i < a.length; i++) { var p = o._soundById(a[i]); if (p) { if ("number" != typeof e) return p._stereo; p._stereo = e, p._pos = [e, 0, 0], p._node && (p._pannerAttr.panningModel = "equalpower", p._panner && p._panner.pan || n(p, r), "spatial" === r ? p._panner.setPosition(e, 0, 0) : p._panner.pan.setValueAtTime(e, Howler.ctx.currentTime)), o._emit("stereo", p._id) } } return o }, Howl.prototype.pos = function (e, t, o, r) { var a = this; if (!a._webAudio) return a; if ("loaded" !== a._state) return a._queue.push({ event: "pos", action: function () { a.pos(e, t, o, r) } }), a; if (t = "number" != typeof t ? 0 : t, o = "number" != typeof o ? -.5 : o, void 0 === r) { if ("number" != typeof e) return a._pos; a._pos = [e, t, o] } for (var i = a._getSoundIds(r), p = 0; p < i.length; p++) { var s = a._soundById(i[p]); if (s) { if ("number" != typeof e) return s._pos; s._pos = [e, t, o], s._node && (s._panner && !s._panner.pan || n(s, "spatial"), s._panner.setPosition(e, t, o)), a._emit("pos", s._id) } } return a }, Howl.prototype.orientation = function (e, t, o, r) { var a = this; if (!a._webAudio) return a; if ("loaded" !== a._state) return a._queue.push({ event: "orientation", action: function () { a.orientation(e, t, o, r) } }), a; if (t = "number" != typeof t ? a._orientation[1] : t, o = "number" != typeof o ? a._orientation[2] : o, void 0 === r) { if ("number" != typeof e) return a._orientation; a._orientation = [e, t, o] } for (var i = a._getSoundIds(r), p = 0; p < i.length; p++) { var s = a._soundById(i[p]); if (s) { if ("number" != typeof e) return s._orientation; s._orientation = [e, t, o], s._node && (s._panner || (s._pos || (s._pos = a._pos || [0, 0, -.5]), n(s, "spatial")), s._panner.setOrientation(e, t, o)), a._emit("orientation", s._id) } } return a }, Howl.prototype.pannerAttr = function () { var e, t, o, r = this, a = arguments; if (!r._webAudio) return r; if (0 === a.length) return r._pannerAttr; if (1 === a.length) { if ("object" != typeof a[0]) return o = r._soundById(parseInt(a[0], 10)), o ? o._pannerAttr : r._pannerAttr; e = a[0], void 0 === t && (e.pannerAttr || (e.pannerAttr = { coneInnerAngle: e.coneInnerAngle, coneOuterAngle: e.coneOuterAngle, coneOuterGain: e.coneOuterGain, distanceModel: e.distanceModel, maxDistance: e.maxDistance, refDistance: e.refDistance, rolloffFactor: e.rolloffFactor, panningModel: e.panningModel }), r._pannerAttr = { coneInnerAngle: void 0 !== e.pannerAttr.coneInnerAngle ? e.pannerAttr.coneInnerAngle : r._coneInnerAngle, coneOuterAngle: void 0 !== e.pannerAttr.coneOuterAngle ? e.pannerAttr.coneOuterAngle : r._coneOuterAngle, coneOuterGain: void 0 !== e.pannerAttr.coneOuterGain ? e.pannerAttr.coneOuterGain : r._coneOuterGain, distanceModel: void 0 !== e.pannerAttr.distanceModel ? e.pannerAttr.distanceModel : r._distanceModel, maxDistance: void 0 !== e.pannerAttr.maxDistance ? e.pannerAttr.maxDistance : r._maxDistance, refDistance: void 0 !== e.pannerAttr.refDistance ? e.pannerAttr.refDistance : r._refDistance, rolloffFactor: void 0 !== e.pannerAttr.rolloffFactor ? e.pannerAttr.rolloffFactor : r._rolloffFactor, panningModel: void 0 !== e.pannerAttr.panningModel ? e.pannerAttr.panningModel : r._panningModel }) } else 2 === a.length && (e = a[0], t = parseInt(a[1], 10)); for (var i = r._getSoundIds(t), p = 0; p < i.length; p++)if (o = r._soundById(i[p])) { var s = o._pannerAttr; s = { coneInnerAngle: void 0 !== e.coneInnerAngle ? e.coneInnerAngle : s.coneInnerAngle, coneOuterAngle: void 0 !== e.coneOuterAngle ? e.coneOuterAngle : s.coneOuterAngle, coneOuterGain: void 0 !== e.coneOuterGain ? e.coneOuterGain : s.coneOuterGain, distanceModel: void 0 !== e.distanceModel ? e.distanceModel : s.distanceModel, maxDistance: void 0 !== e.maxDistance ? e.maxDistance : s.maxDistance, refDistance: void 0 !== e.refDistance ? e.refDistance : s.refDistance, rolloffFactor: void 0 !== e.rolloffFactor ? e.rolloffFactor : s.rolloffFactor, panningModel: void 0 !== e.panningModel ? e.panningModel : s.panningModel }; var l = o._panner; l ? (l.coneInnerAngle = s.coneInnerAngle, l.coneOuterAngle = s.coneOuterAngle, l.coneOuterGain = s.coneOuterGain, l.distanceModel = s.distanceModel, l.maxDistance = s.maxDistance, l.refDistance = s.refDistance, l.rolloffFactor = s.rolloffFactor, l.panningModel = s.panningModel) : (o._pos || (o._pos = r._pos || [0, 0, -.5]), n(o, "spatial")) } return r }, Sound.prototype.init = function (n) { return function () { var e = this, t = e._parent; e._orientation = t._orientation, e._stereo = t._stereo, e._pos = t._pos, e._pannerAttr = t._pannerAttr, n.call(this), e._stereo ? t.stereo(e._stereo) : e._pos && t.pos(e._pos[0], e._pos[1], e._pos[2], e._id) } }(Sound.prototype.init), Sound.prototype.reset = function (n) { return function () { var e = this, t = e._parent; return e._orientation = t._orientation, e._pos = t._pos, e._pannerAttr = t._pannerAttr, n.call(this) } }(Sound.prototype.reset); var n = function (n, e) { e = e || "spatial", "spatial" === e ? (n._panner = Howler.ctx.createPanner(), n._panner.coneInnerAngle = n._pannerAttr.coneInnerAngle, n._panner.coneOuterAngle = n._pannerAttr.coneOuterAngle, n._panner.coneOuterGain = n._pannerAttr.coneOuterGain, n._panner.distanceModel = n._pannerAttr.distanceModel, n._panner.maxDistance = n._pannerAttr.maxDistance, n._panner.refDistance = n._pannerAttr.refDistance, n._panner.rolloffFactor = n._pannerAttr.rolloffFactor, n._panner.panningModel = n._pannerAttr.panningModel, n._panner.setPosition(n._pos[0], n._pos[1], n._pos[2]), n._panner.setOrientation(n._orientation[0], n._orientation[1], n._orientation[2])) : (n._panner = Howler.ctx.createStereoPanner(), n._panner.pan.setValueAtTime(n._stereo, Howler.ctx.currentTime)), n._panner.connect(n._node), n._paused || n._parent.pause(n._id, !0).play(n._id, !0) } }();
/*
    IMPORTANT INFORMATION
    var game is the canvas CTX. 
*/
(function() { // Runs on load
    function extend() {
        var methods = {};
        var mixins = new Array(arguments.length);
        for (var i = 0; i < arguments.length; i++) {
            mixins.push(arguments[i]);
        }

        function Class() {
            this.init.apply(this, arguments);
            return this;
        }
        Class.prototype = Object.create(this.prototype);
        mixins.forEach(function(mixin) {
            apply_methods(Class, methods, mixin.__methods__ || mixin);
        });
        if (!("init" in Class.prototype)) {
            throw new TypeError("extend: Class is missing a constructor named `init`");
        }
        Object.defineProperty(Class.prototype, "_super", {
            "value": _super
        });
        Object.defineProperty(Class, "__methods__", {
            "value": methods
        });
        Class.extend = extend;
        return Class;
    }

    function apply_methods(Class, methods, descriptor) {
        Object.keys(descriptor).forEach(function(method) {
            methods[method] = descriptor[method];
            if (typeof(descriptor[method]) !== "function") {
                throw new TypeError("extend: Method `" + method + "` is not a function");
            }
            Object.defineProperty(Class.prototype, method, {
                "configurable": true,
                "value": descriptor[method]
            });
        });
    }

    function _super(superClass, method, args) {
        return superClass.prototype[method].apply(this, args);
    }
    var Jay = function() { // Runs on start
        Object.apply(this, arguments);
    };
    Jay.prototype = Object.create(Object.prototype);
    Jay.prototype.constructor = Jay;
    Object.defineProperty(Jay, "extend", {
        "value": extend
    });
    if (typeof(window) !== "undefined") {
        window.Jay = Jay;
    } else {
        module.exports = Jay;
    }
})();

game.CircularBuffer = Jay.extend({
    init: function(max_size) {
        this.buffer = [];
        this.in_ptr = 0;
        this.out_ptr = 0;
        this.size = 0;
        this.max_size = max_size;
    },
    enqueue: function(value) {
        this.buffer[this.in_ptr++] = value;
        this.in_ptr %= this.max_size;
        if (this.size < this.max_size) {
            this.size++;
        } else {
            this.out_ptr++;
            this.out_ptr %= this.max_size;
        }
    },
    has_data: function() {
        return this.size > 0;
    },
    dequeue: function() {
        if (!this.has_data()) return null;
        var value = this.buffer[this.out_ptr++];
        this.out_ptr %= this.max_size;
        this.size--;
        return value;
    }
});

game.loader = function() {
    var queue = [];
    var success = 0;
    var errors = 0;
    var resources = {};
    var done = function() {
        return queue.length == success + errors;
    };
    var xmlHTTPLoad = function(obj, type, url, onLoad, onError, onProgress) {
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', url, true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function(e) {
            var h = xmlHTTP.getAllResponseHeaders(),
                m = h.match(/^Content-Type\:\s*(.*?)$/mi),
                mimeType = m[1] || 'image/png';
            var blob = new Blob([this.response], {
                type: mimeType
            });
            if (type == 'image') {
                obj.addEventListener('load', function() {
                    if (onLoad) onLoad();
                });
            }
            obj.src = window.URL.createObjectURL(blob);
            if (type != 'image') {
                if (onLoad) onLoad();
            }
        };
        xmlHTTP.onerror = function() {
            if (onError) onError();
        };
        xmlHTTP.onloadstart = function() {
            onProgress(0);
        };
        xmlHTTP.onprogress = function(e) {
            if (e.lengthComputable) {
                if (onProgress) onProgress(e.loaded / e.total);
            }
        };
        xmlHTTP.onloadend = function() {
            onProgress(1);
        };
        xmlHTTP.send();
    };
    return {
        enqueue: function(resource) {
            queue.push(resource);
        },
        downloadAll: function(onLoad, onProgress) {
            var progressions = [];
            var get_prog_func = function(i) {
                return function(ratio) {
                    progressions[i] = ratio;
                    var total = 0;
                    for (var n = 0; n < progressions.length; n++) total += progressions[n];
                    onProgress(total / progressions.length);
                };
            };
            for (var i = 0; i < queue.length; i++) {
                progressions.push(0);
                var prog_func = get_prog_func(i);
                var obj, item = queue[i];
                if (item.type == 'howler') {
                    item.args.onloaderror = function() {
                        prog_func(1);
                        success++;
                        if (done()) onLoad(errors != 0);
                    };
                    item.args.onload = function() {
                        prog_func(1);
                        success++;
                        if (done()) onLoad(errors != 0);
                    }
                    obj = new Howl(item.args);
                } else {
                    obj = item.type == 'audio' ? new Audio() : new Image();
                    xmlHTTPLoad(obj, item.type, item.url, function() {
                        success++;
                        if (done()) onLoad(errors != 0);
                    }, function() {
                        errors++;
                        if (done()) onLoad(errors != 0);
                    }, prog_func);
                }
                resources[item.name] = obj;
            }
        },
        getResource: function(name) {
            return resources[name];
        }
    };
}();

game.gfx = function() {
    var canvas;
    var ctx;
    var width;
    var height;
    return {
        init: function(_canvas, _width, _height) {
            canvas = _canvas;
            ctx = canvas.getContext("2d");
            width = _width;
            height = _height;
        },
        clear: function(color) {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, width, height);
        },
        drawTile: function(tileset, pic, x, y) {
            ctx.drawImage(tileset.image, tileset.ox + (pic % tileset.cols) * tileset.tw, tileset.oy + Math.floor(pic / tileset.cols) * tileset.th, tileset.tw, tileset.th, x, y, tileset.tw, tileset.th);
        },
        drawImage: function(image, x, y) {
            ctx.drawImage(image, x, y);
        },
        drawText: function(text, x, y, font, color, baseline) {
            ctx.save();
            ctx.font = font;
            ctx.textBaseline = baseline;
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
            ctx.restore();
        },
        measureText: function(text, font) {
            ctx.save();
            ctx.font = font;
            var tm = ctx.measureText(text);
            ctx.restore();
            return tm.width;
        },
        fillRect: function(x, y, width, height, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        },
        saveContext: function() {
            ctx.save();
        },
        restoreContext: function() {
            ctx.restore();
        },
        drawEmboss: function(ox, oy, w, h, size, min) {
            if (min == 1) return;
            var imgd = ctx.getImageData(0, 0, width, height);
            var p = imgd.data;
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var i = ((oy + y) * width + (ox + x)) * 4;
                    var r, rx, ry, fx, fy;
                    var transp_area = x >= size && y >= size && x <= w - size && y <= h - size;
                    if (transp_area) {
                        if (min == 0) {
                            p[i + 0] = 0;
                            p[i + 1] = 0;
                            p[i + 2] = 0;
                            p[i + 3] = 0;
                        } else {
                            p[i + 0] = p[i + 0] * min;
                            p[i + 1] = p[i + 1] * min;
                            p[i + 2] = p[i + 2] * min;
                            p[i + 3] = p[i + 3];
                        }
                    } else {
                        if (x <= size) {
                            rx = (size - x) / size;
                            fx = 0;
                        } else if (x >= w - size) {
                            rx = (size + x - w) / size;
                            fx = 1;
                        } else rx = 0;
                        if (y < size) {
                            ry = (size - y) / size;
                            fy = 0;
                        } else if (y >= h - size) {
                            ry = (size + y - h) / size;
                            fy = 1;
                        } else ry = 0;
                        if (rx == 0 && ry == 0) r = 0;
                        else if (rx == 0) {
                            r = fy == 0 ? ry : 1 + 1 - ry;
                        } else if (ry == 0) {
                            r = fx == 0 ? rx : 1 + 1 - rx;
                        } else {
                            if (rx > ry) {
                                r = fx == 0 ? rx : 1 + 1 - rx;
                            } else {
                                r = fy == 0 ? ry : 1 + 1 - ry;
                            }
                        }
                        r = min + (1 - min) * r;
                        p[i + 0] = Math.min(255, p[i + 0] * r);
                        p[i + 1] = Math.min(255, p[i + 1] * r);
                        p[i + 2] = Math.min(255, p[i + 2] * r);
                        p[i + 3] = p[i + 3];
                    }
                }
            }
            for (var y = size; y < h - size; y++) {
                var i = ((oy + y) * width + (ox + size)) * 4;
                p[i + 0] = 0;
                p[i + 1] = 0;
                p[i + 2] = 0;
                p[i + 3] = 255;
                var i = ((oy + y) * width + (ox + w - size)) * 4;
                p[i + 0] = 0;
                p[i + 1] = 0;
                p[i + 2] = 0;
                p[i + 3] = 255;
            }
            for (var x = size; x < w - size; x++) {
                var i = ((oy + size) * width + (ox + x)) * 4;
                p[i + 0] = 0;
                p[i + 1] = 0;
                p[i + 2] = 0;
                p[i + 3] = 255;
                var i = ((oy + h - size) * width + (ox + x)) * 4;
                p[i + 0] = 0;
                p[i + 1] = 0;
                p[i + 2] = 0;
                p[i + 3] = 255;
            }
            ctx.putImageData(imgd, 0, 0);
        },
        setImageData: function() {},
        getImage: function() {
            var img = new Image();
            img.src = canvas.toDataURL('image/png');
            return img;
        }
    }
}();

game.audio = function() {
    var howl;
    return {
        init: function(types) {
            howl = game.loader.getResource('audioSprite');
        },
        stop: function() {
            howl.stop();
        },
        check: function() {},
        play: function(name, volume, pan) {
            var id = howl.play(name);
            howl.volume(typeof volume == 'undefined' ? 1 : volume, id);
            howl.stereo(typeof pan == 'undefined' ? 0 : pan, id);
        }
    };
}();

game.input = function() {
    var keys = {
        ESC: 27,
        UP: 38,
        LEFT: 37,
        RIGHT: 39,
        DOWN: 40,
        CTRL: 17,
        SHIFT: 16,
        D: 68,
        G: 71,
        H: 72,
        K: 75,
        P: 80,
        R: 82,
        S: 83
    };
    var binding = {};
    binding[keys.ESC] = 'esc';
    binding[keys.UP] = 'up';
    binding[keys.LEFT] = 'left';
    binding[keys.RIGHT] = 'right';
    binding[keys.DOWN] = 'down';
    binding[keys.CTRL] = 'drop';
    binding[keys.SHIFT] = 'select';
    binding[keys.D] = 'dynamite';
    binding[keys.G] = 'grenade';
    binding[keys.H] = 'help';
    binding[keys.K] = 'kill';
    binding[keys.P] = 'pause';
    binding[keys.R] = 'replay';
    var status = {
        'esc': false,
        'up': false,
        'down': false,
        'left': false,
        'right': false,
        'drop': false,
        'select': false,
        'dynamite': false,
        'grenade': false,
        'kill': false,
        'pause': false,
        'replay': false,
        'help': false
    };
    var replay = false;
    var replay_index = 0;
    var replay_tick = 0;
    var replay_events = [];
    var replay_state = 0;
    var ongoingTouches = [];
    var virtual_keyboard = document.getElementById("virtual_keyboard");
    var ongoingTouchIndexById = function(idToFind) {
        for (var i = 0; i < ongoingTouches.length; i++) {
            var id = ongoingTouches[i].identifier;
            if (id == idToFind) return i;
        }
        return -1;
    };
    var handleStart = function(evt) {
        virtual_keyboard.style.display = "block";
        evt.preventDefault();
        var touches = evt.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            ongoingTouches.push(touches[i]);
            var action = touches[i].target.getAttribute('data-action');
            if (action) {
                touches[i].target.setAttribute("data-state", "on");
                status[action] = true;
            }
        }
    };
    var handleMove = function(evt) {};
    var handleEnd = function(evt) {
        evt.preventDefault();
        var touches = evt.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var action = touches[i].target.getAttribute('data-action');
            if (action) {
                touches[i].target.setAttribute("data-state", "off");
                status[action] = false;
            }
            ongoingTouches.splice(i, 1);
        }
    };
    var handleCancel = function(evt) {
        evt.preventDefault();
        var touches = evt.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            ongoingTouches.splice(i, 1);
        }
    };
    return {
        init: function() {
            this.reset();
            window.addEventListener("keydown", function(e, keyCode, mouseButton) {
                keyCode = keyCode || e.keyCode || e.button;
                var action = binding[keyCode];
                if (typeof action != 'undefined') status[action] = true;
            }, false);
            window.addEventListener("keyup", function(e, keyCode, mouseButton) {
                keyCode = keyCode || e.keyCode || e.button;
                var action = binding[keyCode];
                if (typeof action != 'undefined') status[action] = false;
            }, false);
            if (game.const.debug) {
                console.log("Init step debug");
                window.addEventListener("keypress", function(e, keyCode, mouseButton) {
                    keyCode = keyCode || e.keyCode || e.button;
                    if (e.which == 115) {
                        console.log("---- Debug step: ", game.play.tick, game.play.movetick, game.play.animtick);
                        game.play.update();
                    }
                }, false);
            }
            window.addEventListener("mousedown", function(event) {
                var action = event.target.getAttribute('data-action');
                if (action) {
                    event.target.setAttribute("data-state", "on");
                    status[action] = true;
                }
            }, false);
            window.addEventListener("mouseup", function(event) {
                for (var key in status) {
                    status[key] = false;
                    var e = document.getElementById("key_" + key);
                    if (e) e.setAttribute("data-state", "off");
                }
            }, false);
            document.body.addEventListener("touchstart", handleStart, false);
            document.body.addEventListener("touchend", handleEnd, false);
            document.body.addEventListener("touchcancel", handleCancel, false);
        },
        tick: function(animtick) {
            if (replay) {
                if (replay_index < replay_events.length) {
                    if (animtick == replay_tick + replay_events[replay_index]) {
                        replay_tick += replay_events[replay_index++];
                        replay_state = replay_events[replay_index++];
                    }
                }
            } else {
                var binstate = 0;
                if (status['up']) binstate |= 1;
                if (status['down']) binstate |= 2;
                if (status['left']) binstate |= 4;
                if (status['right']) binstate |= 8;
                if (status['drop']) binstate |= 16;
                if (status['select']) binstate |= 32;
                if (status['dynamite']) binstate |= 64;
                if (status['grenade']) binstate |= 128;
                if (status['kill']) binstate |= 256;
                if (binstate != replay_state) {
                    replay_events.push(animtick - replay_tick);
                    replay_events.push(binstate);
                    replay_state = binstate;
                    replay_tick = animtick;
                }
            }
        },
        reset: function(events) {
            for (var action in status) status[action] = false;
            ongoingTouches = [];
            replay = typeof events != 'undefined';
            replay_tick = 0;
            replay_state = 0;
            if (replay) {
                replay_index = 0;
                replay_events = events;
            } else {
                replay_events = [];
            }
        },
        getReplayRecords: function() {
            return replay_events;
        },
        keyPressed: function(action) {
            if (action == 'esc' || action == 'pause' || action == 'replay' || action == 'kill') return status[action];
            return false;
        },
        keyStatus: function(action) {
            if (replay) {
                if (action == 'up') return replay_state & 1;
                if (action == 'down') return replay_state & 2;
                if (action == 'left') return replay_state & 4;
                if (action == 'right') return replay_state & 8;
                if (action == 'drop') return replay_state & 16;
                if (action == 'select') return replay_state & 32;
                if (action == 'dynamite') return replay_state & 64;
                if (action == 'grenade') return replay_state & 128;
                if (action == 'kill') return replay_state & 256;
            } else {
                return status[action];
            }
        },
        setStatus: function(action, state) {
            status[action] = state;
        }
    };
}();
//defines key functions

game.Rect = Jay.extend({
    init: function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.anchor = {
            x: 0,
            y: 0
        };
    },
    setAnchor: function(anchor) {
        this.anchor = anchor;
    },
    is_in: function(x, y) {
        if (x < this.x) return false;
        if (y < this.y) return false;
        if (x >= this.x + this.width) return false;
        if (y >= this.y + this.height) return false;
        return true;
    },
    getX: function() {
        return this.x - this.anchor.x * this.width;
    },
    getY: function() {
        return this.y - this.anchor.y * this.height;
    }
});
//defines xy

game.Button = game.Rect.extend({
    init: function(x, y, width, height, action, caption) {
        this._super(game.Rect, "init", [x, y, width, height]);
        this.state = false;
        this.leaved = false;
        this.in = false;
        this.id = 0;
        this.action = action;
        this.caption = caption;
    },
    onClick: function() {
        console.log("Clicked " + this.action);
    },
    onTouchDown: function(id, x, y) {
        if (this.is_in(x, y)) {
            this.id = id;
            this.in = true;
            this.state = true;
            this.leaved = false;
            game.input.setStatus(this.action, true);
            return true;
        }
        return false;
    },
    onTouchEnd: function(id, x, y) {
        if (this.id == id) {
            this.state = false;
            this.id = 0;
            game.input.setStatus(this.action, false);
        }
    },
    onTouchMove: function(id, x, y) {
        if (this.id == id) {
            this.in = this.is_in(x, y);
            if (!this.in) this.leaved = true;
        }
    },
    draw: function() {
        return;
        var color = "rgba(0, 0, 0, 0.7)";
        if (this.state) {
            color = "rgba(255, 255, 255, 0.7)";
            if (!this.in) color = "rgba(255, 0, 0, 0.7)";
        }
        game.gfx.fillRect(this.x, this.y, this.width, this.height, color);
    }
});

game.Font = Jay.extend({
    init: function(family, size, style) {
        this.family = family;
        this.size = size;
        this.font = size + 'px ' + family;
        this.style = style;
        this.rect = new game.Rect(0, 0, 0, size);
        this.text = null;
    },
    setAnchor: function(anchor) {
        this.rect.anchor = anchor;
    },
    setText: function(text) {
        this.text = text;
        this.rect.width = game.gfx.measureText(text, this.font);
    },
    drawText: function(x, y, color) {
        if (this.text === null) return;
        var r = this.rect;
        r.x = x;
        r.y = y;
        game.gfx.drawText(this.text, r.getX(), r.getY(), this.font, color, 'top');
    }
});

game.Panel = Jay.extend({
    init: function() {
        var spritesheet = game.loader.getResource("spritesheet");
        this.num_font = {
            image: spritesheet,
            ox: 0,
            oy: 0,
            tw: 24,
            th: 32,
            cols: 12
        };
        this.score_font = {
            image: spritesheet,
            ox: 0,
            oy: 32,
            tw: 32,
            th: 44,
            cols: 10
        };
        this.score_glow = {
            image: spritesheet,
            ox: 0,
            oy: 84,
            tw: 84,
            th: 84,
            cols: 4
        };
        this.etincelle = {
            image: spritesheet,
            ox: 322,
            oy: 0,
            tw: 16,
            th: 16,
            cols: 1
        };
        this.mun = {
            image: spritesheet,
            ox: 128,
            oy: 176,
            tw: 48,
            th: 64,
            cols: 2
        };
        this.keys = {
            image: spritesheet,
            ox: 0,
            oy: 176,
            tw: 32,
            th: 48,
            cols: 4
        };
        this.score_anim = [1, 2, 3, 2];
        this.score_anim_len = this.score_anim.length;
    },
    padNum: function(v, n) {
        var s = "0000" + v;
        return s.substring(s.length - n);
    },
    formatTime: function(n) {
        var s = Math.ceil(n);
        return this.padNum(Math.floor(s / 60), 2) + ':' + this.padNum(s % 60, 2);
    },
    drawNum: function(tileset, text, x, y, dx) {
        var px = x - (text.length * dx) / 2;
        y -= tileset.th / 2;
        for (var i = 0; i < text.length; i++, px += dx) {
            var pic = text.charAt(i) == ':' ? 11 : text.charCodeAt(i) - 48;
            game.gfx.drawTile(tileset, pic, px, y);
        }
    },
    drawMun: function(r, mun_pic, mun_count) {
        var r, cx, cy;
        cy = r.y + r.h / 2;
        cx = r.x + r.w / 2;
        game.gfx.drawTile(this.mun, mun_pic, r.x + r.w * 0.75 - this.mun.tw / 2, cy - this.mun.th / 2);
        this.drawNum(this.num_font, mun_count + '', r.x + r.w * 0.32, cy, 24);
    },
    drawScore: function(r, value) {
        this.drawNum(this.score_font, this.padNum(value, 4), r.x + r.w / 2, r.y + r.h / 2, 32);
    },
    draw: function(tick, map, player) {
        game.gfx.saveContext();
        var gren = player.items.gren;
        this.drawMun(game.regions.grenades, 0, gren);
        var dyna = player.items.dyna;
        this.drawMun(game.regions.dynamites, 1, dyna);
        var r = game.regions.keys;
        var py = r.y + (r.h - this.keys.th) / 2;
        var dx = this.keys.tw * 0.85;
        var px = r.x + (r.w - 4 * dx) / 2 + dx / 2 - this.keys.tw / 2;
        if (player.items['key-y']) game.gfx.drawTile(this.keys, 3, px + 0 * dx, py);
        if (player.items['key-b']) game.gfx.drawTile(this.keys, 2, px + 1 * dx, py);
        if (player.items['key-r']) game.gfx.drawTile(this.keys, 1, px + 2 * dx, py);
        if (player.items['key-g']) game.gfx.drawTile(this.keys, 0, px + 3 * dx, py);
        var r = game.regions.glowing_score;
        this.drawScore(game.regions.current_score, player.score);
        this.drawScore(game.regions.total_score, map.score);
        if (player.score >= map.score) game.gfx.drawTile(this.score_glow, this.score_anim[(tick >> 1) % this.score_anim_len], r.x + (r.w - this.score_glow.tw) / 2, r.y + (r.h - this.score_glow.th) / 2);
        else game.gfx.drawTile(this.score_glow, 0, r.x + (r.w - this.score_glow.tw) / 2, r.y + (r.h - this.score_glow.th) / 2);
        var m_ox = 16,
            m_size = 2 * 584 - m_ox,
            my = 935;
        var time_ratio = player.mtime / map.time;
        var m_t = m_size - m_size * time_ratio;
        var mx = m_ox + m_t;
        game.gfx.fillRect(mx + 10, my + 5, m_size - m_t, 2, '#990000');
        game.gfx.fillRect(mx + 10, my + 7, m_size - m_t + 2, 2, '#330000');
        var ex = m_ox + m_size;
        var ey = my + 29;
        if (time_ratio > 0.3) game.gfx.drawTile(game.images.rb_relax, 0, ex + 11, ey - 66 - 64);
        else if (time_ratio > 0.15) game.gfx.drawTile(game.images.rb_anxious, 0, ex + 11, ey - 66 - 64);
        else game.gfx.drawTile(game.images.rb_scared, 0, ex + 11, ey - 66 - 64);
        game.gfx.drawTile(game.images.rb_body, 0, ex, ey - 66);
        game.gfx.drawTile(game.images.etincelle, (tick) % 6, mx + 4, my + 2);
        var r = game.regions.time;
        this.drawNum(this.num_font, this.formatTime(player.mtime), r.x + r.w / 2, r.y + r.h / 2, 24);
        game.gfx.restoreContext();
    }
});

game.FinalScore = game.Rect.extend({
    init: function() {
        var vh = game.const.height * 13 / 15;
        var height = vh * 0.3;
        var width = game.const.width;
        this._super(game.Rect, "init", [0, (vh - height) / 2, width, height]);
        this.titleFont = new game.Font('Arial', 50);
        this.titleFont.setText("Congratulations :-)");
        this.titleFont.setAnchor({
            x: 0.5,
            y: 0.5
        });
        this.textFont = new game.Font('Arial', 30);
        this.textFont.setAnchor({
            x: 0.5,
            y: 0.5
        });
        this.totalFont = new game.Font('Arial', 42);
        this.totalFont.setAnchor({
            x: 0.5,
            y: 0.5
        });
        this.score = 0;
        this.bonus = 0;
        this.opacity = 0;
        this.cx = width / 2;
        this.visible = false;
    },
    showPanel: function(score) {
        this.visible = true;
        this.score = score;
        this.bonus = 0;
    },
    updateBonus: function(bonus) {
        this.bonus += bonus;
    },
    getTotal: function() {
        return this.score + this.bonus;
    },
    draw: function() {
        if (!this.visible) return;
        this.opacity += 0.02;
        if (this.opacity > 1) this.opacity = 1;
        game.gfx.fillRect(this.x, this.y, this.width, this.height, "rgba(0,0,0," + this.opacity * 0.6 + ")");
        this.titleFont.drawText(this.cx + 3, this.y + 40 + 3, "rgba(0,0,0," + this.opacity + ")");
        this.titleFont.drawText(this.cx, this.y + 40, "rgba(255,153,0," + this.opacity + ")");
        this.textFont.setText("Points: " + this.score);
        this.textFont.drawText(this.cx + 2, this.y + 100 + 2, "rgba(0, 0, 0," + this.opacity + ")");
        this.textFont.drawText(this.cx, this.y + 100, "rgba(255,255,255," + this.opacity + ")");
        this.textFont.setText("Time bonus: " + this.bonus);
        this.textFont.drawText(this.cx + 2, this.y + 140 + 2, "rgba(0, 0, 0," + this.opacity + ")");
        this.textFont.drawText(this.cx, this.y + 140, "rgba(255,255,255," + this.opacity + ")");
        this.totalFont.setText("Total score: " + this.getTotal());
        this.totalFont.drawText(this.cx + 3, this.y + 210 + 3, "rgba(0, 0, 0," + this.opacity + ")");
        this.totalFont.drawText(this.cx, this.y + 210, "rgba(255,153,0," + this.opacity + ")");
    }
});

game.MapTitle = game.Rect.extend({
    init: function(map) {
        var vh = game.const.height * 13 / 15;
        var height = vh * 0.2;
        var width = game.const.width;
        this.helpHeight = vh * 0.5;
        this.helpTop = (vh - this.helpHeight) / 2;
        this._super(game.Rect, "init", [0, (vh - height) / 2, width, height]);
        this.mapname = map.name;
        this.author = "By " + map.author;
        this.titleFont = new game.Font('Arial', 50);
        this.titleFont.setAnchor({
            x: 0.5,
            y: 0.5
        });
        this.textFont = new game.Font('Arial', 26);
        this.textFont.setText(this.author);
        this.textFont.setAnchor({
            x: 0.5,
            y: 0.5
        });
        this.helpFont = new game.Font('Arial', 26);
        this.bigHelpFont = new game.Font('Arial', 36);
        this.bigHelpFont.setAnchor({
            x: 0.5,
            y: 0.5
        });
        this.smallHelpFont = new game.Font('Arial', 18);
        this.smallHelpFont.setAnchor({
            x: 0.5,
            y: 0.5
        });
        this.opacity = 1;
        this.opacity_step = 0;
        this.cx = width / 2;
        this.visible = true;
        this.rightHelp = ["[ESC] Exit", "[P] Pause", "[K] Restart level", "[F11] Full screen"];
        this.leftHelp = ["[Arrows] Move or push", "[D] Drop dynamites", "[G or CTRL] Drop grenades", "[CTRL + Arrows] Eat or push without moving"];
    },
    hidePanel: function(score) {
        this.opacity_step = -0.1;
    },
    showTitle: function(x, y, text, o) {
        this.titleFont.setText(text);
        this.titleFont.drawText(x + 3, y + 3, "rgba(0,0,0," + o + ")");
        this.titleFont.drawText(x, y, "rgba(255,153,0," + o + ")");
    },
    showHelp: function() {
        game.gfx.fillRect(this.x, this.helpTop, this.width, this.helpHeight, "rgba(0,0,0,0.8)");
        this.showTitle(this.cx, this.helpTop + 50, "Help", 1);
        this.bigHelpFont.setText("Collect diamonds to get the required score and find the exit door");
        this.bigHelpFont.drawText(this.cx, this.helpTop + 138, "rgba(192,192,192,1)");
        this.helpFont.setAnchor({
            x: 0,
            y: 0.5
        });
        var keysTop = this.y + 110;
        for (var i = 0; i < this.leftHelp.length; i++) {
            this.helpFont.setText(this.leftHelp[i]);
            this.helpFont.drawText(this.cx / 6, keysTop + 38 * i, "rgba(192,192,192,1)");
        }
        for (var i = 0; i < this.rightHelp.length; i++) {
            this.helpFont.setText(this.rightHelp[i]);
            this.helpFont.drawText(this.cx + this.cx / 6, keysTop + 38 * i, "rgba(192,192,192,1)");
        }
    },
    draw: function() {
        if (game.input.keyStatus('help')) {
            this.showHelp();
        } else {
            if (!this.visible) return;
            this.opacity += this.opacity_step;
            if (this.opacity <= 0) {
                this.opacity = 0;
                this.visible = false;
            }
            game.gfx.fillRect(this.x, this.y, this.width, this.height, "rgba(0,0,0," + this.opacity * 0.6 + ")");
            this.showTitle(this.cx, this.y + 38, this.mapname, this.opacity);
            this.textFont.drawText(this.cx + 2, this.y + 92 + 2, "rgba(0, 0, 0," + this.opacity + ")");
            this.textFont.drawText(this.cx, this.y + 92, "rgba(255,255,255," + this.opacity + ")");
            if (game.settings.playmode != 'replay') {
                this.helpFont.setAnchor({
                    x: 0.5,
                    y: 0.5
                });
                this.smallHelpFont.setText("Press H to view help");
                this.smallHelpFont.drawText(this.cx, this.y + 145, "rgba(128,128,128," + this.opacity + ")");
            } else {
                this.bigHelpFont.setText("Replay from " + game.settings.player);
                this.bigHelpFont.drawText(this.cx, this.y + 140, "rgba(255,192,0," + this.opacity + ")");
            }
        }
    }
});

game.Tile = Jay.extend({
    init: function(id) {
        this.id = id;
        this.pic_index = 0;
        this.cpt = 0;
        this.show_unstable = false;
        this.dir = -1;
        this.anim_cpt = 0;
    },
    getPic: function(animtick) {
        var def = game.tilesdef[this.id];
        if (typeof def == 'undefined') alert("Undefined tiledef for " + this.id);
        if (def.anim) {
            var pic = def.anim.pics[this.anim_cpt];
            if (animtick % def.anim.modulo == def.anim.modulo - 1) {
                this.anim_cpt++;
                if (this.anim_cpt == def.anim.nbpic) this.anim_cpt = 0;
            }
            return pic;
        }
        if (def.cycle) return def.pics[animtick % def.pics.length];
        else if (this.show_unstable && typeof def.unstable_pics != 'undefined') return def.unstable_pics[(animtick >> 3) % def.unstable_pics.length];
        else return def.pics[this.pic_index];
    },
    getDef: function() {
        return game.tilesdef[this.id];
    },
    heavy: function() {
        return this.getDef().heavy;
    },
    clear: function() {
        this.id = 0;
    },
    setPicIndex: function(i) {
        this.pic_index = i;
    },
    turnRight: function() {
        if ((this.id & 3) == 3) this.id -= 3;
        else this.id = (this.id - 0) + 1;
    },
    turnLeft: function() {
        if ((this.id & 3) == 0) this.id = (this.id - 0) + 3;
        else this.id -= 1;
    },
    die: function() {
        this.morph(16);
    },
    morph: function(id) {
        this.id = id;
        this.pic_index = 0;
        this.cpt = 0;
        this.anim_cpt = 0;
        this.falling = false;
    },
    clearTemp: function() {
        this.morph(1);
    }
});

game.View = Jay.extend({
    init: function(cols, rows, tileset) {
        this.cols = cols;
        this.rows = rows;
        this.tw = tileset.tw;
        this.th = tileset.th;
        this.width = cols * this.tw;
        this.height = rows * this.th;
        this.tileset = tileset;
        this.player_x = 0;
        this.player_y = 0;
        this.sc_mx = 0;
        this.sc_my = 0;
        this.sc_row_min = 0;
        this.sc_row_max = 0;
        this.sc_col_min = 0;
        this.sc_col_max = 0;
        this.sc_ex = 0;
        this.sc_ey = 0;
        this.sc_sx = 0;
        this.sc_sy = 0;
        this.sc_dir = 0;
        this.sc_col = 0;
        this.sc_row = 0;
        this.sc_tile = null;
        this.dt_dir = 0;
        this.dt_pic = 0;
        this.dt_ofx = 0;
        this.dt_ofy = 0;
        this.offset = 0;
    },
    draw: function(map, pos, animtick, movetick, player_alive) {
        this.player = map.getTile(pos);
        this.animtick = animtick;
        this.player_y = Math.floor(pos / map.cols);
        this.player_x = pos % map.cols;
        this.sc_dir = player_alive ? this.player.dir : -1;
        this.offset = (game.const.tick_divider - movetick - 1) * (this.tw / game.const.tick_divider);
        this.ofx = this.ofy = 0;
        if (this.sc_dir == 0) this.ofy = -this.offset;
        else if (this.sc_dir == 1) this.ofx = this.offset;
        else if (this.sc_dir == 2) this.ofy = this.offset;
        else if (this.sc_dir == 3) this.ofx = -this.offset;
        this.sc_ex = this.player_x + Math.ceil(this.cols / 2);
        this.sc_ey = this.player_y + Math.ceil(this.rows / 2);
        if (this.sc_dir == 0 && this.sc_ey >= map.rows) this.ofy = 0;
        else if (this.sc_dir == 1 && this.sc_ex > map.cols) this.ofx = 0;
        else if (this.sc_dir == 2 && this.sc_ey > map.rows) this.ofy = 0;
        else if (this.sc_dir == 3 && this.sc_ex >= map.cols) this.ofx = 0;
        if (this.sc_ex > map.cols) {
            this.sc_ex = map.cols;
        }
        if (this.sc_ey > map.rows) {
            this.sc_ey = map.rows;
        }
        this.sc_sx = this.sc_ex - this.cols;
        this.sc_sy = this.sc_ey - this.rows;
        if (this.sc_dir == 0 && this.sc_sy < 0) this.ofy = 0;
        else if (this.sc_dir == 1 && this.sc_sx < 1) this.ofx = 0;
        else if (this.sc_dir == 2 && this.sc_sy < 1) this.ofy = 0;
        else if (this.sc_dir == 3 && this.sc_sx < 0) this.ofx = 0;
        if (this.sc_sx < 0) {
            this.sc_sx = 0;
        }
        if (this.sc_sy < 0) {
            this.sc_sy = 0;
        }
        this.player_x -= this.sc_sx;
        this.player_y -= this.sc_sy;
        this.sc_row_min = 0;
        this.sc_row_max = this.rows;
        this.sc_col_min = 0;
        this.sc_col_max = this.cols;
        if (this.ofx > 0) {
            this.sc_col_min--;
            this.sc_sx--;
        } else if (this.ofx < 0) {
            this.sc_col_max++;
        }
        if (this.ofy > 0) {
            this.sc_row_min--;
            this.sc_sy--;
        } else if (this.ofy < 0) {
            this.sc_row_max++;
        }
        this.sc_col = this.player_x;
        this.sc_row = this.player_y;
        this.sc_tile = this.player;
        this.drawTile();
        this.sc_my = this.sc_sy * map.cols;
        for (this.sc_row = this.sc_row_min; this.sc_row < this.sc_row_max; this.sc_row++, this.sc_my += map.cols) {
            this.sc_mx = this.sc_sx;
            for (this.sc_col = this.sc_col_min; this.sc_col < this.sc_col_max; this.sc_col++, this.sc_mx++) {
                this.sc_tile = map.getTile(this.sc_my + this.sc_mx);
                if (this.sc_tile.id == 0) continue;
                if (this.sc_tile === this.player) continue;
                this.drawTile();
            }
        }
    },
    drawTile: function() {
        this.dt_dir = this.sc_tile.dir;
        this.dt_pic = this.sc_tile.getPic(this.animtick);
        if (this.dt_dir >= 0) {
            this.dt_ofx = this.dt_ofy = 0;
            if (this.dt_dir == 0) this.dt_ofy = this.offset;
            else if (this.dt_dir == 1) this.dt_ofx = -this.offset;
            else if (this.dt_dir == 2) this.dt_ofy = -this.offset;
            else if (this.dt_dir == 3) this.dt_ofx = this.offset;
            this.dt_ofx += this.ofx;
            this.dt_ofy += this.ofy;
            game.gfx.drawTile(this.tileset, this.dt_pic, this.sc_col * this.tw + this.dt_ofx, this.sc_row * this.th + this.dt_ofy);
        } else {
            game.gfx.drawTile(this.tileset, this.dt_pic, this.sc_col * this.tw + this.ofx, this.sc_row * this.th + this.ofy);
        }
    }
});

game.Map = Jay.extend({
    init: function(json) {
        this.explo_x = [-1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, 2, 2, 2, -1, 0, 1, -2, -2, -2];
        this.explo_y = [-1, -1, -1, 0, 0, 0, 1, 1, 1, -2, -2, -2, -1, 0, 1, 2, 2, 2, -1, 0, 1];
        this.transfo = {
            bombe: {
                sound: 'explosion',
                explo: 'small'
            },
            largebombe: {
                sound: 'explosion',
                explo: 'large'
            },
            grenade: {
                sound: 'grenade',
                tiles: [24]
            },
            disapear: {
                sound: 'crush',
                tiles: [16]
            },
            oeuf1vert: {
                sound: 'oeuf',
                tiles: [40]
            },
            oeuf2vert: {
                sound: 'oeuf',
                tiles: [128]
            },
            oeuf1rouge: {
                sound: 'oeuf',
                tiles: [42]
            },
            oeuf2rouge: {
                sound: 'oeuf',
                tiles: [132]
            },
            oeuf1bleu: {
                sound: 'oeuf',
                tiles: [18]
            },
            oeuf2bleu: {
                sound: 'oeuf',
                tiles: [136]
            },
            oeuf1jaune: {
                sound: 'oeuf',
                tiles: [44]
            },
            oeuf2jaune: {
                sound: 'oeuf',
                tiles: [140]
            },
            pepite1: {
                sound: 'oeuf',
                tiles: [26]
            },
            pepite2: {
                sound: 'oeuf',
                tiles: [52]
            },
            papillon: {
                sound: 'crush',
                tiles: [50, 51, 50, 51, 50, 51, 50, 51, 50]
            },
            scarabe: {
                sound: 'crush',
                tiles: [51, 51, 51, 51, 51, 51, 51, 51, 51]
            },
            guepe: {
                sound: 'crush',
                tiles: [9, 25, 9, 25, 9, 25, 9, 25, 9]
            },
            limace: {
                sound: 'crush',
                tiles: [16, 16, 16, 16, 16, 16, 16, 16, 16]
            },
            sandrock: {
                sound: 'oeuf',
                tiles: [46]
            },
            sandrock2: {
                sound: 'oeuf',
                tiles: [47]
            },
            sandrock3: {
                sound: 'crush',
                tiles: [16]
            },
            detonateur: {
                sound: 'grenade',
                tiles: [14]
            }
        };
        this.id = json.id;
        this.author = json.author;
        this.cols = json.width - 0;
        this.rows = json.height - 0;
        this.name = json.name;
        this.score = json.score - 0;
        this.time = json.time - 0;
        this.data = json.data;
        this.reset();
    },
    update_data: function() {
        this.data = [];
        for (var i = 0; i < this.tiles.length; i++) this.data.push(this.tiles[i].id);
    },
    clone: function() {
        var json = {
            id: this.id,
            author: this.author,
            width: this.cols,
            height: this.rows,
            name: this.name,
            score: this.score,
            time: this.time,
            data: this.data.join(',')
        };
        return new game.Map(json);
    },
    reset: function() {
        this.tiles = [];
        for (var i = 0; i < this.data.length; i++) this.tiles[i] = new game.Tile(this.data[i]);
        this.score_done = false;
        this.glue_cnt = 0;
        this.next_tick = {
            detonateur: false,
            clone: 0,
            tg_verte: 0,
            tg_rouge: 0,
            tg_bleue: 0,
            tg_jaune: 0
        };
        this.cur_tick = {};
    },
    get: function() {
        var map = {
            map_id: this.id,
            map_name: this.name,
            map_width: this.cols,
            map_height: this.rows,
            map_score: this.score,
            map_time: this.time,
            map_data: this.serialize()
        };
        return map;
    },
    serialize: function() {
        var data = [];
        var n = this.cols * this.rows;
        for (var i = 0; i < n; i++) data.push(this.tiles[i].id);
        return data.join(',');
    },
    findPlayer: function() {
        var n = this.cols * this.rows;
        for (var i = 0; i < n; i++) {
            if (this.tiles[i].id == 100) return i;
        }
        return -1;
    },
    setTile: function(pos, tile) {
        this.tiles[pos] = tile;
    },
    getTile: function(pos) {
        return this.tiles[pos];
    },
    isEmpty: function(pos) {
        return this.getTile(pos).id == 0;
    },
    isPlayer: function(pos) {
        return this.getTile(pos).id == 100;
    },
    getUpTile: function(pos) {
        return this.getTile(pos - this.cols);
    },
    getRightTile: function(pos) {
        return this.getTile(pos + 1);
    },
    getDownTile: function(pos) {
        return this.getTile(pos + this.cols);
    },
    getLeftTile: function(pos) {
        return this.getTile(pos - 1);
    },
    getFrontPos: function(pos, dir) {
        if (dir == 0) return pos - this.cols;
        if (dir == 1) return pos + 1;
        if (dir == 2) return pos + this.cols;
        return pos - 1;
    },
    getLeftPos: function(pos, dir) {
        return this.getFrontPos(pos, (dir + 3) % 4);
    },
    getRightPos: function(pos, dir) {
        return this.getFrontPos(pos, (dir + 1) % 4);
    },
    heatTile: function(pos) {
        var t = this.getTile(pos);
        t.dir = -1;
        var def = t.getDef();
        if (def.heattrans) this.applyTrans(pos, def.heattrans);
        else if (def.onheat) {
            t.morph(def.onheat);
            t.done = true;
        }
    },
    explodeTile: function(pos) {
        var t = this.getTile(pos);
        t.dir = -1;
        var def = t.getDef();
        if (def.indestructible) return false;
        if (def.onexp) {
            t.morph(def.onexp);
            t.done = true;
            return false;
        }
        t.morph(15);
        t.done = true;
        return true;
    },
    applyTrans: function(pos, trans_name) {
        var trans = this.transfo[trans_name];
        if (trans.sound) this.registerSound(trans.sound, pos);
        if (trans.explo == 'large') {
            if (this.explodeTile(pos - this.cols)) this.explodeTile(pos - 2 * this.cols);
            if (this.explodeTile(pos + 1)) this.explodeTile(pos + 2);
            if (this.explodeTile(pos + this.cols)) this.explodeTile(pos + 2 * this.cols);
            if (this.explodeTile(pos - 1)) this.explodeTile(pos - 2);
            if (this.explodeTile(pos - this.cols + 1)) {
                this.explodeTile(pos - 2 * this.cols + 1);
                this.explodeTile(pos - this.cols + 2);
            }
            if (this.explodeTile(pos + this.cols + 1)) {
                this.explodeTile(pos + 2 * this.cols + 1);
                this.explodeTile(pos + this.cols + 2);
            }
            if (this.explodeTile(pos + this.cols - 1)) {
                this.explodeTile(pos + 2 * this.cols - 1);
                this.explodeTile(pos + this.cols - 2);
            }
            if (this.explodeTile(pos - this.cols - 1)) {
                this.explodeTile(pos - 2 * this.cols - 1);
                this.explodeTile(pos - this.cols - 2);
            }
            var t = this.getTile(pos);
            t.morph(15);
            t.dir = -1;
            t.done = true;
        } else if (trans.explo == 'small') {
            this.explodeTile(pos - this.cols);
            this.explodeTile(pos - this.cols + 1);
            this.explodeTile(pos + 1);
            this.explodeTile(pos + this.cols + 1);
            this.explodeTile(pos + this.cols);
            this.explodeTile(pos + this.cols - 1);
            this.explodeTile(pos - 1);
            this.explodeTile(pos - this.cols - 1);
            var t = this.getTile(pos);
            t.morph(15);
            t.dir = -1;
            t.done = true;
        } else {
            var tiles = trans.tiles;
            for (var i = 0; i < tiles.length; i++) {
                var j = tiles.length == 1 ? 4 : i;
                var t = this.getTile(pos + this.explo_y[j] * this.cols + this.explo_x[j]);
                var def = t.getDef();
                if (def.indestructible) continue;
                if (def.onexp && i != 4) {
                    t.morph(def.onexp);
                    if (def.onexp == 24) t.cpt = 5;
                } else t.morph(tiles[i]);
                t.dir = -1;
                t.done = true;
            }
        }
    },
    moveTile: function(pos1, pos2) {
        var t = this.tiles[pos2];
        this.tiles[pos2] = this.tiles[pos1];
        this.tiles[pos1] = t;
        t.clearTemp();
        return this.tiles[pos2];
    },
    registerSound: function(sound_name, pos) {
        var x = pos % this.cols;
        var y = Math.floor(pos / this.cols);
        var dx = this.playerPos.x - x;
        var dy = this.playerPos.y - y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 20) {
            var panzone = 20;
            var pan = dx < 0 ? Math.max(-0.75, dx / panzone) : Math.min(0.75, dx / panzone);
            if (d < 2) v = 1;
            else v = 1 / d;
            this.sounds[sound_name] = {
                volume: v,
                pan: -pan
            };
        }
    },
    process: function(player, tick) {
        for (k in this.next_tick) {
            this.cur_tick[k] = this.next_tick[k];
        }
        this.next_tick.tg_verte = 1;
        this.next_tick.tg_rouge = 1;
        this.next_tick.tg_bleue = 1;
        this.next_tick.tg_jaune = 1;
        this.next_tick.detonateur = false;
        this.next_tick.clone = 0;
        this.playerPos = {
            x: player.pos % this.cols,
            y: Math.floor(player.pos / this.cols)
        };
        this.tick = tick;
        if (!this.score_done && player.score >= this.score && player.alive) {
            this.score_done = true;
            game.audio.play('score');
        }
        this.sounds = {};
        var r, c, p, t, algo;
        for (r = (this.rows - 2) * this.cols; r > 0; r -= this.cols) {
            for (c = this.cols - 2; c > 0; c--) {
                p = r + c;
                t = this.getTile(p);
                if (t.done) continue;
                t.done = true;
                if (game.tilesdef[t.id]) {
                    algo = game.tilesdef[t.id].algo;
                    if (algo) this[algo](p, t);
                }
            }
        }
        for (r = (this.rows - 2) * this.cols; r > 0; r -= this.cols) {
            for (c = this.cols - 2; c > 0; c--) {
                p = r + c;
                if (this.tiles[p].id == 1) this.tiles[p].id = 0;
                this.tiles[p].done = false;
            }
        }
        for (var name in this.sounds) {
            var s = this.sounds[name];
            game.audio.play(name, s.volume, s.pan);
        }
    },
    reset_tile_dir: function() {
        var r, c, p, t;
        for (r = (this.rows - 2) * this.cols; r > 0; r -= this.cols) {
            for (c = this.cols - 2; c > 0; c--) {
                p = r + c;
                t = this.getTile(p);
                t.dir = -1;
            }
        }
    },
    exit: function(p, t) {
        if (this.score_done) t.id = 102;
    },
    activegren: function(p, t) {
        if (t.cpt++ >= 5) this.applyTrans(p, 'bombe');
        else this.chutte(p, t);
    },
    activedetonateur: function(p, t) {
        this.next_tick.detonateur = true;
        if (this.getUpTile(p).id == 0) t.morph(13);
        this.chutte(p, t);
    },
    activedyna: function(p, t) {
        if (this.cur_tick.detonateur) this.applyTrans(p, 'largebombe');
        else this.chutte(p, t);
    },
    glue_verte: function(p, t) {
        if (this.cur_tick.tg_verte == 1) t.morph(50);
        else if (this.glue(p, t, false)) this.next_tick.tg_verte = 0;
    },
    glue_rouge: function(p, t) {
        if (this.cur_tick.tg_rouge == 1) t.morph(23);
        else if (this.glue(p, t, true)) this.next_tick.tg_rouge = 0;
    },
    glue_bleue: function(p, t) {
        if (this.cur_tick.tg_bleue == 1) t.morph(51);
        else if (this.glue(p, t, false)) this.next_tick.tg_bleue = 0;
    },
    glue_jaune: function(p, t) {
        if (this.cur_tick.tg_jaune == 1) {
            if ((Math.floor(p / this.cols) + p % this.cols) & 1) t.morph(25);
            else t.morph(26);
        } else if (this.glue(p, t, true)) this.next_tick.tg_jaune = 0;
    },
    glue_expand_positions: function(p) {
        var possibleMove = [];
        if (this.getTile(p - this.cols).getDef().glueprog) possibleMove.push(p - this.cols);
        if (this.getTile(p + 1).getDef().glueprog) possibleMove.push(p + 1);
        if (this.getTile(p + this.cols).getDef().glueprog) possibleMove.push(p + this.cols);
        if (this.getTile(p - 1).getDef().glueprog) possibleMove.push(p - 1);
        return possibleMove;
    },
    glue: function(p, t, fast) {
        this.glue_cnt++;
        var possibleMove = this.glue_expand_positions(p);
        if (possibleMove.length) {
            if ((fast ? this.tick & 0xF : this.tick & 0x1F) == 0) {
                var x = p % this.cols;
                var y = Math.floor(p / this.cols);
                var cpt = ((x + y) % (3 + (this.glue_cnt % 8)));
                var newPos = possibleMove[cpt % possibleMove.length];
                var nt = this.getTile(newPos);
                nt.morph(t.id);
                nt.done = true;
            }
            return true;
        }
        return false;
    },
    fiollechoc: function(p, t) {
        var id = t.id;
        if (id == 74) {
            t.morph(70);
            if (this.glue_expand_positions(p).length > 0) this.next_tick.tg_verte = 0;
        } else if (id == 75) {
            t.morph(71);
            if (this.glue_expand_positions(p).length > 0) this.next_tick.tg_rouge = 0;
        } else if (id == 76) {
            t.morph(72);
            if (this.glue_expand_positions(p).length > 0) this.next_tick.tg_bleue = 0;
        } else if (id == 77) {
            t.morph(73);
            if (this.glue_expand_positions(p).length > 0) this.next_tick.tg_jaune = 0;
        }
        this.registerSound('crush', p);
    },
    cf_penebombe: function(p, t) {
        var t1 = this.getTile(p + this.cols);
        if (!t1.getDef().indestructible) {
            var t2 = this.getTile(p + 2 * this.cols);
            if (!t2.getDef().indestructible) {
                t.morph(34);
                t1.morph(1);
                t2.morph(12);
                this.registerSound('grenade', p);
            } else t.morph(35);
        } else t.morph(35);
    },
    chutte: function(p, t) {
        var p2 = p + this.cols;
        var id = this.tiles[p2].id;
        if (id == 0) {
            this.tiles[p].falling = true;
            this.tiles[p].dir = 2;
            this.moveTile(p, p2);
        } else {
            t.show_unstable = false;
            t = this.getTile(p);
            var def = t.getDef();
            if (t.falling) {
                t.falling = false;
                t.dir = -1;
                var s = def.choc;
                if (s) this.registerSound(s, p);
                if (def.stopfunc) this[def.stopfunc](p, t);
                else if (def.stoptrans) this.applyTrans(p, def.stoptrans);
                t = this.getTile(p2);
                def = t.getDef();
                if (def.crushfunc) this[def.crushfunc](p2, t);
                else if (def.crushtrans) this.applyTrans(p2, def.crushtrans);
            } else if (game.tilesdef[id].unstable) {
                var unstable = function(obj, p1, p2) {
                    var t1 = obj.getTile(p1).id;
                    var t2 = obj.getTile(p2).id;
                    if (t1 == 0 && t2 == 0) return true;
                    if ((t1 <= 1 && t2 == 100) || (t1 == 100 && t2 <= 1)) t.show_unstable = true;
                    return false;
                };
                if (unstable(this, p - 1, p2 - 1)) {
                    t.dir = 3;
                    this.moveTile(p, p - 1);
                } else if (unstable(this, p + 1, p2 + 1)) {
                    t.dir = 1;
                    this.moveTile(p, p + 1);
                } else {
                    t.dir = -1;
                }
            }
        }
    },
    penebombe: function(p, t) {
        if (t.falling && this.getTile(p + this.cols).id != 0) this.cf_penebombe(p, t);
        else this.chutte(p, t);
    },
    boulechaude: function(p, t) {
        if (t.cpt % 4 == 0) this.registerSound('boule', p);
        if (t.cpt == 32) {
            t.morph(27);
        } else {
            this.heatTile(p - this.cols);
            this.heatTile(p + 1);
            this.heatTile(p + this.cols);
            this.heatTile(p - 1);
        }
        t.cpt++;
        this.chutte(p, t);
    },
    scarabe: function(p, t) {
        this.bete(p, t, true, false, 'scarabe');
    },
    limace: function(p, t) {
        this.bete(p, t, false, true, 'limace');
    },
    papillon: function(p, t) {
        this.bete(p, t, true, true, 'papillon');
    },
    guepe: function(p, t) {
        this.bete(p, t, false, false, 'guepe');
    },
    bete: function(p, t, slow, pap, name) {
        t.dir = -1;
        if (slow && (this.tick & 1) != 0) return;
        var def = t.getDef();
        var dir = t.id & 3;
        this.registerSound(name, p);
        if (t.cpt == 1) {
            var rp = pap ? this.getRightPos(p, dir) : this.getLeftPos(p, dir);
            if (this.getTile(rp).id == 0) {
                pap ? t.turnRight() : t.turnLeft();
                t.cpt = 0;
            } else {
                var fp = this.getFrontPos(p, dir);
                if (this.isPlayer(fp)) {
                    this.applyTrans(p, name);
                } else if (this.isEmpty(fp)) {
                    t.dir = dir;
                    this.moveTile(p, fp);
                    t.cpt = 1;
                } else {
                    pap ? t.turnLeft() : t.turnRight();
                    t.cpt = 0;
                }
            }
        } else {
            var fp = this.getFrontPos(p, dir);
            if (this.isPlayer(fp)) {
                this.applyTrans(p, name);
            } else if (this.isEmpty(fp)) {
                t.dir = dir;
                this.moveTile(p, fp);
                t.cpt = 1;
            } else {
                var rp = pap ? this.getRightPos(p, dir) : this.getLeftPos(p, dir);
                if (this.getTile(rp).id == 0) {
                    pap ? t.turnRight() : t.turnLeft();
                    t.cpt = 0;
                } else {
                    pap ? t.turnLeft() : t.turnRight();
                    t.cpt = 0;
                }
            }
        }
    },
    autoexp: function(p, t) {
        var t = this.getTile(p);
        var def = t.getDef();
        this.applyTrans(p, 'bombe');
    },
    autoexplarge: function(p, t) {
        var t = this.getTile(p);
        var def = t.getDef();
        this.applyTrans(p, 'largebombe');
    },
    crystal: function(p, t) {
        var op, trans;
        if (trans = this.getTile(op = p - this.cols).getDef().crystaltrans) this.applyTrans(op, trans);
        else if (trans = this.getTile(op = p + 1).getDef().crystaltrans) this.applyTrans(op, trans);
        else if (trans = this.getTile(op = p + this.cols).getDef().crystaltrans) this.applyTrans(op, trans);
        else if (trans = this.getTile(op = p - 1).getDef().crystaltrans) this.applyTrans(op, trans);
        else this.chutte(p, t);
    },
    explo: function(p, t) {
        var def = t.getDef();
        t.cpt++;
        if (t.cpt == 4) t.clearTemp();
    },
    exitleaving: function(p, t) {
        var def = t.getDef();
        t.pic_index++;
        if (t.pic_index == def.pics.length) t.morph(102);
    },
    lave: function(p, t) {
        var ut = this.getUpTile(p);
        var def = ut.getDef();
        if (ut.id == 100) ut.morph(16);
        else if (ut.id != 15 && ut.id != 16 && ut.id != 2) ut.morph(0);
    },
    clonersource: function(p, t) {
        if ((this.tick & 0xF) == 0) {
            var ut = this.getUpTile(p);
            var def = ut.getDef();
            if (def.clonable) {
                this.next_tick.clone = ut.id;
                t.pic_index = 1;
            } else {
                this.next_tick.clone = 0;
                t.pic_index = 0;
            }
        }
    },
    clonertarget: function(p, t) {
        if (this.cur_tick.clone) {
            var dp = p + this.cols;
            var dt = this.getTile(dp);
            if (dt.id == 0) {
                dt.morph(this.cur_tick.clone);
                this.registerSound('electro', p);
            }
            t.pic_index = 1;
        } else {
            t.pic_index = 0;
        }
    }
});

game.Player = Jay.extend({
    init: function(map, onStart) {
        this.pos = map.findPlayer();
        this.map = map;
        this.map.getTile(this.pos).setPicIndex(14);
        this.start = true;
        this.alive = true;
        this.won = false;
        this.end = false;
        this.score = 0;
        this.ctrl_state = 0;
        this.dynamite_state = 0;
        this.grenade_state = 0;
        this.heavy_cnt = 0;
        this.time = map.time;
        this.mtime = map.time;
        this.rem_time = 0;
        this.millis = 0;
        this.mstep = 1 / (game.const.fps / game.const.tick_divider);
        this.items = {
            "key-g": 0,
            "key-r": 0,
            "key-b": 0,
            "key-y": 0,
            "gren": 0,
            "dyna": 0
        };
        this.selected_item = 'gren';
        this.push_cnt = 0;
        this.ready_item = false;
        this.onStart = onStart;
        this.currentDirection = -1;
        this.oldDirection = -1;
        this.directions = new game.CircularBuffer(16);
    },
    toggleDrop: function(selected_item) {
        if (selected_item == 'gren' && this.ready_item == false) this.ready_item = 'gren';
        else if (selected_item == 'dyna' && this.ready_item == false) this.ready_item = 'dyna';
        else this.ready_item = false;
    },
    readyItem: function() {
        return this.ready_item;
    },
    addItem: function(name) {
        this.items[name]++;
    },
    hasItem: function(name) {
        return this.items[name] > 0;
    },
    decItem: function(name) {
        if (this.hasItem(name)) this.items[name]--;
    },
    get_dir: function(cur_dir) {
        if (cur_dir == 0 || cur_dir == 2 || cur_dir == -1) {
            if (game.input.keyStatus('left')) return 3;
            if (game.input.keyStatus('right')) return 1;
            if (game.input.keyStatus('up')) return 0;
            if (game.input.keyStatus('down')) return 2;
            return -1;
        }
        if (game.input.keyStatus('up')) return 0;
        if (game.input.keyStatus('down')) return 2;
        if (game.input.keyStatus('left')) return 3;
        if (game.input.keyStatus('right')) return 1;
        return -1;
    },
    scan_keys: function() {
        var dir = this.get_dir(this.dir);
        if (dir != this.oldDirection) {
            this.directions.enqueue(dir);
            this.oldDirection = dir;
        }
    },
    update: function(tick) {
        if (this.start) {
            this.map.getTile(this.pos).setPicIndex((tick >> 2) % 2 == 0 ? 14 : 15);
            if (this.directions.has_data()) {
                game.audio.play('crush');
                this.map.getTile(this.pos).setPicIndex(15);
                this.start = false;
                this.onStart();
            }
            return;
        }
        if (this.alive && this.map.getTile(this.pos).id != 100) {
            game.audio.play('dead');
            this.alive = false;
            if (typeof game.settings.fail_url != 'undefined' && game.settings.playmode != 'replay') {
                var replay = game.input.getReplayRecords().join(',');
                this.rem_time = Math.round(this.mtime);
                game.ajax.call(game.settings.fail_url, 'version=' + game.settings.map.version + '&time=' + this.rem_time + '&score=' + this.score + '&replay=' + replay);
            }
        }
        if (this.alive) {
            if (this.directions.has_data()) this.dir = this.directions.dequeue();
            var player_tile = this.map.getTile(this.pos);
            var newPos = -1;
            var door = false;
            var pic = 4 + (tick >> 2 & 3);
            var ctrl = game.input.keyStatus('drop');
            var dynamite = game.input.keyStatus('dynamite');
            var grenade = game.input.keyStatus('grenade');
            player_tile.dir = -1;
            if (this.dir == 0) {
                newPos = this.pos - this.map.cols;
                pic = 4 + (tick & 3);
            } else if (this.dir == 1) {
                newPos = this.pos + 1;
                pic = (tick & 1);
            } else if (this.dir == 2) {
                newPos = this.pos + this.map.cols;
                pic = 4 + (tick & 3);
            } else if (this.dir == 3) {
                newPos = this.pos - 1;
                pic = 2 + (tick & 1);
            } else {
                var upTile = this.map.getUpTile(this.pos);
                if (upTile.heavy()) {
                    var hc = this.heavy_cnt++;
                    pic = 12;
                    if (hc >= 48) {
                        pic = 12 + (hc >> 4 & 1);
                        if ((hc & 15) == 0) game.audio.play((hc & 16) ? 'dead' : 'dead');
                    }
                } //original respi1 respi2
                else this.heavy_cnt = 0;
            }
            if (newPos >= 0) {
                var t = this.map.getTile(newPos);
                var def = t.getDef();
                if (door = def.door) {
                    if (this.hasItem(door)) {
                        if (this.dir == 0) newPos = this.pos - 2 * this.map.cols;
                        if (this.dir == 1) newPos = this.pos + 2;
                        if (this.dir == 2) newPos = this.pos + 2 * this.map.cols;
                        if (this.dir == 3) newPos = this.pos - 2;
                        t = this.map.getTile(newPos);
                        def = t.getDef();
                    }
                }
                if (t.id == 102 && !ctrl) {
                    game.audio.play('exit');
                    player_tile.morph(103);
                    this.won = true;
                    this.rem_time = Math.round(this.mtime);
                    this.alive = false;
                    this.map.moveTile(this.pos, newPos);
                    if (door) game.audio.play('porte');
                    if (game.settings.stats) ga('send', 'event', 'webgame', 'complete', game.settings.map_ref + "." + this.map.id);
                    return;
                } else if (def.eatable) {
                    if (def.item) this.addItem(def.item);
                    if (def.time) {
                        this.time = this.mtime = this.map.time;
                        this.millis = 0;
                    }
                    if (def.miam) game.audio.play(def.miam);
                    if (def.score) this.score += def.score;
                    if (ctrl) {
                        t.morph(0);
                        this.ctrl_state = 2;
                        this.push_cnt = 0;
                    } else {
                        if (door) game.audio.play('porte');
                        this.map.moveTile(this.pos, newPos);
                        if (this.readyItem() == 'gren') {
                            this.map.getTile(this.pos).morph(24);
                            this.decItem('gren');
                        } else if (this.readyItem() == 'dyna') {
                            this.map.getTile(this.pos).morph(20);
                            this.decItem('dyna');
                        }
                        this.toggleDrop(false);
                        this.pos = newPos;
                        player_tile.dir = this.dir;
                        this.push_cnt = 0;
                    }
                } else {
                    if (def.pushable) {
                        var p2;
                        if (this.dir == 1) p2 = this.pos + (door ? 3 : 2);
                        if (this.dir == 3) p2 = this.pos - (door ? 3 : 2);
                        if (this.push_cnt++ >= 4 * def.pushable) {
                            if (p2 && (this.map.getTile(p2).id == 0)) {
                                this.map.moveTile(newPos, p2).done = true;
                                game.audio.play('push');
                                this.push_cnt = 0;
                                if (!ctrl) {
                                    this.map.moveTile(this.pos, newPos);
                                    player_tile.dir = this.dir;
                                    this.pos = newPos;
                                }
                            } else {
                                game.audio.play('cant');
                                this.push_cnt = 0;
                            }
                        }
                    } else if (this.push_cnt++ >= 8) {
                        game.audio.play('cant');
                        this.push_cnt = 0;
                    }
                }
            } else if (ctrl) {
                if (this.ctrl_state == 0) this.ctrl_state = 1;
            } else if (!ctrl) {
                if (this.ctrl_state == 1) {
                    if (this.hasItem(this.selected_item)) this.toggleDrop(this.selected_item);
                    this.ctrl_state = 2;
                } else if (this.ctrl_state == 2) {
                    this.ctrl_state = 0;
                }
            }
            if (dynamite) {
                if (this.dynamite_state == 0) this.dynamite_state = 1;
            } else if (!dynamite) {
                if (this.dynamite_state == 1) {
                    if (this.hasItem('dyna')) this.toggleDrop('dyna');
                    this.dynamite_state = 2;
                } else if (this.dynamite_state == 2) {
                    this.dynamite_state = 0;
                }
            }
            if (grenade) {
                if (this.grenade_state == 0) this.grenade_state = 1;
            } else if (!grenade) {
                if (this.grenade_state == 1) {
                    if (this.hasItem('gren')) this.toggleDrop('gren');
                    this.grenade_state = 2;
                } else if (this.grenade_state == 2) {
                    this.grenade_state = 0;
                }
            }
            if (this.readyItem() == 'gren') pic = 8 + (tick >> 2 & 1);
            else if (this.readyItem() == 'dyna') pic = 10 + (tick >> 2 & 1);
            player_tile.setPicIndex(pic);
            if (game.input.keyStatus('kill')) player_tile.die();
            this.millis += this.mstep;
            this.mtime -= this.mstep;
            if (this.mtime <= 0) this.mtime = 0;
            if (this.millis >= 1) {
                this.millis -= 1;
                this.time--;
                if (this.time <= 0) {
                    this.time = 0;
                    this.millis = 0;
                    player_tile.die();
                } else if (this.time <= 10) {
                    if (this.time % 2) game.audio.play('timelimit3');
                    else game.audio.play('timelimit2');
                }
            }
        }
    }
});
//writes dynamite/grenade/timer functions in very spaghetti if/elif/elif statement

game.LoadScreen = Jay.extend({
    init: function() {
        this.tick = 0;
        this.loadPercent = 0;
        game.images.rockbasher = new Image();
        game.images.rockbasher.src = "data:image/png;base64,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";
        game.images.etincelle = new Image();
        game.images.etincelle.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAICAMAAACI9Yx1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRF/vSd/rAD//rQ/skg/tNG//7z/upu////ZxaoWgAAAAh0Uk5T/////////wDeg71ZAAAAjElEQVR42nxQCQ7DMAgjNib///E4mq6qtCEFERM7BtsZwv4T0vNmnfClTRvPbG+C2A2FOpvqFBKDc5QSSzWThTdB22mpCZL1UggfS3QAqUIPpBvztdCOGEXYWC2A4PyMtfJlli1clkCvjsVlk1chb/fBmWWGaQjj/swVh9lrkJ8d6ia8Avix1ao+AgwAlLkImzgUHIQAAAAASUVORK5CYII=";
        game.images.etincelle = {
            image: game.images.etincelle,
            ox: 0,
            oy: 0,
            tw: 8,
            th: 8,
            cols: 6
        };
        game.images.rb_relax = {
            image: game.images.rockbasher,
            ox: 11,
            oy: 2,
            tw: 63,
            th: 64,
            cols: 1
        };
        game.images.rb_anxious = {
            image: game.images.rockbasher,
            ox: 82,
            oy: 2,
            tw: 63,
            th: 64,
            cols: 1
        };
        game.images.rb_scared = {
            image: game.images.rockbasher,
            ox: 153,
            oy: 2,
            tw: 63,
            th: 64,
            cols: 1
        };
        game.images.rb_body = {
            image: game.images.rockbasher,
            ox: 0,
            oy: 66,
            tw: 103,
            th: 48,
            cols: 1
        };
    },
    onProgress: function(progress) {
        this.loadPercent = progress;
    },
    onStartScreen: function() {},
    onEndScreen: function() {},
    update: function() {
        game.gfx.clear('#000');
        var mw = 800;
        var width = Math.floor(this.loadPercent * mw);
        var ox = 200;
        var dx = ox + width;
        var dy = 524;
        var ex = ox + 800 - 2;
        if (this.loadPercent < 0.7) game.gfx.drawTile(game.images.rb_relax, 0, ex + 11, dy - 66 - 64);
        else if (this.loadPercent < 0.85) game.gfx.drawTile(game.images.rb_anxious, 0, ex + 11, dy - 66 - 64);
        else game.gfx.drawTile(game.images.rb_scared, 0, ex + 11, dy - 66 - 64);
        game.gfx.drawTile(game.images.rb_body, 0, ex, dy - 66);
        dx += 6;
        dy -= 22;
        game.gfx.fillRect(dx, dy - 1, mw - width, 1, "#996600");
        game.gfx.fillRect(dx, dy, mw - width + 2, 2, "#662200");
        game.gfx.drawTile(game.images.etincelle, (this.tick >> 2) % 6, dx - 3, dy - 4);
        this.tick = this.tick + 2;
    }
});

game.PlayScreen = Jay.extend({
    init: function() {},
    onStartScreen: function() {
        if (game.settings.playmode == 'replay') {
            var events_string = game.settings.replay_events.split(',');
            var replay_events = [];
            for (var i = 0; i < events_string.length; i++) replay_events.push(events_string[i] - 0);
            this.init_game(replay_events);
        } else {
            this.init_game();
        }
    },
    onEndScreen: function() {},
    init_game: function(replay_events) {
        game.input.reset(replay_events);
        game.globals.finalScore = -1;
        this.tick = 0;
        this.animtick = 0;
        this.map = new game.Map(game.settings.map);
        this.view = new game.View(20, 13, game.images.tileset);
        this.mapTitle = new game.MapTitle(this.map);
        this.finalScore = new game.FinalScore();
        this.panel = new game.Panel();
        var that = this;
        this.player = new game.Player(this.map, function() {
            that.mapTitle.hidePanel();
        });
        this.end_cnt = 0;
        this.show_score_cnt = 0;
        this.movetick = 0;
        this.pause = false;
        this.pause_pressed = false;
    },
    update: function() {
        if (!game.hasFocus) return;
        if (game.input.keyPressed('esc')) {
            game.running = false;
            return true;
        }
        if (game.input.keyPressed('pause')) {
            if (!this.pause_pressed) this.pause = !this.pause;
            this.pause_pressed = true;
        } else {
            this.pause_pressed = false;
        }
        if (!this.pause) this.process(true);
    },
    process: function(draw) {
        game.input.tick(this.animtick);
        this.player.scan_keys();
        if (this.movetick == 0) {
            this.map.reset_tile_dir();
            this.player.update(this.tick);
            this.player.update(this.tick);
            if (!this.player.start) {
                this.map.process(this.player, this.tick);
                this.map.process(this.player, this.tick);
                if (this.player.won) {
                    this.end_cnt++;
                    if (this.end_cnt == 18) this.finalScore.showPanel(this.player.score);
                    if (this.end_cnt >= 30) {
                        if (this.player.mtime >= 10) {
                            this.player.mtime -= 10;
                            if (this.end_cnt % 2 == 0) game.audio.play('diams');
                            this.finalScore.updateBonus(1);
                        } else {
                            this.player.mtime = 0;
                            this.show_score_cnt++;
                            if (this.show_score_cnt > 8) {
                                game.globals.finalScore = this.finalScore.getTotal();
                                game.globals.remainingTime = this.player.rem_time;
                                game.running = false;
                            }
                        }
                    }
                } else if (!this.player.alive) {
                    if (this.end_cnt++ == 18) {
                        if (game.settings.playmode == 'replay') game.running = false;
                        else this.init_game();
                    }
                }
            }
        }
        if (draw) {
            game.gfx.clear('#000');
            this.view.draw(this.map, this.player.pos, this.animtick, this.movetick, this.player.alive);
            this.mapTitle.draw();
            this.finalScore.draw();
            game.gfx.drawImage(game.images.gameScreen, 0, 0);
            this.panel.draw(this.tick, this.map, this.player);
        }
        this.animtick++;
        this.movetick++;
        if (this.movetick == game.const.tick_divider) {
            this.movetick = 0;
            this.tick = this.tick + 2;
        }
    }
});

game.running = true;
game.globals = {
    showControls: true,
    finalScore: 0
};
game.const = {
    debug: true,
    speed_divider: 0.5,
    tick_divider: 6,
    fps: 60,
    width: 1280,
    height: 960
};
game.regions = {
    map: {
        x: 0,
        y: 0,
        w: 64 * 20,
        h: 64 * 13,
        padding: 16,
        alpha: 0
    },
    grenades: {
        x: 15,
        y: 855,
        w: 130,
        h: 70,
        padding: 4,
        alpha: 0.5
    },
    dynamites: {
        x: 155,
        y: 855,
        w: 130,
        h: 70,
        padding: 4,
        alpha: 0.5
    },
    keys: {
        x: 320,
        y: 855,
        w: 140,
        h: 70,
        padding: 4,
        alpha: 0.5
    },
    current_score: {
        x: 492,
        y: 855,
        w: 180,
        h: 70,
        padding: 4,
        alpha: 0.5
    },
    glowing_score: {
        x: 686,
        y: 852,
        w: 80,
        h: 80,
        padding: 4,
        alpha: 1
    },
    total_score: {
        x: 780,
        y: 855,
        w: 180,
        h: 70,
        padding: 4,
        alpha: 0.5
    },
    time: {
        x: 1000,
        y: 865,
        w: 150,
        h: 50,
        padding: 4,
        alpha: 0.5
    }
};
game.images = {};
game.canvas_rect = new game.Rect(0, 0, 0, 0);
game.hasFocus = true;
game.ajax = {
    call: function(url, params, onSuccess, onError) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (typeof onSuccess != 'undefined') onSuccess(this.responseText);
                } else {
                    if (typeof onError != 'undefined') onError(this.status, this.responseText);
                }
            }
        };
        xhr.open('POST', url);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(params);
    }
};
game.setScreen = function(screen) {
    if (typeof game.screen != 'undefined') game.screen.onEndScreen();
    game.screen = screen;
    screen.onStartScreen();
};
game.screenToWorld = function(sx, sy) {
    return {
        x: (sx - game.canvas_rect.x) * game.const.width / game.canvas_rect.width,
        y: (sy - game.canvas_rect.y) * game.const.height / game.canvas_rect.height
    };
};
document.addEventListener("DOMContentLoaded", function(event) {
    var $canvas = document.getElementById("screen");
    setTimeout(function() {
        window.focus();
    }, 0);
    for (var i = 0; i < game.resources.length; i++) {
        game.loader.enqueue(game.resources[i]);
    }
    var updateCanvas = function() {
        var ratio = game.const.width / game.const.height;
        var position_canvas = function(rect) {
            $canvas.style.width = rect.width + 'px';
            $canvas.style.height = rect.height + 'px';
            $canvas.style.marginLeft = rect.x + 'px';
            $canvas.style.marginTop = rect.y + 'px';
        };
        var win = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            w = win.innerWidth || e.clientWidth || g.clientWidth,
            h = win.innerHeight || e.clientHeight || g.clientHeight;
        if (w > ratio * h) {
            var newWidth = ratio * h;
            game.canvas_rect.x = ((w - newWidth) / 2);
            game.canvas_rect.y = 0;
            game.canvas_rect.width = ratio * h;
            game.canvas_rect.height = h;
        } else if (h > w / ratio) {
            var newHeight = w / ratio;
            game.canvas_rect.x = 0;
            game.canvas_rect.y = (h - newHeight) / 2;
            game.canvas_rect.width = w;
            game.canvas_rect.height = newHeight;
        }
        position_canvas(game.canvas_rect);
    }
    //POSTs all returns for replay (which is why the replays are so broken in god mode, they're displayed dynamically based on saved input)
    window.addEventListener("resize", updateCanvas);
    updateCanvas();
    window.addEventListener("focus", function() {
        game.hasFocus = true;
    });
    window.addEventListener("blur", function() {
        game.hasFocus = false;
        game.audio.stop();
    });
    game.gfx.init($canvas, game.const.width, game.const.height);
    game.loadScreen = new game.LoadScreen();
    game.playScreen = new game.PlayScreen();
    game.setScreen(game.loadScreen);
    var renderFrame = function() {
        if (game.running) {
            game.screen.update();
            game.animationFrame = window.requestAnimationFrame(renderFrame);
        } else {
            window.cancelAnimationFrame(game.animationFrame);
            game.audio.stop();
            var close_game = function() {
                if (game.settings.playmode == 'mapeditor') parent.close_game();
                else document.location.href = game.settings.back_url;
            };
            if (game.globals.finalScore >= 0 && typeof game.settings.won_url != 'undefined') {
                var replay = game.input.getReplayRecords().join(',');
                game.ajax.call(game.settings.won_url, 'version=' + game.settings.map.version + '&time=' + game.globals.remainingTime + '&score=' + game.globals.finalScore + '&replay=' + replay, function(message) {
                    close_game();
                }, function(status, message) {
                    alert("Error " + status + "\n\n" + message);
                    close_game();
                });
            } else {
                close_game();
            }
        }
    };
    game.animationFrame = window.requestAnimationFrame(renderFrame);
    game.loader.downloadAll(function() {
        game.images.tileset = {
            image: game.loader.getResource("tiles64"),
            ox: 0,
            oy: 0,
            tw: 64,
            th: 64,
            cols: 16
        };
        var bg = game.loader.getResource('main-bg');
        var bg_width = 128;
        var bg_height = 128;
        for (var y = 0; y < game.const.height; y += bg_height) {
            for (var x = 0; x < game.const.width; x += bg_width) {
                game.gfx.drawImage(bg, x, y);
            }
        }
        for (var name in game.regions) {
            var r = game.regions[name];
            game.gfx.drawEmboss(r.x, r.y, r.w, r.h, r.padding, r.alpha);
        }
        game.images.gameScreen = game.gfx.getImage();
        game.audio.init("ogg,wav");
        game.input.init();
        game.setScreen(game.playScreen);
    }, function(progress) {
        game.loadScreen.onProgress(progress);
    });
});