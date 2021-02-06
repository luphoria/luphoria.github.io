let colCube1 = BoxGeometry( 40, 30, 60 )
colCube1 = modPos(colCube1,"y",-30)
colCube1 = modPos(colCube1,"x",5)

let colCube2 = BoxGeometry( 93, 40, 20 )
colCube2 = modPos(colCube2,"y",-30)
colCube2 = modPos(colCube2,"x",6)

export const col = [colCube1,colCube2]