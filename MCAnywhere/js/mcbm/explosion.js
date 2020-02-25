// Explosion Animation Object
// 
// author: Nate Horstmann nate@natehorstmann.com
// ====================================================================

// ====================================================================
// @explosion object
// ====================================================================

(function($) {

  MCBM.explosion = function(pos, targetCtx) {
  
    var $body = $('body'),
        _pos = pos,
        _targetCtx = targetCtx,
        _numImageLoads = 0,
        _imagesLoaded = 0,
        _explosionImages = [],
        _smokeImages = [],
        _numExplosionParticles = 10,
        _numSmokeParticles = 20,
        _spriteParticles = [],
        _numSpriteParticles = 0,
        _dampening = { explosion: 0.95, smoke: 0.97},
        _playQueued = false,
        _isPlaying = false,
        _isReady = false,
        _focalLength = 1000,
        _tStart;
  
    var pScope = {};
        pScope.isPlaying = _isPlaying;
      
    // ----------------------------------------------------------------
    // private functions
    // ----------------------------------------------------------------
  
    function _init() {
  
      // load images
      var explosionImageURIs = [
       MCBM.rootURI + '/img/sprites/explosion-light-gray.png',
       MCBM.rootURI + '/img/sprites/explosion-dark-gray.png'
      ];
    
      var smokeImageURIs = [
        MCBM.rootURI + '/img/sprites/smoke.png',
        MCBM.rootURI + '/img/sprites/smoke-dark-gray.png'
      ]
    
      _numImageLoads = explosionImageURIs.length + smokeImageURIs.length;
    
      var i;
      for (i = 0; i < explosionImageURIs.length; i++) {
        var explosionSpriteURI = explosionImageURIs[i];
        var explosionImg = document.createElement('img');
        explosionImg.crossOrigin = '';
        explosionImg.onload = _onImageLoaded;
        explosionImg.src = explosionSpriteURI;
        _explosionImages.push(explosionImg);
      };
    
      for (i = 0; i < smokeImageURIs.length; i++) {
        var smokeSpriteURI = smokeImageURIs[i];
        var smokeImg = document.createElement('img');
        smokeImg.crossOrigin = '';
        smokeImg.onload = _onImageLoaded;
        smokeImg.src = smokeSpriteURI;
        _smokeImages.push(smokeImg);
      };
    
    };
  
    // ----------------------------------------------------------------
  
    function _reset() {
      _spriteParticles = [];
      _createSpriteParticles();
    }
  
    // ----------------------------------------------------------------
  
    function _onImageLoaded() {
    
      _imagesLoaded++;
    
      if (_imagesLoaded == _numImageLoads) {
        // images loaded
        _createSpriteParticles();
      }
                
    };
  
    // ----------------------------------------------------------------
  
    function _createSpriteParticles() {
    
      // explosion particles ("shockwave" looking sprite)
      for (var i=0; i < _numExplosionParticles; i++) {
      
        var baseScale = MCBM.randomInRange(0.25,5);
        var sprite = MCBM.sprite(MCBM.randomFromArray(_explosionImages), 64, 64, baseScale);
        var pos = new THREE.Vector3(MCBM.randomInRange(-80, 80), MCBM.randomInRange(-80, 80), 0.5);
    
        //use pos relative to "origin" as the heading for velocity and set it's magnitude
        var vel = new THREE.Vector3(0, 0, 0);
        vel.copy(pos);
        vel.setLength(MCBM.randomInRange(3,15));
    
        var particle = MCBM.particle(pos, vel);
    
        var spriteParticle = {
          type:"explosion",
          sprite:sprite,
          particle:particle,
          delay:MCBM.randomInRange(0,150),
          duration:MCBM.randomInRange(300,450),
        }
      
        _spriteParticles.push(spriteParticle);
      }
    
      // smoke particles
      for (var i=0; i < _numSmokeParticles; i++) {
      
        var baseScale = MCBM.randomInRange(0.5,2);
        var sprite = MCBM.sprite(MCBM.randomFromArray(_smokeImages), 24, 24, baseScale);
        var pos = new THREE.Vector3(MCBM.randomInRange(-100, 100), MCBM.randomInRange(-100, 100), 0.5);
    
        //use pos relative to "origin" as the heading for velocity and set it's magnitude
        var vel = new THREE.Vector3(0, 0, 0);
        vel.copy(pos);
        vel.setLength(MCBM.randomInRange(3,10));
    
        var particle = MCBM.particle(pos, vel);
    
        var spriteParticle = {
          type:"smoke",
          sprite:sprite,
          particle:particle,
          delay:MCBM.randomInRange(25,170),
          duration:MCBM.randomInRange(1000,1600),
        }
      
        _spriteParticles.push(spriteParticle);
      }
        
      _numSpriteParticles = _spriteParticles.length;
    
      _isReady = true;
        
      if (_playQueued) {
        pScope.play();
      }
    
    };
  
    _init();
  
    // ----------------------------------------------------------------
    // public functions
    // ----------------------------------------------------------------
  
    pScope.update = function(tCur) {
      var elapsed = tCur - _tStart;
    
      if (!_isPlaying) {
        //debug.log("explosion :: update :: called when not playing - return ");
        return;
      }
    
      //debug.log("explosion :: update :: _numSpriteParticles: "+_numSpriteParticles);
    
      var i = _numSpriteParticles;
      while (i--) {
        var spriteParticle = _spriteParticles[i];
        var sprite = spriteParticle.sprite;
        var particle = spriteParticle.particle;
      
        // start sprites that have finished their delay
        if (!sprite.getHasPlayed()) {
          if (elapsed >= spriteParticle.delay) {
            sprite.play(spriteParticle.duration);
          }
        }
      
        var dampening = _dampening[spriteParticle.type];
        var pVel = particle.getVelocity();
        particle.setVelocity(pVel.multiplyScalar(dampening));
        particle.update(tCur);
      
        // update position & scale based on particle pos  
        var particlePos = particle.getPosition();
      
        // do a quick and dirty 3D projection with the particle position    
        if (0 < particlePos.z && particlePos.z < _focalLength) {
        
          var sz = _focalLength / (_focalLength - particlePos.z);
          var x = _pos.x + (particlePos.x * sz);
          var y = _pos.y + (particlePos.y * sz);
          var scale = sprite.getBaseScale() * sz;
                
          sprite.setScale(scale);
          sprite.setPosition(new THREE.Vector2(x, y));
          sprite.update(tCur);
        
        } else {
          // particle has moved beyond visible region - need to stop sprites play state
        }
      
      }
    
    };
  
    // ----------------------------------------------------------------
  
    pScope.setPosition = function(pos) {
      _pos.copy(pos);
    };
  
    // ----------------------------------------------------------------
  
    pScope.render = function() {
    
      if (!_isPlaying) {
        return;
      }
    
      //debug.log("Explosion :: render");
      _isPlaying = false; // assume play is finished unless a sprite needs drawing
    
      var i = _numSpriteParticles;
      while (i--) {
        var sprite = _spriteParticles[i].sprite;
      
        if (sprite.getIsPlaying()) {
          sprite.draw(_targetCtx);
          _isPlaying = true; // continue playing explosion as long as a sprite needs drawing
         } else if ( !sprite.getHasPlayed() ) {
          _isPlaying = true; // continue playing as long as a sprite hasnt played yet
        }
      }
    
    
      if (_isPlaying == false) {
        $body.trigger(MCBM.events.EXPLOSION_COMPLETE);
      };
    
      pScope.isPlaying = _isPlaying;
    
    };
  
    // ----------------------------------------------------------------
  
    pScope.play = function() {
    
      if (!_isReady) {
        _playQueued = true;
        return;
      }
    
      if (_isPlaying) {
        return;
      }
    
      _playQueued = false;
      pScope.isPlaying = _isPlaying = true;
    
      _tStart = new Date().getTime();
      pScope.update(_tStart);
    
    };
  
    pScope.stop = function() {
      pScope.isPlaying = _isPlaying = false;
    };
  
    pScope.reset = function() {
      _reset();
    }
  
    // ----------------------------------------------------------------
  
    return pScope;
  
  };

})(jQuery);
