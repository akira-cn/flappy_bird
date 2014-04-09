define(function(require, exports, module){

var BaseSprite = require('cqwrap/sprites').BaseSprite

cc.LabelTTF.extend = cc.Sprite.extend;

var BaseLabel = cc.LabelTTF.extend({
    ctor: function(text){
        this._super.apply(this, arguments);
        this.init.apply(this, arguments);
        cc.associateWithNative(this, cc.LabelTTF);        
    },
    init: function(text){
        this.initWithString(text, "Arial", 16);
        this.setCascadeOpacityEnabled(true);
        this.setCascadeColorEnabled(true);
    }
});

module.exports = {
    BaseLabel: BaseLabel
};

});