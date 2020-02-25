// Explosion Animation Object
// 
// author: Nate Horstmann nate@natehorstmann.com
// ====================================================================

// ====================================================================
// @explosion object
// ====================================================================

(function($) {
  
  MCBM.blockBreak = function(type, pos) {
    
    var _type = type,
        _pos = pos,
        _tStart = 0,
        _dampening = 0.97,
        _grav = 0.71,
        _numParticles = MCBM.randomInRange(10, 20)|0,
        _particleArray = [];
    
    var pScope = {};
        pScope.running = true;
    
    function _init() {
     
      var i=0;
      for (i; i < _numParticles; i++) {
      
        var startPos = new THREE.Vector3(MCBM.randomInRange(-25, 25), MCBM.randomInRange(-55, 10), 0.5);
    
        //use pos relative to "origin" as the heading for velocity and set it's magnitude
        var vel = new THREE.Vector3(0, 0, 0);
        vel.copy(startPos);
        vel.setLength(MCBM.randomInRange(3,10));
    
        var particle = MCBM.particle(startPos, vel);
        var $div = $('<div></div>');
        
        var size = MCBM.randomInRange(5, 15)|0;
        var imageOffsetX = MCBM.randomInRange(0, 64 - size)|0;
        var imageOffsetY = MCBM.randomInRange(0, 64 - size)|0;
        
        var x = _pos.x+startPos.x;
        var y = _pos.y+startPos.y;
        
        $div.css({
          'position':'absolute',
          'left':x+'px',
          'top':y+'px',
          'width':size+'px',
          'height':size+'px',
          'background':'url('+MCBM.rootURI+'/img/textures/minecraft/'+_type+'.png) no-repeat -'+imageOffsetX+'px -'+imageOffsetY+'px',
          'display':'none'
        });
        
        MCBM.$container.append($div);
      
        var delay = MCBM.randomInRange(0,100)|0;
        var end = delay + MCBM.randomInRange(500,750)|0;
        
        var divParticle = {
          $div:$div,
          particle:particle,
          delay:delay,
          end:end
        };
      
        _particleArray.push(divParticle);
      }
      
      _tStart = new Date().getTime();
      
    }
    
    _init();
    
    // ----------------------------------------------------------------
    // public functions
    // ----------------------------------------------------------------
    
    pScope.update = function(tCur) {
      var elapsed = tCur - _tStart,
          particlesEnded = 0,
          i=0;
      
      for (i; i < _numParticles; i++) {
        var divParticle = _particleArray[i];
        var $div = divParticle.$div;
        
        if (divParticle.delay < elapsed && elapsed < divParticle.end) {
        
          var particle = divParticle.particle;
        
          if ($div.css('display') == 'none') {
            $div.css('display', 'block');
          }
        
          var pVel = particle.getVelocity();
          pVel.x *= _dampening;
          pVel.y += _grav;
          particle.setVelocity(pVel);
          particle.update(tCur);

          // update position & scale based on particle pos  
          var particlePos = particle.getPosition();
        
          var x = _pos.x + particlePos.x;
          var y = _pos.y + particlePos.y;
          $div.css({
            'left':x+'px',
            'top':y+'px',
          });
          
        } else if (elapsed > divParticle.end) {
          particlesEnded++;
          $div.css('display', 'none');
        }
        
        if (particlesEnded == _numParticles) {
          pScope.running = false; 
        }
        
      }
      
    };
    
    pScope.destroy = function() {
      //debug.log("blockBreak :: destroy()"); 
      var i=0;
      
      for (i; i < _numParticles; i++) {
        var divParticle = _particleArray[i];
        
        divParticle.$div.remove();
        divParticle.$div = null;
        divParticle.particle.destroy();
        divParticle.particle = null;
      }
      
      _particleArray = null;
      _pos = null;
    };
    
    return pScope;
    
  };
  
})(jQuery);
