# namcomuseum-js
WIP! Recreation of the first-person interactive museums from the Namco Museum games (PS1) in JavaScript using three.js.

## FAQ

### What is this?
This is a work-in-progress recreation of all five 3D Namco Museum museums that is currently in very early stages.

### Who is developing it?
Really just me, but I'd also lend credit to eros71 for model help, impiaa for reversing the TIP format, and ChewbaccaBox for most/all modeling as well as TIP extraction.

### Where can I play it?
A live version can be played at https://luphoria.github.io/nmjs/

## End Goal
All 5 Namco Museum PS1 3D museums playable. NOT the arcade games included.

## Currently implemented
 - Vol 1: FRO1, fully textured
 - Vol 2: OPT2, fully textured
 - Vol 2: GB2, fully textured
 - Movement: walking, rotating, running
 - Dynamic music: some levels have different music
 
## Known bugs
  - Looking up is completely broken
  
## I can't run it locally!
Firefox security is really shitty and broken for some reason, and it doesn't let you cross-run 
file:// resources because it isn't HTTP/S. I haven't tested it on Chrome. 

### To fix
Navigate to `about:config` and toggle `privacy.file_unique_origin`

## Credits
 - luphoria: code, initial attempts, initial model extracts
 - ChewbaccaBox: model extracts, TIP reverse engineering, model texturing
 - impiaa: TIP reverse engineering
 - eros71: model help
### Libraries used
 - three.js
 - keydrown
