// ====================================================================
// Voxel Utilites
// 
// author: Nate Horstmann nate@natehorstmann.com
// ====================================================================

// ====================================================================
// @voxelGrid object
// ====================================================================
MCBM.voxelGrid = function(cols, rows, layers) {
  
  var _cols = cols,
      _rows = rows,
      _layers = layers,
      _posData = [],
      _voxelData = {};
  
  var pScope = {};
  
  function _getPosId(gridPos) {
    return gridPos.x + ',' + gridPos.y + ',' + gridPos.z;
  };
  
  /** 
    Adds a position of type THREE.Vector3 to the grid 
  */
  pScope.addVoxel = function(gridPos, voxel) {
    
    var posId = _getPosId(gridPos);
    
    // dont add the position id if its already stored
    if (!pScope.hasPos(gridPos)) { 
      _posData.push(posId);
    }
    
    // add or overwrite existing voxe
    _voxelData[posId] = voxel;
    
  };
  
  pScope.getVoxelByPos = function(gridPos) {
    return _voxelData[_getPosId(gridPos)];
  }
  
  /** 
    Checks for a position of type THREE.Vector3 in the grid 
  */
  pScope.hasPos = function(gridPos) {

    return (_posData.indexOf(_getPosId(gridPos)) == -1 ) ? false : true;
    
  };
  
  /** 
    Returns an object that contains boolean values for the sides that a position shares with other existing positions in the grid
  */
  pScope.getSharedSidesForPos = function(gridPos) {
    
    var sharedSides = {
      px: pScope.hasPos( new THREE.Vector3( gridPos.x + 1, gridPos.y, gridPos.z ) ),
      nx: pScope.hasPos( new THREE.Vector3( gridPos.x - 1, gridPos.y, gridPos.z ) ),
      py: pScope.hasPos( new THREE.Vector3( gridPos.x, gridPos.y + 1, gridPos.z ) ),
      ny: pScope.hasPos( new THREE.Vector3( gridPos.x, gridPos.y - 1, gridPos.z ) ),
      pz: pScope.hasPos( new THREE.Vector3( gridPos.x, gridPos.y, gridPos.z + 1 ) ),
      nz: pScope.hasPos( new THREE.Vector3( gridPos.x, gridPos.y, gridPos.z - 1 ) )
    };
    
    return sharedSides;
  };
  
  return pScope;
};