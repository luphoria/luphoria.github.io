/*global $*/
/*global map*/
/*MODDED by luphoria to give extra items*/
$(function() {

    var input = {x: 0, y: 0, wheel: 0};
    var ratios = {x: 0, y: 0, zoom: 0 };
    var steps = {x: 0.05, y: 0.05, zoom: 0.05 };
    var tw = 32, th = 32;    
    var $map = $('#map');
    var $mapbox = $('#map-box');
    var $selector = $('#selector');
    var $help = $('#help');
    var $seltile_left = false;
    var $seltile_right = false;
    var button_left_down = false;
    var button_right_down = false;
    var servermap = JSON.stringify(map);
    var editmode = 'draw';
    var $selection;
    var selection;
    var clipboard = false;    
    $mapbox.css('height', ($mapbox.width() * 13 / 20) + 'px');
    var $flash_message = $('<div></div>').addClass('flash-message').appendTo($mapbox).css({ 
        top: ($mapbox.height()/2)+'px', left: ($mapbox.width()/2)+'px' 
    }).hide();
    var $iframe;
    
    window.close_game = function() {
        $iframe.remove();
    };
    
    var histo = function() {
        var list = [], inptr = 0, outptr = 0, size = 0, saved = 0, max_size = 16;
        return {
            save: function(map) {
                var string = JSON.stringify(map);
                if(size > 0) {
                    if(list[inptr > 0 ? inptr - 1 : max_size - 1] == string) return;
                }
                if(size==max_size) { outptr++; outptr %= max_size; }
                else size++;
                saved = size;
                list[inptr++] = string;
                inptr %= max_size;
                console.log("Push", list.length, inptr, outptr, size, saved);
            },
            undo: function(map) {
                if(size == 0) return null;
                if(saved == size) { // first undo, save current state
                    console.log("Save current");
                    if(size==max_size) { outptr++; outptr %= max_size; }
                    list[inptr] = JSON.stringify(map);
                }                
                inptr--;
                size--;
                if(inptr<0) inptr += max_size;
                console.log('Undo', list.length, inptr, outptr, size, saved);
                return JSON.parse(list[inptr]);
            },
            redo: function() {
                if(saved > size) {
                    size++;
                    inptr++;
                    inptr %= max_size;
                    var string = list[inptr];
                    console.log("Read at ", inptr);
                    console.log('Redo', list.length, inptr, outptr, size, saved);
                    return JSON.parse(string);
                }
                return null;
            }
        };
    }();
    
    var selector = { width: 8, height: 10, data: 
		'0,3,2,5,7,6,36,37,' +	// base TODO 6,10,11, 38
		'9,27,8,21,12,22,45,46,' +		// 45
		'54,51,50,52,57,55,56,53,' +		// miam
		'41,17,39,43,23,19,13,25,' +
		'42,18,40,44,24,20,14,26,' +	// actifs
		'75,76,74,77,61,62,60,63,' +	// fioles + clés
		'71,72,70,73,65,66,64,67,' +	// glues + portes
		'128,136,140,132,47,15,16,34,' + // Scarabé + Limace
		'10,11,103,54,54,54,54,54,' + // Papillon + Abeille
		'29,30,0,31,32,100,101,102,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0' // padding
	}
	selector.data = selector.data.split(',');
		
    // var xyToCell = function(x, y) { return y * cols + x; };
    var updateView = function($box, $in, mw, mh, ratios) {
        var vw = $box.width();
        var vh = $box.height();
        var min_scale = Math.min(vw / mw, vh / mh);
        var max_scale = Math.max(vw / (20 * tw), vh / (13 * th));
        var s = min_scale + (max_scale - min_scale) * ratios.zoom;
        var sw = mw * s;
        var sh = mh * s;
        var dx = (sw - vw) * ratios.x;
        var dy = (sh - vh) * ratios.y;
        var ox = - dx;
        var oy = - dy;
        
        //$('#debug').text(s + ' ' + vw + "," + vh + ' (' + mw + ',' + mh + ') [' + sw + ',' + sh + '] (' + ox + ',' + oy + ')');
        $in.css({ transformOrigin: "0% 0%", transform: "translateX(" + ox + "px) translateY(" + oy +"px) scale(" + s + ") " });
    };
    
    var setTile = function($tile, tile) {
        var pic = tilesdef[tile-0].pics[0];
        var px = 32 * (pic % 16);
        var py = 32 * Math.floor(pic/16);
        $tile.css({ backgroundPosition: '-' + px + 'px -' + py + 'px' });
        $tile.data('tile', tile);
    }

    var flashMessage = function(text) {
        $flash_message.show().text(text);
        setTimeout(function() {
            $flash_message.fadeOut('fast');
        }, 300);
    };
    
    var showHelp = function($tile) {
        var id = $tile.data('id');
        var def = tilesdef[id];
        setTile($('.tile', $help), id); 
        $('.name', $help).text(def.name);
        //$('<p></p>').appendTo($help).text($tile.data('id'));
    };
    
    $('#error').hide();
    
    //-----------------------------------------------------------------------------------------
    // Events
    //-----------------------------------------------------------------------------------------

    var buildMap = function($obj, map, mousedown, mousemove, isSelector) {
        $obj.empty();
        for(var y=0,i=0;y<map.height;y++) {
            for(var x=0;x<map.width;x++,i++) {
                var $tile = $('<div></div>').addClass('tile').css({ top: (y*th) + 'px', left: (x*tw) + 'px' }).data('index', i).appendTo($obj);
                setTile($tile, map.data[i]);
                var lock = !isSelector && (x==0 || y==0 || x==map.width-1 || y==map.height-1);
                if(!lock) $tile.mousedown(mousedown).mousemove(mousemove);
                if(isSelector) $tile.data('id', map.data[i]).mouseover(function() { showHelp($(this)); });                
            }
        }
    };

    var refreshSettings = function() {
        console.log("refreshSettings");
        $('#set-name').text(map.name);
        $('#set-score').text(map.score);
        $('#set-time').text(map.time);
        $('#set-size').text(map.width + "x" + map.height);
    };

    var normalizeSelection = function() {
        return {
            x: selection.x2 >= selection.x1 ? selection.x1 : selection.x2,
            y: selection.y2 >= selection.y1 ? selection.y1 : selection.y2,
            w: selection.x2 >= selection.x1 ? selection.x2 - selection.x1 + 1 : selection.x1 - selection.x2 + 1,
            h: selection.y2 >= selection.y1 ? selection.y2 - selection.y1 + 1 : selection.y1 - selection.y2 + 1
        };
    };  

    var updateSelRatio = function() {
        var ratio = $('#ratio').val();
        $('#leftratio').text((100-ratio)+'%');
        $('#rightratio').text(ratio+'%');
    }
    
    var updateSelected = function() {
        $seltile_left.addClass('selected').addClass('left');
        $seltile_right.addClass('selected').addClass('right');
        setTile($('#lefttile'), $seltile_left.data('tile'));
        setTile($('#righttile'), $seltile_right.data('tile'));
    };
    
    var updateSelection = function() {
        if(selection) {
            var s = normalizeSelection();  
            $selection.css({ left: (s.x * tw) + 'px', top: (s.y * th) + 'px', width: (s.w * tw) + 'px', height: (s.h * th) + 'px' }).show();
            $('#toolbox .need-selection').addClass('has-selection');
        }
        else {
            $selection.hide();
            $('#toolbox .need-selection').removeClass('has-selection');
        }
    };
    
    var refreshAll = function() {
        refreshSettings();
        buildMap($map, map, function(event) {
            button_left_down = event.which === 1;
            button_right_down = event.which === 3;
            if(editmode=='draw') {
                histo.save(map);
                if(button_left_down || button_right_down) draw($(this));
            }
            else if(editmode=='select' && button_left_down) {
                var i = $(this).data('index');                
                var x = i % map.width;
                var y = Math.floor(i / map.width);
                selection = { x1: x, y1: y, x2: x, y2: y }
                updateSelection();
            }
            return false;
        }, function(event) {
            if(editmode=='draw') {
                if(button_left_down || button_right_down) draw($(this));
            }
            else if(editmode=='select' && button_left_down) {
                var i = $(this).data('index');                
                selection.x2 = i % map.width;
                selection.y2 = Math.floor(i / map.width);
                updateSelection();
            }
            return false;
        }, false);
        $selection = $('<div></div>').attr('id', 'selection').appendTo($map).hide();
        if(editmode=='select') updateSelection();
    }
    
    buildMap($selector, selector, function(event) {        
        $('.tile', $selector).removeClass('selected').removeClass('left').removeClass('right');
        if(event.which==1) {
            $seltile_left = $(this);
        }
        else {
            $seltile_right = $(this);
        }
        updateSelected();
        return false;
    }, function() {}, true);    

    refreshAll();
    $seltile_left = $('.tile', $selector).eq(9);
    $seltile_right = $('.tile', $selector).eq(1);
    updateSelected();    
    
    var draw = function($tile) {
        var seltile = false;
        if(button_left_down) seltile = $seltile_left.data('tile');
        if(button_right_down) seltile = $seltile_right.data('tile');
        if(seltile!==false) {
            setTile($tile, seltile);
            var i = $tile.data('index');
            map.data[$tile.data('index')] = seltile;
        }
    }
    
    $(document).mouseup(function(event) {
        if(event.which==1) button_left_down = false;
        if(event.which==3) button_right_down = false;        
    }).keydown(function(event) {
        var key = event.which;
        if(key==37) input.x = -1;
        if(key==39) input.x = 1;
        if(key==38) input.y = -1;
        if(key==40) input.y = 1;
        if(key==107) input.wheel = 1;
        if(key==109) input.wheel = -1;
        console.log(key);
    }).keyup(function(event) {
        var key = event.which;
        if(key==37) input.x = 0;
        if(key==39) input.x = 0;
        if(key==38) input.y = 0;
        if(key==40) input.y = 0;
        if(key==107) input.wheel = 0;
        if(key==109) input.wheel = 0;
    }).on("contextmenu", function(event) { 
        return false; 
    });;
    
    setInterval(function() {
        if(input.x < 0) { ratios.x -= steps.x; if(ratios.x < 0) ratios.x = 0; }
        if(input.x > 0) { ratios.x += steps.x; if(ratios.x > 1) ratios.x = 1; }
        if(input.y < 0) { ratios.y -= steps.y; if(ratios.y < 0) ratios.y = 0; }
        if(input.y > 0) { ratios.y += steps.y; if(ratios.y > 1) ratios.y = 1; }
        if(input.wheel < 0) { ratios.zoom -= steps.zoom; if(ratios.zoom < 0) ratios.zoom = 0; }
        if(input.wheel > 0) { ratios.zoom += steps.zoom; if(ratios.zoom > 1) ratios.zoom = 1; }
        updateView($('#map-box'), $('#map'), map.width * tw, map.height * th, ratios);
    }, 25);
    
    $('#ratio').change(updateSelRatio).on('input', updateSelRatio);
    
    $('#settings-cancel').click(function() {
        $('#map-editor').show();
        $('#map-settings').hide();
        return false;
    });
    
    $('#settings-update').click(function() {
        $('.error', $(this).closest('.form')).hide();
        var validate = function(caption, $input) {
            var min = $input.attr('min') - 0;
            var max = $input.attr('max') - 0;
            var v = $input.val();
            if(v-0 != v || v < min || v > max) {
                $('.error', $input.closest('.form-group')).text(caption + ' must be a number between ' + min + ' and ' + max).show();
                return false;
            }
            return true;
        }
        var errors = 0;
        if(!validate('Score', $('#score'))) errors++;
        if(!validate('Time', $('#time'))) errors++;
        if(!validate('Width', $('#width'))) errors++;
        if(!validate('Height', $('#height'))) errors++;
        if(errors == 0) {
            var width = $('#width').val();
            var height = $('#height').val();
            if(width!=map.width || height!=map.height) {
                var data = [];
                for(var y=0,i=0;y<height;y++) for(var x=0;x<width;x++,i++) {
                    if(x==0 || y==0 || x==width-1 || y==height-1) data[i] = 2; // Mur
                    else {
                        if(x<map.width && y<map.height) data[i] = map.data[y*map.width+x];
                        else data[i] = 3; // Terre
                    }
                }
                map.data = data;
                selection = false;
            }
            map.name = $('#name').val();
            map.score = $('#score').val();
            map.time = $('#time').val();
            map.width = width;
            map.height = height;
            refreshAll();
            $('#map-editor').show();
            $('#map-settings').hide();
            histo.save(map);
        }
        $('#map-editor').show();
        $('#map-settings').hide();     
        return false;
    });

    //----------------------------------------------------------------------------------------------------------------
    // Toolbar
    //----------------------------------------------------------------------------------------------------------------

    var checkSaved = function() {
        return 'Are you sure you want to leave?';
    }

    $('#btn-back').click(function() {
        if(servermap != JSON.stringify(map)) {
            if(confirm('map not saved, do you realy want to quit ?')!=true) return false;
        }
        $(window).off('beforeunload', checkSaved);
        return true;
    });

    $('#btn-setting').click(function() {
        $('#name').val(map.name);
        $('#score').val(map.score);
        $('#time').val(map.time);
        $('#width').val(map.width);
        $('#height').val(map.height);
        $('#map-editor').hide();
        $('#map-settings').show();     
        return false;
    });

    var save = function(onSuccess) {    
        var json = JSON.stringify(map);
        if(json == servermap) {
            onSuccess();
        }
        else {
            var $error = $('#error');
            $error.hide();
            $.post(save_url, { map: JSON.stringify(map) }, function(data) {
                if(data.status=='ok') {
                    servermap = json;
                    onSuccess();
                }
                else if(data.status=='error') {
                    $error.empty();
                    for(var i=0;i<data.errors.length;i++) $('<p></p>').text(data.errors[i]).appendTo($error);                    
                    $error.show();
                }
                else {
                    $error.html("Unknown error");
                    $error.show();
                }
            }, 'json');
        }
    };
    
    $('#btn-save').click(function() {
        save(function() {
            flashMessage("Saved");
        });
    });

    $('#btn-play').click(function() {
        save(function() {
            $iframe = $('<iframe></iframe>').attr('src', play_url).appendTo(document.body);
        });        
    });

    //----------------------------------------------------------------------------------------------------------------
    // Toolbox
    //----------------------------------------------------------------------------------------------------------------
    
    $('#toolbox .mode').click(function() {
        $('#toolbox .mode').removeClass('selected');
        $(this).addClass('selected');
        editmode = $(this).data('mode');
    });
    
    $('#undo').click(function() {
        var last = histo.undo(map);
        if(last !== null) {
            map = last;
            refreshAll();            
        }
    });
    
    $('#redo').click(function() {
        var next = histo.redo();
        if(next !== null) {
            map = next;
            refreshAll();            
        }
    });
    
    $('#deselect').click(function() {
        selection = false;
        updateSelection();
    });

    $('#copy').click(function() {
        if(selection) {
            var s = normalizeSelection();
            clipboard = { w: s.w, h: s.h, data: [] };
            for(var y=0, i=0;y<s.h;y++) for(var x=0;x<s.w;x++,i++) {
                clipboard.data[i] = map.data[(s.y + y)*map.width + (s.x + x)];
            }
            flashMessage("Copied");
        }
    });

    $('#paste').click(function() {
        if(selection) {
            histo.save(map);
            var $tiles = $('.tile', $map);
            var s = normalizeSelection();
            for(var y=0, i=0;y<s.h;y++) for(var x=0;x<s.w;x++,i++) {
                var cx = x % clipboard.w;
                var cy = y % clipboard.h;       
                var mi = (s.y + y)*map.width + (s.x + x);
                setTile($tiles.eq(mi), map.data[mi] = clipboard.data[cy*clipboard.w + cx]);
            }
        }
    });
    
    var doWithSelection = function(processTile, border_only) {
        histo.save(map);
        var seltile = $seltile_left.data('tile');
        if(selection && seltile) {
            var $tiles = $('.tile', $map);
            var s = normalizeSelection();
            for(var y=0, i=0;y<s.h;y++) for(var x=0;x<s.w;x++,i++) {
                if(border_only && !(y==0 || x==0 || y==s.h-1 || x==s.w-1)) continue;
                var mi = (s.y + y)*map.width + (s.x + x);
                processTile($tiles.eq(mi), mi);
            }
        }
    }
    
    $('#fill').click(function(event) {
        var seltile = $seltile_left.data('tile');
        doWithSelection(function($tile, index) {
            setTile($tile, map.data[index] = seltile);
        }, false);
        // var seltile = $seltile_left.data('tile');
        // if(selection && seltile) {
        //     var $tiles = $('.tile', $map);
        //     var s = normalizeSelection();
        //     for(var y=0, i=0;y<s.h;y++) for(var x=0;x<s.w;x++,i++) {
        //         var mi = (s.y + y)*map.width + (s.x + x);
        //         setTile($tiles.eq(mi), map.data[mi] = seltile);
        //     }
        // }
    });

    $('#fillborder').click(function(event) {
        var seltile = $seltile_left.data('tile');
        doWithSelection(function($tile, index) {
            setTile($tile, map.data[index] = seltile);
        }, true);
    });

    $('#randomfill').click(function(event) {
        var ratio = $('#ratio').val()/100;
        doWithSelection(function($tile, index) {
            var seltile = Math.random()>=ratio ? $seltile_left.data('tile') : $seltile_right.data('tile');
            setTile($tile, map.data[index] = seltile);
        }, false);
        // if(selection) {
        //     var $tiles = $('.tile', $map);
        //     var s = normalizeSelection();
        //     var ratio = $('#ratio').val()/100;
        //     for(var y=0, i=0;y<s.h;y++) for(var x=0;x<s.w;x++,i++) {
        //         var mi = (s.y + y)*map.width + (s.x + x);
        //         var seltile = Math.random()>=ratio ? $seltile_left.data('tile') : $seltile_right.data('tile');
        //         setTile($tiles.eq(mi), map.data[mi] = seltile);
        //     }
        // }
    });

    $('#replace').click(function(event) {
        var ratio = $('#ratio').val()/100;
        doWithSelection(function($tile, index) {
            var match = $tile.data('tile') == $seltile_right.data('tile');
            if(match && Math.random()>=ratio) setTile($tile, map.data[index] = $seltile_left.data('tile'));
        }, false);
        // if(selection) {
        //     var $tiles = $('.tile', $map);
        //     var s = normalizeSelection();
        //     var ratio = $('#ratio').val()/100;
        //     for(var y=0, i=0;y<s.h;y++) for(var x=0;x<s.w;x++,i++) {
        //         var mi = (s.y + y)*map.width + (s.x + x);
        //         var match = $tiles.eq(mi).data('tile') == $seltile_right.data('tile');
        //         if(match && Math.random()>=ratio) setTile($tiles.eq(mi), map.data[mi] = $seltile_left.data('tile'));
        //     }
        // }
    });
    // $(window).on('beforeunload', checkSaved);
    
    // $('#redo').click(function() {
    //     var last = undo.pop();
    //     if(last !== null) {
    //         map = last;
    //         refreshAll();            
    //     }
    // });

});