let colCube1 = BoxGeometry(220,100,290)
colCube1 = modPos(colCube1,"x",-20)
colCube1 = modPos(colCube1,"z",10)

let colCube2 = BoxGeometry(100,100,25)
colCube2 = modPos(colCube2,"x",120)
colCube2 = modPos(colCube2,"z",140)

let colCube3 = BoxGeometry(75,100,55)
colCube3 = modPos(colCube3,"x",100)
colCube3 = modPos(colCube3,"z",-140)

export const col = [colCube1,colCube2,colCube3]