// Basic Particle Object
// 
// author: Nate Horstmann nate@natehorstmann.com
// ====================================================================

// ====================================================================
// @particle object
// ====================================================================
MCBM.particle = function(pos, vel) {

    var _pos = pos || new THREE.Vector3(0, 0, 0),
        _vel = vel || new THREE.Vector3(0, 0, 0);
    
    var pScope = {};
    
    // ----------------------------------------------------------------
    // public functions 
    // ----------------------------------------------------------------
    
    pScope.update = function() {
      
      _pos.addSelf(_vel);
      
    };
    
    // ----------------------------------------------------------------
    
    pScope.getPosition = function() {
      return _pos;
    };
    
    // ----------------------------------------------------------------
    
    pScope.setPosition = function( pos ) {
      _pos.copy(pos);
    };
    
    // ----------------------------------------------------------------
    
    pScope.getVelocity = function() {
      return _vel;
    };
    
    // ----------------------------------------------------------------
    
    pScope.setVelocity = function( vel ) {
      _vel.copy(vel);
    };
    
    // ----------------------------------------------------------------
    
    pScope.destroy = function() {
      _pos = null;
      _vel = null;
    };
    
    return pScope;
};