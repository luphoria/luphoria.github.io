// ====================================================================
// Playfield Grid - Three.js implementation of the 3D blocks
// 
// author: Nate Horstmann nate@natehorstmann.com
// ====================================================================

(function($){
  
  // ====================================================================
  // @playfieldGrid object
  // ====================================================================
  MCBM.playfieldGrid = function(displayCanvas, gridCellPixelSize) {
    
    var DEBUG = false;
    
    // ----------------------------------------------------------------
    // Define private vars
    // ----------------------------------------------------------------

    // DOM and canvas vars
    var $body = $('body'),
        _displayCanvas = displayCanvas,
        $displayCanvas = $(_displayCanvas),
        _displayCanvasCtx = _displayCanvas.getContext("2d"),
        _renderCanvas,
        _maskCanvas,
        _w = _displayCanvas.width,
        _h = _displayCanvas.height;
        
    // 3D scene vars
    var _aspect = _w/_h,
        _fov = 25,
        _camera,
        _scene,
        _renderer,
        _refPlane,
        _maskScene,
        _maskPlane,
        _maskRenderer;
      
     // textures
    var _grassDirtTex = null,
        _dirtTex = null,
        _stoneTex = null,
        _gravelTex = null,
        _coalOreTex = null,
        _ironOreTex = null,
        _goldOreTex = null,
        _lavaTex = null;
        
    // texture -> material association
    var _texturesLookup = null,
        _materialTypeLookup = null,
        //_materialsLookup = null,
        _randomMaterialTypes = null;

    // interactivity vars
    var _projector,
        _ray,
        _mouse2D,
        _mouse3D;
  
    // playfield grid definition vars
    var _gridCellPixelSize = gridCellPixelSize,
        _cols = Math.ceil(MCBM.MAX_WIDTH / _gridCellPixelSize),
        _rows = Math.ceil(MCBM.MAX_HEIGHT / _gridCellPixelSize),
        _gridCellSize = 0, // needs to be converted from pixel size based on 3d world coordinates
        _gridW = 0, // based on _gridCellSize
        _gridH = 0,
        _camZ = 1000,
        _layers = 7,
        _voxelGrid = null;
    
    
    var pScope = {};
    pScope.isDirty = true;
    
    // ----------------------------------------------------------------
    // private methods
    // ----------------------------------------------------------------

    function _init() {
    
      _initMainDisplayScene();
              
      _initTextures();
      
      // voxel grid object stores data about which voxels have been created
      _voxelGrid = MCBM.voxelGrid();
      
      // interactivity
      _drawReferenceGrid();
      _mouse2D = new THREE.Vector3( 0, 0, 0 );
  
    };
    
    function _reset() {
      
      _scene = new THREE.Scene();
      _scene.addObject( _refPlane );
      
      _maskScene = new THREE.Scene();
      _maskPlane = new THREE.Mesh( new THREE.PlaneGeometry( _gridW, _gridH, _rows, _cols ), new THREE.MeshFaceMaterial() );
      _maskScene.addObject( _maskPlane );
      
      _voxelGrid = MCBM.voxelGrid(_cols, _rows, _layers);
      
      _maskRenderer.render( _maskScene, _camera );
      _renderer.render( _scene, _camera );
      
    };
    
    // ----------------------------------------------------------------
  
    function _initMainDisplayScene() {
      
      _renderCanvas = document.createElement( 'canvas' );
      
      _camera = new THREE.Camera( _fov, _aspect, 1, 10000 );
      _camera.position.z = _camZ;
      _camera.target.position.z = 0;

      _scene = new THREE.Scene();
      
      _renderer = ( MCBM.webGLenabled ) ? new THREE.WebGLRenderer({canvas:_renderCanvas}) : new THREE.CanvasRenderer({canvas:_renderCanvas});
      _renderer.setSize(_w, _h);
      
      // render once to get updated matrices
      _renderer.render( _scene, _camera );
      _projector = new THREE.Projector();
      _ray = new THREE.Ray( _camera.position, null );
      
      // figure out the ratio of world coordinates to screen coordinates so that our _gridCellSize remains true to its value in pixels
      var viewMaxX3D = new THREE.Vector3( 1, 0, 0 );
      viewMaxX3D = _projector.unprojectVector( viewMaxX3D.clone(), _camera );
      _ray.direction = viewMaxX3D.subSelf( _camera.position ).normalize();
      var worldMaxX = _ray.direction.x * (-_ray.origin.z / _ray.direction.z );
      //debug.log("worldMaxX: "+worldMaxX);
      
      var viewMinX3D = new THREE.Vector3( -1, 0, 0 );
      viewMinX3D = _projector.unprojectVector( viewMinX3D, _camera );
      _ray.direction = viewMinX3D.subSelf( _camera.position ).normalize();
      var worldMinX = _ray.direction.x * (-_ray.origin.z / _ray.direction.z );
      //debug.log("worldMinX: "+worldMinX);
      
      var worldWidth = worldMaxX - worldMinX;
      
      var worldToScreenPx = worldWidth/_w;
      _gridCellSize = _gridCellPixelSize * worldToScreenPx;
      _gridW = _cols * _gridCellSize;
      _gridH = _rows * _gridCellSize;
      
      //debug.log("MCBM.playfieldGrid :: _cols: "+_cols+" _rows: "+_rows);
      
      _initMaskScene();
      
    };
    
    // ----------------------------------------------------------------
    
    function _updateMainDisplaySize() {
      
      _aspect = _w/_h;
      _camera.aspect = _aspect;
      _camera.updateProjectionMatrix();
      _renderer.setSize(_w, _h);
      
      // render once to get updated matrices
      _renderer.render( _scene, _camera );
      _ray = new THREE.Ray( _camera.position, null );
      
      // figure out the ratio of world coordinates to screen coordinates so that our _gridCellSize remains true to its value in pixels
      var viewMaxX3D = new THREE.Vector3( 1, 0, 0 );
      viewMaxX3D = _projector.unprojectVector( viewMaxX3D.clone(), _camera );
      _ray.direction = viewMaxX3D.subSelf( _camera.position ).normalize();
      var worldMaxX = _ray.direction.x * (-_ray.origin.z / _ray.direction.z );
      //debug.log("worldMaxX: "+worldMaxX);
      
      var viewMinX3D = new THREE.Vector3( -1, 0, 0 );
      viewMinX3D = _projector.unprojectVector( viewMinX3D, _camera );
      _ray.direction = viewMinX3D.subSelf( _camera.position ).normalize();
      var worldMinX = _ray.direction.x * (-_ray.origin.z / _ray.direction.z );
      //debug.log("worldMinX: "+worldMinX);
      
      var worldWidth = worldMaxX - worldMinX;
      
      var worldToScreenPx = worldWidth/_w;
      _gridCellSize = _gridCellPixelSize * worldToScreenPx;
      _gridW = _cols * _gridCellSize;
      _gridH = _rows * _gridCellSize;
      //debug.log("MCBM.playfieldGrid :: _cols: "+_cols+" _rows: "+_rows);
      
      _maskRenderer.setSize( _w, _h );
      
      _render();
    };
    
    // ----------------------------------------------------------------
  
    function _initMaskScene() {
      
      _maskCanvas = document.createElement( 'canvas' );
      _maskScene = new THREE.Scene();
      _maskPlane = new THREE.Mesh( new THREE.PlaneGeometry( _gridW, _gridH, _rows, _cols ), new THREE.MeshFaceMaterial() );
      _maskScene.addObject( _maskPlane );
      _maskRenderer = new THREE.CanvasRenderer({canvas:_maskCanvas}); // using canvas for the mask buffer runs faster for some reason
      _maskRenderer.setSize( _w, _h );

    };
    
    // ----------------------------------------------------------------
  
    function _initTextures() {
      
      // textures
      _grassDirtTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/grass_dirt.png' ),
      _dirtTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/dirt.png' );
      _stoneTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/stone.png' );
      _gravelTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/gravel.png' );
      _coalOreTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/coal.png' );
      _ironOreTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/iron.png' );
      _goldOreTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/gold.png' );
      _lavaTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/lava.png' );
      _bedrockTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/bedrock.png' );
      //waterTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/water.png' );
      
      _randomMaterialTypes = [
        "gravel",
        "stone",
        "coal",
        "iron",
        "gold"
      ];
      
      _texturesLookup = {
        grassDirt: _grassDirtTex,
        dirt: _dirtTex,
        gravel: _gravelTex,
        stone: _stoneTex,
        coal: _coalOreTex,
        iron: _ironOreTex,
        gold: _goldOreTex,
        lava: _lavaTex,
        bedrock: _bedrockTex,
      };
      
      _generateGridMaterials();
      
    };
  
    // ----------------------------------------------------------------
  
    function _loadTexture( path ) {
    
      var image = new Image();
      var texture  = new THREE.Texture( image, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter );
          
      image.onload = function () { texture.needsUpdate = true; };
      image.crossOrigin = '';
      image.src = path;
        
       return (MCBM.webGLenabled) ? new THREE.MeshLambertMaterial( { map: texture } ) : new THREE.MeshBasicMaterial( { map: texture } );

    };
    
    // ----------------------------------------------------------------
    
    function _generateGridMaterials() {
          
      var layer = 0,
          row = 0,
          col = 0;
      
      // initialize arrays
      //_materialsLookup = [];
      _materialTypeLookup = [];
      for (layer = 0; layer <= _layers; layer++) {
        _materialTypeLookup[layer] = [];
        //_materialsLookup[layer] = [];  
        for (row = 0; row < _rows; row++) {
          _materialTypeLookup[layer][row] = [];
          //_materialsLookup[layer][row] = [];
        };
      };      
      
      // top(0) layer - all grassDirt
      layer = 0;
      for (row = 0; row < _rows; row++) {
        for (col = 0; col < _cols; col++) {
          _materialTypeLookup[layer][row][col] = "grassDirt";
        };
      };
      
      // second(1) layer - all dirt
      layer = 1;
      for (row = 0; row < _rows; row++) {
        for (col = 0; col < _cols; col++) {
          _materialTypeLookup[layer][row][col] = "dirt";
        };
      };
      
     // fill the rest of the layers with stone
      for (layer = 2; layer < _layers; layer++) {    
        for (row = 0; row < _rows; row++) {
          for (col = 0; col < _cols; col++) {

            _materialTypeLookup[layer][row][col] = "stone";

          };
        };
      };
      
      //======================================================
      // Randomize Ore distribution in middle grid levels
      //======================================================
      // Instead of dealing with 3D noise data let's just pick some random row x col locations in different layers
      // and then add a few blocks of the same material clustered around those spots to mimic ore "veins"
      
      var halfPad = 0; //(_rowColPadding*0.5)|0,
          rRow = 0,
          rCol = 0,
          layer = 0;
      
      var numDirts = 30; // add some random dirt into the third layer
      for(i=0; i<numDirts; i++) {
        rRow = MCBM.randomInRange(0, _rows-halfPad)|0;
        rCol = MCBM.randomInRange(halfPad, _cols-halfPad)|0;
        layer = 2; 
         _generateOreVein("dirt", rRow, rCol, layer,  MCBM.randomInRange(2, 5)|0);
      }
      
      var numCoalVeins = 15; // first coal layer
      for(i=0; i<numCoalVeins; i++) {
        rRow = MCBM.randomInRange(halfPad, _rows-halfPad)|0;
        rCol = MCBM.randomInRange(halfPad, _cols-halfPad)|0;
        layer = 2; 
        _generateOreVein("coal", rRow, rCol, layer,  MCBM.randomInRange(2, 4)|0);
      }
      
      for(i=0; i<numCoalVeins; i++) {  // second coal layer
        rRow = MCBM.randomInRange(halfPad, _rows-halfPad)|0;
        rCol = MCBM.randomInRange(halfPad, _cols-halfPad)|0;
        layer = 3; 
        _generateOreVein("coal", rRow, rCol, layer,  MCBM.randomInRange(2, 4)|0);
      }
      
      var numIronVeins = 5; // first iron layer
      for(i=0; i<numIronVeins; i++) {  
        rRow = MCBM.randomInRange(halfPad, _rows-halfPad)|0;
        rCol = MCBM.randomInRange(halfPad, _cols-halfPad)|0;
        layer = 3; 
        _generateOreVein("iron", rRow, rCol, layer,  MCBM.randomInRange(2, 4)|0);
      }
      
      numIronVeins = 7; // second iron layer
      for(i=0; i<numIronVeins; i++) {  
        rRow = MCBM.randomInRange(halfPad, _rows-halfPad)|0;
        rCol = MCBM.randomInRange(halfPad, _cols-halfPad)|0;
        layer = 4; 
        _generateOreVein("iron", rRow, rCol, layer,  MCBM.randomInRange(2, 4)|0);
      }
      
      var numGoldVeins = 3; // first gold layer
      for(i=0; i<numGoldVeins; i++) {  
        rRow = MCBM.randomInRange(halfPad, _rows-halfPad)|0;
        rCol = MCBM.randomInRange(halfPad, _cols-halfPad)|0;
        layer = 5; 
        _generateOreVein("gold", rRow, rCol, layer,  MCBM.randomInRange(1, 3)|0);
      }
      
      var numGoldVeins = 2; // second gold layer
      for(i=0; i<numGoldVeins; i++) {  
        rRow = MCBM.randomInRange(halfPad, _rows-halfPad)|0;
        rCol = MCBM.randomInRange(halfPad, _cols-halfPad)|0;
        layer = 6; 
        _generateOreVein("gold", rRow, rCol, layer,  2|0);
      }
           
    };
    
    // ----------------------------------------------------------------
    
    function _generateOreVein(materialName, row, col, layer, length) {
      //debug.log("_generateOreVein :: "+materialName+": pos: "+row+", "+col+", "+layer+" length: "+length);
      
      //pick an axis
      var axis = (Math.random() >= 0.5) ? "x" : "y";
    
      for (var i=0; i <= length; i++) {
      
        if (axis == "x") {
        
          col++;
          if (col >= _cols) {
            col = _cols - 1;
          }
        
        } else {
        
          row++
          if (row >= _rows) {
            row = _rows - 1;
          }
        
        }
                
        _materialTypeLookup[layer][row][col] = materialName;
      }
      
    };
    
    // ----------------------------------------------------------------
    
    function _getMaterialsByGridPos(gridPos) {
    
      var col = gridPos.x,
          row = gridPos.y,
          layer = gridPos.z;
                
      try {          
        var pxCol = (col < _cols - 1 ) ? col + 1 : col;
        var nxCol = (col > 0) ? col - 1 : col;
      
        var pxTex = _texturesLookup[ _materialTypeLookup[layer][row][pxCol] ];
        var nxTex = _texturesLookup[ _materialTypeLookup[layer][row][nxCol] ];
      
        var pyRow = (row < _rows - 1 ) ? row + 1 : row;
        var nyRow = (row > 0) ? row - 1 : row;
      
        var pyTex = _texturesLookup[ _materialTypeLookup[layer][pyRow][col] ];
        var nyTex = (row > 0) ? _texturesLookup[ _materialTypeLookup[layer][nyRow][col] ] : _texturesLookup["bedrock"];
      
        var pzLayer = (layer > 0) ? layer - 1 : layer;
        var nzLayer = (layer < _layers - 1) ? layer + 1 : layer;
      
        var pzTex = _texturesLookup[ _materialTypeLookup[pzLayer][row][col] ];
        // bottom(_layers) layer - all lava
        var nzTex = (layer != _layers - 1) ? _texturesLookup[ _materialTypeLookup[nzLayer][row][col] ] : _texturesLookup["lava"];
      
        var materials = [
          pxTex,
          nxTex,

          pyTex,
          nyTex,

          pzTex,
          nzTex,
        ];
        
        return materials;
        
      } catch(e) {
        
        return undefined;
        
      }
            
      //return _materialsLookup[gridPos.z][gridPos.y][gridPos.x];
      
    };
  
  // ----------------------------------------------------------------

    function _drawReferenceGrid() {
    
      // opacity can be turned on while mask is diabled to see where playfield "tiles" are  
      var material = new THREE.MeshLambertMaterial( { color: 0x00ff00, opacity: (DEBUG) ? 1 : 0, shading: THREE.FlatShading } );
      material.wireframe = true;
    
      // this plane is used to capture the 3D location of mouse interaction to set mask tiles and voxel geometry
      _refPlane = new THREE.Mesh( new THREE.PlaneGeometry( _gridW, _gridH, _cols, _rows ), material );
      _refPlane.name = "refPlane";
      _refPlane.position.z = -1;
      _scene.addObject( _refPlane );
    
    }
    
    // ----------------------------------------------------------------
    
    function _getGridPosition(position) {
      var offsetX = position.x + _gridW * 0.5;
      var offsetY = position.y + _gridH * 0.5;
      var col = (offsetX/_gridCellSize)|0;
      var row = (offsetY/_gridCellSize)|0;
            
      //debug.log("attempting to create new voxel at grid pos : ("+col+", "+row+")");
  
      return new THREE.Vector3( col, row, 0);
    };
    
    // ----------------------------------------------------------------
    
    function _getPosition3D(gridPosition) {
      var x = _gridCellSize * 0.5 + (gridPosition.x * _gridCellSize) - _gridW * 0.5;
      var y = _gridCellSize * 0.5 + (gridPosition.y * _gridCellSize) - _gridH * 0.5;
      var z = -gridPosition.z * _gridCellSize - _gridCellSize * 0.5;
      
      return new THREE.Vector3( x, y, z);
    }

    // ----------------------------------------------------------------
    
    function _getVoxelName(gridPos) {
      return "voxel:"+gridPos.x + ","+gridPos.y + ","+gridPos.z;
    };
    
    // ----------------------------------------------------------------
  
    function _createVoxelAtGridPos(destGridPos) {
      
      var position = _getPosition3D(destGridPos);
      //debug.log("_createVoxelAtGridPos :: position: ("+position.x+", "+position.y+", "+position.z+") ");
      
      // when creating a voxel at the top layer only draw the mask tile once for a grid pos 
      if (destGridPos.z == 0 && !_voxelGrid.hasPos(destGridPos)) {
        _createMaskTile(position);
      }
    
      //debug.log("an empty grid position exists at :: ("+destGridPos.x+", "+destGridPos.y+", "+destGridPos.z+")");
  
      var materials = _getMaterialsByGridPos(destGridPos);
  
      var sharedSides = _voxelGrid.getSharedSidesForPos(destGridPos);
      var displayedSides = _getDisplayedFromSharedSides(sharedSides);
   
    
      var voxel = _createVoxelGeometry(materials, displayedSides, position);
      voxel.name = _getVoxelName(destGridPos);
      _scene.addObject( voxel );
      _voxelGrid.addVoxel(destGridPos, voxel);
  
      // update preexisting voxels geomtry at shared sides
      var updateGridPos =  new THREE.Vector3();
      for (side in sharedSides) {
    
        if ( sharedSides[side] ) { // side is shared
          // use the corrent position and shared side data to define the position that needs to be updated
          updateGridPos.copy(destGridPos);
      
          var sideComponents = side.split("");
          var offset = (sideComponents[0] == "p" ) ? 1 : -1;
          var prop = sideComponents[1];
              
          updateGridPos[prop] += offset;
          var updateMaterials = _getMaterialsByGridPos(updateGridPos);
          
          if (updateMaterials !== undefined) { // grid material will be undefined if try to dig past the edge of the grid
            var updatedDisplayedSides = _getDisplayedFromSharedSides( _voxelGrid.getSharedSidesForPos(updateGridPos) );
                
            // only generate new geometry if at least one side is displayed otherwise just set to null
            var isVoxelDisplayed = false;
            for (side in updatedDisplayedSides) {
              isVoxelDisplayed = updatedDisplayedSides[side];
              if (isVoxelDisplayed)
                break;
            }
      
            // store the position data for the voxel, then remove it and replace with updated geometry 
            var oldVoxel = _voxelGrid.getVoxelByPos(updateGridPos);
            if (oldVoxel) {
              var oldPosition = new THREE.Vector3();
              oldPosition.copy(oldVoxel.position);
              _scene.removeObject( oldVoxel );
            }
      
            var updatedVoxel = (isVoxelDisplayed) ? _createVoxelGeometry(updateMaterials, updatedDisplayedSides, oldPosition) : null;
            if (updatedVoxel) {
              updatedVoxel.name = _getVoxelName(updateGridPos);
              _scene.addObject( updatedVoxel );
            }
      
            _voxelGrid.addVoxel(updateGridPos, updatedVoxel);
          }
        }
      }
  
      pScope.isDirty = true;
  
    };
    
    function _createVoxelGeometry(materials, displayedSides, position) {
    
      // make the new voxel geometry
      var voxel = new THREE.Mesh( new THREE.CustomCubeGeometry( _gridCellSize, _gridCellSize, _gridCellSize, 1, 1, 1, materials, true, displayedSides ), new THREE.MeshFaceMaterial() );
      voxel.position.x = position.x;
      voxel.position.y = position.y;
      voxel.position.z = position.z;
      voxel.name = name
      voxel.matrixAutoUpdate = false;
      voxel.updateMatrix();
      voxel.overdraw = true;
  
      return voxel;
    
    };
    
    // ----------------------------------------------------------------
  
    function _getDisplayedFromSharedSides(sharedSides) {
   
      var displayedSides =  {
        px: !sharedSides.px, 
        nx: !sharedSides.nx, 

        py: !sharedSides.py, 
        ny: !sharedSides.ny, 

        pz: !sharedSides.nz, // z - is switched because grid count starts at 0 and increases for deeper layers while actual scene coordinates decrease
        nz: !sharedSides.pz
      };
    
      return displayedSides;
    
    };
  
    // ----------------------------------------------------------------
  
    function _createMaskTile(position) {
    
      // black tile
      var material = new THREE.MeshLambertMaterial( { color: 0xffffff, opacity: 1, shading: THREE.FlatShading } ); 
      var _maskPlane = new THREE.Mesh( new THREE.PlaneGeometry( _gridCellSize + 1, _gridCellSize + 1, 1, 1 ), material);
      _maskPlane.position.x = position.x;
      _maskPlane.position.y = position.y;
      _maskPlane.position.z = 0;
    
      _maskScene.addObject( _maskPlane );
    
    };
  
    // ----------------------------------------------------------------
  
    function _mineAtPosition( x, y ) {
      
     // get normalized device x,y coords
      _mouse2D.x = ( x / _w ) * 2 - 1;
      _mouse2D.y = -( y / _h ) * 2 + 1;
                
      // get the 3d mouse position and a create a ray based on _camera position to find intersections
      _mouse3D = _projector.unprojectVector( _mouse2D.clone(), _camera );
      _ray.direction = _mouse3D.subSelf( _camera.position ).normalize();
      
      var intersects = _ray.intersectScene( _scene );
      var l = intersects.length;
    
      if ( l > 0 ) {
      
        var destPosition3D = intersects[ 0 ].face.centroid.clone();
        var destGridPosition = _getGridPosition(destPosition3D);
        //debug.log("refPlane intersection: ");
        //debug.log("- destPosition3D: ("+destPosition3D.x+", "+destPosition3D.y+", "+destPosition3D.z+")" );
        //debug.log("- destGridPosition: ("+destGridPosition.x+", "+destGridPosition.y+", "+destGridPosition.z+")" );
      
        // check if there are more intersections and if grid has already position here
        if ( _voxelGrid.hasPos(destGridPosition) && (l > 1) ) {
                  
          var intersectedVoxel = intersects[ 1 ].object;
          if (typeof intersectedVoxel.name !== 'undefined') {
            var intersectedVoxelFacePos = intersects[ 1 ].face.centroid.clone();
            var intersectedGridPosArr = intersectedVoxel.name.split(":")[1].split(",");
            var intersectedGridPos = new THREE.Vector3(parseInt(intersectedGridPosArr[0], 10), parseInt(intersectedGridPosArr[1], 10), parseInt(intersectedGridPosArr[2], 10));
          } else {
            
            debug.log('Error: unable to resolve intersectedVoxel name');
            debug.log(intersectedVoxel);
            
            return;
          }
          
          destGridPosition.x = intersectedGridPos.x;
          destGridPosition.y = intersectedGridPos.y;
          destGridPosition.z = intersectedGridPos.z;
          
          // add offet to grid positioned based on which face was intersected
          var destOffsetX = (intersectedVoxelFacePos.x != 0) ? intersectedVoxelFacePos.x / Math.abs(intersectedVoxelFacePos.x) : 0;
          destGridPosition.x += destOffsetX;
          
          var destOffsetY = (intersectedVoxelFacePos.y != 0) ? intersectedVoxelFacePos.y / Math.abs(intersectedVoxelFacePos.y) : 0;
          destGridPosition.y += destOffsetY;
          
          var destOffsetZ = (intersectedVoxelFacePos.z != 0) ? -intersectedVoxelFacePos.z / Math.abs(intersectedVoxelFacePos.z) : 0;
          destGridPosition.z += destOffsetZ;
          
          //debug.log("destGridPosition: ("+destGridPosition.x+", "+destGridPosition.y+", "+destGridPosition.z+")" );
        }
        
        if (destGridPosition.z < _layers) {
          
          var material = undefined;
          
          try {
            
            material = _materialTypeLookup[destGridPosition.z][destGridPosition.y][destGridPosition.x];
            
          } catch(e) {
            //debug.log("trying to mine past edge of grid");
          }
                    
          if (material !== undefined ) {
            _createVoxelAtGridPos(destGridPosition);
          }
          
          return material;
        
        } else {
          
          //debug.log("you have reached the maximum layers at this grid position :: ");
          return "lava";
          
        }
              
      }
     
    };
    
    // ----------------------------------------------------------------
    
    function _generateCreeperDamage( pos ) {
    
     // get normalized device x,y coords
     var explosionCenter2D = new THREE.Vector3(0, 0, 0);
     
      explosionCenter2D.x = ( pos.x / _w ) * 2 - 1;
      explosionCenter2D.y = -( pos.y / _h ) * 2 + 1;
                
      // get the 3d mouse position and a create a ray based on _camera position to find intersections
       var explosionCenter3D = _projector.unprojectVector( explosionCenter2D.clone(), _camera );
      _ray.direction = explosionCenter3D.subSelf( _camera.position ).normalize();
      
      var intersects = _ray.intersectScene( _scene );
      var l = intersects.length;
    
      if ( l > 0 ) {
      
        var explosionPosition3D = intersects[ 0 ].face.centroid.clone(),
            explosionGridPosition = _getGridPosition(explosionPosition3D),
            explosionPositions = [],
            rowStartPosition,
            rowPosition,
            rowCols = 0,
            startXOffset = 0,
            i = 0;
      
        //row1
        rowCols = (Math.random() > 0.5 ) ? 3 : 2;
        startXOffset = (rowCols == 3) ? -1 : (Math.random() > 0.5 ) ? -1 : 0;
        rowStartPosition = explosionGridPosition.clone();
        rowStartPosition.y += 2;
        rowStartPosition.x += startXOffset;
        
        for (i=0; i < rowCols; i++) {
          rowPosition = rowStartPosition.clone();
          rowPosition.x += i;
          explosionPositions.push(rowPosition.clone());
        };
        
        //row2
        rowCols = MCBM.randomInRange(rowCols + 1, 5)|0;
        startXOffset = (rowCols == 5) ? -2 : (Math.random() > 0.5 ) ? -2 : -1;
        startXOffset = (rowCols == 3) ? -1 : startXOffset;
        rowStartPosition = explosionGridPosition.clone();
        rowStartPosition.y += 1;
        rowStartPosition.x += startXOffset;
        
        for (i=0; i < rowCols; i++) {
          rowPosition = rowStartPosition.clone();
          rowPosition.x += i;
          explosionPositions.push(rowPosition.clone());
        };
        
        //row3
        rowCols = 5;
        startXOffset = -2;
        rowStartPosition = explosionGridPosition.clone();
        rowStartPosition.x += startXOffset;
        
        for (i=0; i < rowCols; i++) {
          rowPosition = rowStartPosition.clone();
          rowPosition.x += i;
          explosionPositions.push(rowPosition.clone());
        };
        
        //row4
        rowCols = MCBM.randomInRange(3, 5)|0;
        startXOffset = (rowCols == 5) ? -2 : (Math.random() > 0.5 ) ? -2 : -1;
        startXOffset = (rowCols == 3) ? -1 : startXOffset;
        rowStartPosition = explosionGridPosition.clone();
        rowStartPosition.y -= 1;
        rowStartPosition.x += startXOffset;
        
        for (i=0; i < rowCols; i++) {
          rowPosition = rowStartPosition.clone();
          rowPosition.x += i;
          explosionPositions.push(rowPosition.clone());
        };
        
        //row5
        rowCols = (rowCols == 3) ? 2 : (Math.random() > 0.5 ) ? 3 : 2;
        startXOffset = (rowCols == 3) ? -1 : (Math.random() > 0.5 ) ? -1 : 0;
        rowStartPosition = explosionGridPosition.clone();
        rowStartPosition.y -= 2;
        rowStartPosition.x += startXOffset;
        
        for (i=0; i < rowCols; i++) {
          rowPosition = rowStartPosition.clone();
          rowPosition.x += i;
          explosionPositions.push(rowPosition.clone());
        };
        
        //row1Layer2
        rowCols = 3;
        rowStartPosition = explosionGridPosition.clone();
        rowStartPosition.y += 1;
        rowStartPosition.x -= 1;
        rowStartPosition.z += 1;
        
        for (i=0; i < rowCols; i++) {
          rowPosition = rowStartPosition.clone();
          rowPosition.x += i;
          explosionPositions.push(rowPosition.clone());
        };
        
        //row2Layer2
        rowCols = 3;
        rowStartPosition = explosionGridPosition.clone();
        rowStartPosition.x -= 1;
        rowStartPosition.z += 1;
        
        for (i=0; i < rowCols; i++) {
          rowPosition = rowStartPosition.clone();
          rowPosition.x += i;
          explosionPositions.push(rowPosition.clone());
        };
        
        //row3Layer2
        rowCols = 3;
        rowStartPosition = explosionGridPosition.clone();
        rowStartPosition.y -= 1;
        rowStartPosition.x -= 1;
        rowStartPosition.z += 1;
        
        for (i=0; i < rowCols; i++) {
          rowPosition = rowStartPosition.clone();
          rowPosition.x += i;
          explosionPositions.push(rowPosition.clone());
        };
                
        //row1Layer3
        rowCols = 1;
        rowStartPosition = explosionGridPosition.clone();
        rowStartPosition.y += 1;
        rowStartPosition.z += 2;
        
        for (i=0; i < rowCols; i++) {
          rowPosition = rowStartPosition.clone();
          rowPosition.x += i;
          explosionPositions.push(rowPosition.clone());
        };
        
        //row2Layer3
        rowCols = 3;
        rowStartPosition = explosionGridPosition.clone();
        rowStartPosition.x -= 1;
        rowStartPosition.z += 2;
        
        for (i=0; i < rowCols; i++) {
          rowPosition = rowStartPosition.clone();
          rowPosition.x += i;
          explosionPositions.push(rowPosition.clone());
        };
        
        //row3Layer3
        rowCols = 1;
        rowStartPosition = explosionGridPosition.clone();
        rowStartPosition.y -= 1;
        rowStartPosition.z += 2;
        
        for (i=0; i < rowCols; i++) {
          rowPosition = rowStartPosition.clone();
          rowPosition.x += i;
          explosionPositions.push(rowPosition.clone());
        };
        
        //row1Layer4
        rowStartPosition = explosionGridPosition.clone();
        rowStartPosition.z += 3;
        explosionPositions.push(rowStartPosition.clone());
        
        var len = explosionPositions.length;
        for (var i=0; i < len; i++) {
          _createVoxelAtGridPos(explosionPositions[i]);
        };
      }
     
    };
    
    // ----------------------------------------------------------------
    
    function _onMouseUp(event) {
      event.preventDefault();
      
      $body.trigger(MCBM.events.MINE_END);
    };
    
    // ----------------------------------------------------------------
  
    function _render() {

      // render 3D scenes
      _maskRenderer.render( _maskScene, _camera );
      _renderer.render( _scene, _camera );
        
      //*/
      // create a composite image on display canvas with the rendered scene and mask
      _displayCanvasCtx.clearRect(0, 0, _w, _h); 
      _displayCanvasCtx.save();

        // draw mask shapes
        _displayCanvasCtx.globalCompositeOperation = 'source-over';
        _displayCanvasCtx.drawImage(_maskCanvas, 0, 0);

        // composite rendered scene
        _displayCanvasCtx.globalCompositeOperation = 'source-in';
        _displayCanvasCtx.drawImage(_renderCanvas, 0, 0);
   
      _displayCanvasCtx.restore();
      //*/

      pScope.isDirty = false;
      //debug.log("playfieldGrid :: render :: pScope.isDirty: "+pScope.isDirty);
    };
  
    // ----------------------------------------------------------------
    
    function _debugRender() {
     
      // render 3D scenes
      _maskRenderer.render( _maskScene, _camera );
      _renderer.render( _scene, _camera );
        
      //*/
      // create a composite image on display canvas with the rendered scene and mask
      _displayCanvasCtx.clearRect(0, 0, _w, _h); 
      _displayCanvasCtx.save();

        // draw mask shapes
        //_displayCanvasCtx.globalCompositeOperation = 'source-over';
        //_displayCanvasCtx.drawImage(_maskCanvas, 0, 0);

        // composite rendered scene
        //_displayCanvasCtx.globalCompositeOperation = 'source-in';
        _displayCanvasCtx.drawImage(_renderCanvas, 0, 0);
   
      _displayCanvasCtx.restore();
      //*/

      pScope.isDirty = false;
      
    };
  
    _init();
  
    // ----------------------------------------------------------------
    // public methods
    // ----------------------------------------------------------------
    
    pScope.mineAtPosition = function(mouseX, mouseY) {
      return _mineAtPosition(mouseX, mouseY); // returns block type as string
    };
    
    pScope.render = function() {
      
      if (!DEBUG) {
        _render();
      } else {
        _debugRender();      
      }
      
    };
    
    pScope.resize = function(w) {
    
      _w = w;
      
      _updateMainDisplaySize();
      
    };
    
    pScope.reset = function() {
      _reset();
    };
    
    pScope.generateCreeperDamage = function(pos) {
      _generateCreeperDamage(pos);
    };
    
    return pScope;
    
  };
  
})(jQuery);
