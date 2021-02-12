import {FRO_entry_1} from "./1/FRO/script.js"
import {OPT_entry_1} from "./1/OPT/script.js"
import {OPT_entry_2} from "./2/OPT/script.js"
import {GB_entry_2} from "./2/GB/script.js"
import {MAPY_entry_2} from "./2/MAPY/script.js"
import {CQ_entry_2} from "./2/CQ/script.js"
import {LOB_entry_2} from "./2/LOB/script.js"

function setEntry() {
    var selected = prompt("Enter level (e.g. \"FRO1\")\nenter \"list\" for all levels")

    switch(selected) {
    case "list":
        alert("FRO1,OPT1,OPT2,GB2,MAPY2,CQ2,LOB2")
        return setEntry()
    case "FRO1": 
        return FRO_entry_1
    case "OPT1":
        return OPT_entry_1
    case "OPT2":
        return OPT_entry_2
    case "GB2":
        return GB_entry_2
    case "MAPY2":
        console.warn("WARN: collision not implemented")
        return MAPY_entry_2
    case "CQ2":
        console.warn("WARN: music not implemented")
        console.warn("WARN: collision not implemented")
        return CQ_entry_2
    case "LOB2": 
        console.warn("WARN: collision not implemented")
        return LOB_entry_2
    default:
        console.error("unimplemented level \"" + selected + "\", defaulting FRO1")
        return FRO_entry_1
    }
}

var selected_level_entry = setEntry()

export const SelectedLevel = (request) => {
    switch(request) {
        case "pos":
            return selected_level_entry[0]
        case "col":
            return selected_level_entry[1]
        case "obj":
            return selected_level_entry[2]
        case "sfx":
            return selected_level_entry[3]
        case "clr":
            return selected_level_entry[4]
        default:
            throw "unimplemented request " + request
    }
}