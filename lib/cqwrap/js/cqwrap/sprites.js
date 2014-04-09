define(function(require, exports, module){

'use strict';

var BaseSprite = cc.Sprite.extend({
    ctor: function(){
        this._super();
        this.init.apply(this, arguments);
        cc.associateWithNative( this, cc.Sprite );            
    },
    init: function(img, rect){
        if(img instanceof cc.Texture2D){
            this.initWithTexture(img, rect);
        }else{
            var spriteFrame = img && cc.SpriteFrameCache.getInstance().getSpriteFrame(img);
            if(spriteFrame){
                this.initWithSpriteFrame(spriteFrame); 
                if(rect) this.setTextureRect(rect);               
            }else{
                this._super.apply(this, arguments);
            }   
        }        
        this.setCascadeOpacityEnabled(true);
        this.setCascadeColorEnabled(true); 
    }
});

cc.createSprite = function(sprite, style){
    if(typeof sprite === 'object' && !(sprite instanceof cc.Sprite)
        && style == null){
        style = sprite;
        sprite = new BaseSprite();
    } 
    style = style || {};
    if(typeof sprite === 'string'){
        if(sprite[0] === '@'){
            var Label = require('cqwrap/labels').BaseLabel;
            sprite = new Label(sprite.slice(1));
        }else if(/\.plist$/.test(sprite)){
            sprite = cc.ParticleSystem.create(sprite);
        }else{
            sprite = new BaseSprite(sprite);
        }
    }
    sprite.setStyle(style);

    return sprite;
}

module.exports = {
    BaseSprite: BaseSprite
};

});