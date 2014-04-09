// load modules
define(function(require, exports, module){

    //preload all modules
    require('cqwrap/base');
    require('cqwrap/events');
    require('cqwrap/when');
    require('cqwrap/native');

    if(!global.md5){
        require('cqwrap/md5');
    }

    require('cqwrap/audio');
    require('cqwrap/data');

    require('cqwrap/style');
    require('cqwrap/nodes');
    require('cqwrap/tiles');
    require('cqwrap/sprites');
    require('cqwrap/fonts');
    require('cqwrap/animate');
    require('cqwrap/labels');
    require('cqwrap/scenes');
    require('cqwrap/layers');
    require('cqwrap/buttons');
    require('cqwrap/transitions');
    require('cqwrap/scroll');

    if(cc.PhysicsDebugNode && typeof cp != 'undefined'){
        require('cqwrap/physics');
    }   
    
});
