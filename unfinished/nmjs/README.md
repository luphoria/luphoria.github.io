# namcomuseum-js
WIP! Recreation of the first-person interactive museums from the Namco Museum games (PS1) in JavaScript using three.js.

## FAQ

### What is this?
This is a work-in-progress recreation of all six Namco Museum games that is currently in very early stages.

### Who is developing it?
Really just me, but I'd also lend credit to eros71 for model help, and ChewbaccaBox for giving me the texture extraction scripts.

### Where can I play it?
A live version can be played at https://luphoria.github.io/UnfinishedShit/nmjs/museum (yes i'll get around to changing the url at some point lol)

## End Goal
All 6 Namco Museum PS1 3D museums playable with the info-cards. NOT the arcade games included.

## Currently implemented
 - all models from Volume 1 are here in .obj format 
 - OPT.obj, or the lobby, is the current playing environment
 - Movement: walking, rotating, running
 - Collision: faithful to the original game
 
## Known bugs
  - Looking up is completely broken
  - When locally hosting it, the OBJ loading's % returns as NaN which does not work with the Loading screen
  - Playing the game while it is loading is completely possible
  
## I can't run it locally!
Firefox security is really shitty and broken for some reason, and it doesn't let you cross-run 
file:// resources because it isn't HTTP/S. I haven't tested it on Chrome. 

### To fix
`about:config` - toggle `privacy.file_unique_origin`
