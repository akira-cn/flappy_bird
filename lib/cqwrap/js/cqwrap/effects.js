define(function(require, exports, module){

'use strict';

var SpriteFadeInTR = {
    create: function(dur, sprite, to){
        to = to || 255;
        sprite.setOpacity(0);
        var effect = cc.FadeTo.create(dur, to);
        sprite.runAction(effect);
        return sprite;        
    }
};

module.exports = {
    SpriteFadeInTR: SpriteFadeInTR
};

});