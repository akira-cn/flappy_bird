define(function(require, exports, module){
    
    cc.dumpConfig();

    //preload cqwrap file
    require('cqwrap/index.js'); 

    // create a scene. it's an autorelease object
    var FirstScene = require('src/view/scene_main');
    
    var scene = new FirstScene();
    
    // run
    director.runWithScene(scene);
});
