define(function(require, exports, module){

'use strict';

var layers = require('cqwrap/layers');
var BaseLayer = layers.BaseLayer, BgLayer = layers.BgLayer;

var BaseScene = cc.Scene.extend({
    ctor:function() {
        this._super();
        this.init.apply(this, arguments);
        cc.associateWithNative( this, cc.Scene );
    }
});


function loadFrames(cache, frames, callback){
    callback(frames);

    if(frames.length <= 0){
        return;
    }
    cache.addSpriteFrames(frames[0][0], frames[0][1]);
    
    setTimeout(function(){
        loadFrames(cache, frames.slice(1), callback);
    }, 100);
}

var LoadingLayer = BaseLayer.extend({
    init: function(frameCaches){
        this._super();
        var self = this;

        setTimeout(function(){
            var cache = cc.SpriteFrameCache.getInstance();
            loadFrames(cache, frameCaches, function(frames){
                self.getParent().onProgressChange(1 - frames.length / frameCaches.length);
                if(frames.length <= 0){
                    setTimeout(function(){
                        self.getParent().onLoaded();
                    }, 200); 
                }
            });                      
        }, 100);   

        if(this.setKeypadEnabled){   
            this.setKeypadEnabled(true);
        }            
    },
    backClicked: function(){
        this.getParent().backClicked();
    }    
});

var LoadingScene = BaseScene.extend({
    init: function(resFrames){
        this._super();
        var loadingLayer = new LoadingLayer(resFrames);
        this.addChild(loadingLayer);
    },
    onProgressChange: function(){
        //Overload by subclass
    },
    onLoaded: function(){
        //Overload by subclass
    },
    backClicked: function(){
        director.end();
    }
});

module.exports = {
    BaseScene: BaseScene,
    LoadingScene: LoadingScene
};

});