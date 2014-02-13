define(function(require, exports, module){

var BaseSprite = require('cqwrap/sprites').BaseSprite

cc.LabelTTF.extend = cc.Sprite.extend;

var BaseLabel = cc.LabelTTF.extend({
    ctor: function(text){
        this._super(text, "Arial", 16);
        this.initWithString(text, "Arial", 16);
        cc.associateWithNative(this, cc.LabelTTF);        
    }
});

module.exports = {
    BaseLabel: BaseLabel
};

});