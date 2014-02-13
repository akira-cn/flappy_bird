define(function(require, exports, module){

'use strict';

var BaseSprite = require('cqwrap/sprites').BaseSprite;


var TransitionFade = {
    create: function(dur, sprite_or_layer, to){
        if(sprite_or_layer instanceof BaseSprite){
            to = to || 255;
            sprite_or_layer.setOpacity(0);
            var effect = cc.FadeTo.create(dur, to);
            sprite_or_layer.runAction(effect);
            return sprite_or_layer; 
        }else{
            return new cc.TransitionFade(dur, sprite_or_layer, to);
        }
    }
};

module.exports = {
    TransitionFade: TransitionFade
};

});