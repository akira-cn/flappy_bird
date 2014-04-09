define(function(require, exports, module){

'use strict';

var layers = require('cqwrap/layers');
var BaseLayer = layers.BaseLayer, BgLayer = layers.BgLayer;

var Audio = require('cqwrap/audio');
var when = require('cqwrap/when');

var BaseScene = cc.Scene.extend({
    ctor:function() {
        this._super();
        this._autoReload = false;

        this.init.apply(this, arguments);
        cc.associateWithNative( this, cc.Scene );
    },
    reload: function(){
        var myScene = new this.constructor();
        director.replaceScene(myScene);
    },
    onEnter: function(){
        this._super();
        if(this._autoReload && this._needReload){
            this.reload();
        }
    },
    onExit: function(){
        if(this._autoReload){
            this._needReload = true;
        }
        this._super();
    },
    /**
        set this enabled to autoreload the scene 
        when direct.popScene is called
     */
    setAutoReload: function(autoReload){
        this._autoReload = autoReload;
    }
});


function loadResources(frames, callback, delay){
    callback(frames);

    if(frames.length <= 0){
        return;
    }
    
    setTimeout(function(){
        loadResources(frames.slice(1), callback, delay);
    }, delay);
}

var LoadingLayer = BaseLayer.extend({
    init: function(frameCaches, effects, musics, delay){
        this._super();
        var self = this;

        effects = effects || [];
        musics = musics || [];
        delay = delay || 10;

        var resCount = frameCaches.length + effects.length + musics.length; 

        function loadEffects(){
            var deferred = when.defer();
            setTimeout(function(){
                loadResources(effects, function(effectsLeft){
                    self.getParent()
                        .onProgressChange((effects.length - effectsLeft.length) / resCount);
                    
                    if(effectsLeft.length <= 0){
                        deferred.resolve();
                    }else{
                        Audio.preloadEffect(effectsLeft[0]);
                    }
                }, delay);
            }, delay);
            return deferred.promise;
        }

        function loadMusics(){
            var deferred = when.defer();
            setTimeout(function(){
                loadResources(musics, function(musicsLeft){
                    self.getParent()
                        .onProgressChange((effects.length + musics.length 
                            - musicsLeft.length) / resCount);

                    if(musicsLeft.length <= 0){
                        deferred.resolve();
                    }else{
                        Audio.preloadMusic(musicsLeft[0]);
                    }
                }, delay);
            }, delay);
            return deferred.promise;
        }

        function loadFrames(){
            var deferred = when.defer();

            setTimeout(function(){
                var cache = cc.SpriteFrameCache.getInstance();

                loadResources(frameCaches, function(frames){
                    self.getParent().onProgressChange(1 - frames.length / resCount);
                    if(frames.length <= 0){
                        setTimeout(function(){
                            deferred.resolve();
                        }, delay); 
                    }else{
                        cache.addSpriteFrames(frames[0][0], frames[0][1]);
                    }
                }, delay);

            }, delay); 

            return deferred.promise;            
        }

        loadEffects().then(function(){
            return loadMusics();
        }).then(function(){
            return loadFrames();
        }).then(function(){
            self.getParent().onLoaded();
        });
  

        if(this.setKeypadEnabled){   
            this.setKeypadEnabled(true);
        }            
    },
    backClicked: function(){
        this.getParent().backClicked();
    }    
});

var LoadingScene = BaseScene.extend({
    init: function(resFrames, effects, musics, delay){
        this._super();
        var loadingLayer = new LoadingLayer(resFrames, effects, musics, delay);
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