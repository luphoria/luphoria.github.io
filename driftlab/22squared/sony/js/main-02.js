(function($){
  
	MCBM.main = function() {
  	// ----------------------------------------------------------------
	  // Define Vars
	  // ----------------------------------------------------------------
  
	  // DOM and canvas vars
	  var $win = $(window),
	      container, 
	      stats,
	      renderCanvas,
	      maskCanvas,
	      displayCanvas,
	      displayCanvasCtx;
        
	  // 3D scene vars
	  var camera,
	      scene,
	      maskScene,
	      renderer,
	      maskRenderer,
	      _useWebGL = false,
	      _gridDirty = true;
      
	      // geometry 
	      var maskPlane;
      
	      // textures
	      var grassDirtTex = null,
	          dirtTex = null,
	          stoneTex = null,
						gravelTex = null,
	          coalOreTex = null,
	          leadOreTex = null,
	          goldOreTex = null,
	          lavaTex = null,
	          materialsLookup = null,
	          materialLayerStart = null,
	          materialIndexes = null,
						texturesLookup = null,
						randomMaterialTypes = null,
						materialTypeLookup = null;
  
	  // interactivity vars
	  var projector,
	  ray,
	  mouse2D,
	  mouse3D;
  
	  // voxel grid definition vars
	  var rowCol = 15,
	      gridSize = 1500,
	      gridCellSize = gridSize/rowCol,
	      maxLayers = 6,
	      voxelGrid = MCBM.voxelGrid();

	  // ----------------------------------------------------------------
	  // ----------------------------------------------------------------

	  function _init() {
			debug.log("===== Sony Ericsson Xperia Play: Minecraft Bookmarklet Initialized =====");
		
			BrowserDetect.init();
			_useWebGL = ($('html').hasClass('webgl') && BrowserDetect.isChrome);
    
	    var winW = $win.width(),
	        winH = $win.height();
    
	    container = document.createElement( 'div' );
	    document.body.appendChild( container );
	    $(container).css({
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					overflow: 'hidden',
					'z-index': '10000'
			});
    
	    // 3D scene
	    camera = new THREE.Camera( 25, winW/winH, 1, 10000 );
	    camera.position.z = 1400;
	    camera.target.position.z = 0;

	    scene = new THREE.Scene();
	    maskScene = new THREE.Scene();
    
	    maskPlane = new THREE.Mesh( new THREE.PlaneGeometry( gridSize, gridSize, rowCol, rowCol ), new THREE.MeshFaceMaterial() );
	    maskScene.addObject( maskPlane );
    
	    _drawReferenceGrid();
			
	    // interactivity
	    projector = new THREE.Projector();
	    mouse2D = new THREE.Vector3( 0, 0, 0 );
	    ray = new THREE.Ray( camera.position, null );

	    // textures
	    grassDirtTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/grass_dirt.png' ),
	    dirtTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/dirt.png' );
	    stoneTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/stone.png' );
			gravelTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/gravel.png' );
    	coalOreTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/coal.png' );
			leadOreTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/lead.png' );
			goldOreTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/gold.png' );
			lavaTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/lava.png' );
			//waterTex = _loadTexture( MCBM.rootURI + '/img/textures/minecraft/water.png' );

	    /*/
			materialsLookup[0] = [ // "top" layer with grass on edges
	      grassDirtTex, // px
	      grassDirtTex, // nx

	      grassDirtTex, // py
	      grassDirtTex,  // ny

	      dirtTex, // pz
	      dirtTex // nz
	    ];
    	//*/
			
			randomMaterialTypes = [
				"gravel",
				"stone",
				"coal",
				"lead",
				"gold"
			];
			
			texturesLookup = {
				gravel: gravelTex,
				stone: stoneTex,
				coal: coalOreTex,
				lead: leadOreTex,
				gold: goldOreTex
			};
			
	    materialLayerStart = {
	      TOP: 0,
	      DIRT: 1,
	      ROCK: 3
	    };
	
	    materialIndexes = {
	      TOP: 0,
	      DIRT: 1,
	      ROCK: 2,
				LAVA: 7
	    };
    	
			_generateGridMaterials();

	    // canvas & rendering
	    renderCanvas = document.createElement( 'canvas' );
	    maskCanvas = document.createElement( 'canvas' );
	    displayCanvas = document.createElement( 'canvas' );
	    displayCanvasCtx = displayCanvas.getContext("2d");
    
	    renderer = ( _useWebGL ) ? new THREE.WebGLRenderer({canvas:renderCanvas}) : new THREE.CanvasRenderer({canvas:renderCanvas});
	    renderer.setSize(winW, winH);
	    displayCanvas.width = winW;
	    displayCanvas.height = winH;
    
	    maskRenderer = new THREE.CanvasRenderer({canvas:maskCanvas}); // using canvas for the mask buffer runs faster for some reason
	    //maskRenderer = new THREE.WebGLRenderer({canvas:maskCanvas});
	    maskRenderer.setSize( winW, winH );
    
	    //container.appendChild(renderer.domElement);
	    container.appendChild(displayCanvas);
	    //container.appendChild(maskCanvas);
    
	    // framerate display
	    stats = new Stats();
	    stats.domElement.style.position = 'absolute';
	    stats.domElement.style.top = '0px';
	    container.appendChild( stats.domElement );
	    $(stats.domElement).find('canvas').css('position','static');
    
	    // event handling
	    //document.addEventListener( 'mousemove', _onMouseMove, false ); not needed yet
	    displayCanvas.addEventListener( 'mousedown', _onMouseDown, false );
    
	  };
  
	  // ----------------------------------------------------------------
  
	  function _drawReferenceGrid() {
    
	    // opacity can be turned on while mask is diabled to see where playfield "tiles" are  
	    var material = new THREE.MeshLambertMaterial( { color: 0x00ff00, opacity: 0, shading: THREE.FlatShading } );
	    material.wireframe = true;
    
	    // this plane is used to capture the 3D location of mouse interaction to set mask tiles and voxel geometry
	    var refPlane = new THREE.Mesh( new THREE.PlaneGeometry( gridSize, gridSize, rowCol, rowCol ), material );
	    refPlane.position.z = -1;
	    scene.addObject( refPlane );
    
	  }
  
	  // ----------------------------------------------------------------
  
	  function _loadTexture( path ) {
    
	    var image = new Image();
	    var texture  = new THREE.Texture( image, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter );
			    
	    image.onload = function () { texture.needsUpdate = true; };
			image.crossOrigin = '';
	    image.src = path;
	    	
	   	return (_useWebGL) ? new THREE.MeshLambertMaterial( { map: texture } ) : new THREE.MeshBasicMaterial( { map: texture } );

	  };
    
	  // ----------------------------------------------------------------
  
	  function _createVoxel(position) {
    
	    // get grid position
	    var offsetX = position.x + gridSize * 0.5;
	    var offsetY = position.y + gridSize * 0.5;
	    var col = Math.floor(offsetX/gridCellSize);
	    var row = Math.floor(offsetY/gridCellSize);
	    //debug.log("attempting to create new voxel at grid pos : ("+col+", "+row+")");
    
	    var destGridPos = new THREE.Vector3( col, row, 0);
    
	    // only draw the mask tile once for a grid pos
	    if (!voxelGrid.hasPos(destGridPos)) {
	      _createMaskTile(position);
	    }
    
	    while ( voxelGrid.hasPos(destGridPos) ) {
	      destGridPos.z += 1;
	    }
    
	    if (destGridPos.z <= maxLayers) {
	      //debug.log("an empty grid position exists at :: ("+destGridPos.x+", "+destGridPos.y+", "+destGridPos.z+")");
      
	      var materials = _getMaterialsByGridPos(destGridPos);
      
	      var sharedSides = voxelGrid.getSharedSidesForPos(destGridPos);
	      var displayedSides = _getDisplayedFromSharedSides(sharedSides);
      
	      // set the z position based on the gridPos.z (layer) and gridCellSize (offset by half to center)      
	      position.z = -destGridPos.z * gridCellSize - gridCellSize * 0.5;
	      var voxel = _createVoxelGeometry(materials, displayedSides, position);
      
	      scene.addObject( voxel );
	      voxelGrid.addVoxel(destGridPos, voxel);
      
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
	          var updatedDisplayedSides = _getDisplayedFromSharedSides( voxelGrid.getSharedSidesForPos(updateGridPos) );
          
	          /*/
	          debug.log("updating preexisting grid pos :: ("+updateGridPos.x+", "+updateGridPos.y+", "+updateGridPos.z+")");
	          debug.log("displayedSides at updateGridPos:: ");
	          debug.log(updatedDisplayedSides);
	          //*/
          
	          // only generate new geometry if at least one side is displayed otherwise just set to null
	          var isVoxelDisplayed = false;
	          for (side in updatedDisplayedSides) {
	            isVoxelDisplayed = updatedDisplayedSides[side];
	            if (isVoxelDisplayed)
	              break;
	          }
          
	          // store the position data for the voxel, then remove it and replace with updated geometry 
	          var oldVoxel = voxelGrid.getVoxelByPos(updateGridPos);
	          if (oldVoxel) {
	            var oldPosition = new THREE.Vector3();
	            oldPosition.copy(oldVoxel.position);
	            scene.removeObject( oldVoxel );
	          }
          
	          var updatedVoxel = (isVoxelDisplayed) ? _createVoxelGeometry(updateMaterials, updatedDisplayedSides, oldPosition) : null;
	          if (updatedVoxel) {
	            scene.addObject( updatedVoxel );
	          }
          
	          voxelGrid.addVoxel(updateGridPos, updatedVoxel);
	        }
	      }
      
	      _gridDirty = true;
      
	    } else {
	      debug.log("you have reached the maximum layers at this grid position :: ");
	    }
    
	  };
  
	  function _createVoxelGeometry(materials, displayedSides, position) {
    
	    // make the new voxel geometry
	    var voxel = new THREE.Mesh( new THREE.CustomCubeGeometry( gridCellSize, gridCellSize, gridCellSize, 1, 1, 1, materials, true, displayedSides ), new THREE.MeshFaceMaterial() );
	    voxel.position.x = position.x;
	    voxel.position.y = position.y;
	    voxel.position.z = position.z;
	    voxel.matrixAutoUpdate = false;
	    voxel.updateMatrix();
	    voxel.overdraw = true;
  
	    return voxel;
    
	  };
  	
		function _generateGridMaterials() {
					
			var layer = 0,
					row = 0,
					col = 0;
			
			// initialize arrays
			materialsLookup = [];
			materialTypeLookup = [];
			for (layer = 0; layer <= maxLayers; layer++) {
				materialTypeLookup[layer] = [];
				materialsLookup[layer] = [];	
				for (row = 0; row < rowCol; row++) {
					materialTypeLookup[layer][row] = [];
					materialsLookup[layer][row] = [];
				};
			};			
			
			// generate the abstract type of material at each position
			for (layer = 1; layer <= maxLayers; layer++) {		
				for (row = 0; row < rowCol; row++) {
					for (col = 0; col < rowCol; col++) {

						var materialType = MCBM.randomFromArray(randomMaterialTypes);

						materialTypeLookup[layer][row][col] = materialType;
						
						//debug.log("setting material at gridPosition: ("+col+", "+row+", "+layer+"): "+materialType);
					};
				};
			};
			
			// now build the actual materials arrays for each position based on the generated data for the material types
			//*/
			for (layer = 1; layer <= maxLayers; layer++) {		
				for (row = 0; row < rowCol; row++) {
					for (col = 0; col < rowCol; col++) {
						
						var pxCol = (col < rowCol - 1 ) ? col + 1 : col;
						var nxCol = (col > 0) ? col - 1 : col;
						
						var pxTex = (layer > 1) ? texturesLookup[ materialTypeLookup[layer][row][pxCol] ] : dirtTex;
						var nxTex = (layer > 1) ? texturesLookup[ materialTypeLookup[layer][row][nxCol] ] : dirtTex;
						
						var pyRow = (row < rowCol - 1 ) ? row + 1 : row;
						var nyRow = (row > 0) ? row - 1 : row;
						
						var pyTex = (layer > 1) ? texturesLookup[ materialTypeLookup[layer][pyRow][col] ] : dirtTex;
						var nyTex = (layer > 1) ? texturesLookup[ materialTypeLookup[layer][nyRow][col] ] : dirtTex;
						
						var nzLayer = layer + 1;
						var nzTex = (layer < maxLayers) ? texturesLookup[ materialTypeLookup[nzLayer][row][col] ] : lavaTex;
						
						var materials = [
				      pxTex,
				      nxTex,

				      pyTex,
				      nyTex,

				      stoneTex, // pz - never displayed
				      nzTex,
				    ];
						
						materialsLookup[layer][row][col] = materials
					};
				};
			};
			//*/
		};

	  function _getMaterialsByGridPos(gridPos) {
    	
			if (gridPos.z > 0) {
				return materialsLookup[gridPos.z][gridPos.y][gridPos.x];
				
			} else {
				
				return [ // "top" layer with grass on edges
		      grassDirtTex, // px
		      grassDirtTex, // nx

		      grassDirtTex, // py
		      grassDirtTex,  // ny

		      dirtTex, // pz
		      dirtTex // nz
		    ];
		
			}
		
	  };
	
  
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
	    var maskPlane = new THREE.Mesh( new THREE.PlaneGeometry( gridCellSize + 1, gridCellSize + 1, 1, 1 ), material);
	    maskPlane.position.x = position.x;
	    maskPlane.position.y = position.y;
	    maskPlane.position.z = position.z;
    
	    maskScene.addObject( maskPlane );
    
	  };
  
	  // ----------------------------------------------------------------

	  function _onMouseMove( event ) {

	    event.preventDefault();

	    var scrollTop = $(window).scrollTop();
    
	    mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouse2D.y = -( (event.clientY + scrollTop) / window.innerHeight ) * 2 + 1;

	  };
  
	  // ----------------------------------------------------------------
  
	  function _onMouseDown( event ) {

	    event.preventDefault();
    
	    var scrollTop = $(window).scrollTop();
			var scrollLeft = $(window).scrollLeft();
    
	    //mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    //mouse2D.y = -( (event.clientY + scrollTop) / window.innerHeight ) * 2 + 1;
    	
			mouse2D.x = ( (event.clientX + scrollLeft) / $(displayCanvas).width() ) * 2 - 1;
			mouse2D.y = -( (event.clientY + scrollTop) / $(displayCanvas).height() ) * 2 + 1;

	    // get the 3d mouse position and a create a ray based on camera position to find intersection
	    mouse3D = projector.unprojectVector( mouse2D.clone(), camera );
	    ray.direction = mouse3D.subSelf( camera.position ).normalize();

	    var intersects = ray.intersectScene( scene );

	    if ( intersects.length > 0 ) {
	      var faceCenter = intersects[ 0 ].face.centroid;
      
	      _createVoxel(faceCenter);
	    }
     
	  };
  
	  // ----------------------------------------------------------------

	  function _animate() {

	    requestAnimationFrame( _animate );

	    _render();
	    stats.update();

	  };
  
	  // ----------------------------------------------------------------
  
	  function _render() {
    
	    if (_gridDirty) {
	      // render 3D scenes
	      maskRenderer.render( maskScene, camera );
	      renderer.render( scene, camera );
    
	      //*/
	      // create a composite image on display canvas with the rendered scene and mask
	      displayCanvasCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height); 
	      displayCanvasCtx.save();

	        // draw mask shapes
	        displayCanvasCtx.globalCompositeOperation = 'source-over';
	        displayCanvasCtx.drawImage(maskCanvas, 0, 0);
    
	        // composite rendered scene
	        displayCanvasCtx.globalCompositeOperation = 'source-in';
	        displayCanvasCtx.drawImage(renderCanvas, 0, 0);
          
	      displayCanvasCtx.restore();
	      //*/
      
	      _gridDirty = false;
	    }
    
	  };
  
	  // ----------------------------------------------------------------
	  // ----------------------------------------------------------------
  
	  _init();
	  _animate();
	
	};
  
})(jQuery);
