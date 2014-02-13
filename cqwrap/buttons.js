define(function(require, exports, module){

'use strict';

var BaseNode = require('cqwrap/nodes').BaseNode,
    BaseSprite = require('cqwrap/sprites').BaseSprite;

var EventEmitter = require('cqwrap/events').EventEmitter;

var Button = BaseNode.extend({
    init: function(sprite, event, callback){
        this._super();

        var style;

        if(typeof event === 'function'){
            callback = event;
            event = 'click';
        }

        if(typeof sprite === 'string'){
            sprite = new BaseSprite(sprite);
        }

        if(typeof sprite === 'object' && 
            !(sprite instanceof cc.Sprite)){
            style = sprite;
            sprite = cc.createSprite(style.texture);
            delete style.texture;
        }

        cc.mixin(this, new EventEmitter);

        this.on('touchstart', function(){
            sprite.setScaleY(0.9);
            sprite.setOpacity(sprite.getOpacity() * 0.8);
        });

        this.on('touchend', function(){
            var scale = sprite.getScaleY();
            if(Math.abs(scale - 0.9) < 0.01){
                sprite.setScaleY(1.0);
                sprite.setOpacity(sprite.getOpacity() / 0.8);
            }
        });

        if(callback){
            this.on('click', callback);
        }
        
        var self = this;
        function setSprite(){
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(0, 0));
            self.addChild(sprite);
            self.setContentSize(sprite.getContentSize());
        }

        setSprite();
        if(style){
            this.setStyle(style);
        }

        this.setContentSprite = function(newSprite){
            sprite.removeFromParent(true);
            sprite = newSprite;
            setSprite();
        }

        this.getContentSprite = function(){
            return sprite;
        }
    }
});

module.exports = {
    Button: Button
}
});