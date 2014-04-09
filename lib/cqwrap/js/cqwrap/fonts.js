define(function(require, exports, module){

var BaseSprite = require('cqwrap/sprites').BaseSprite;

var LabelFontFC = BaseSprite.extend({
    init: function(text, style){
        style = style || {};
        this._super();
        this._prefix = style.prefix || '';
        this.setString(text);
        this.setStyle(style);
    },
    setPrefix: function(prefix){
        this._prefix = prefix;
    },
    setString: function(text){
        text = text.toString();
        var childNodes = this.getChildren() || [];
        for(var i = 0; i < childNodes.length; i++){
            childNodes[i].removeFromParent(true);
        }
        var width = 0, height = 0; 
        for(var i = 0; i < text.length; i++){
            var c = this._prefix + text[i] + '.png';
            var sp = cc.createSprite(c, {
                anchor: [0, 0],
                xy: [width, 0]
            });

            this.addChild(sp);
            var size = sp.getContentSize();
            width += size.width;
            heigth = Math.max(size.height, height);
        }
        this.setContentSize(width, heigth);
        //cc.log(this.getContentSize());
    }
});

module.exports = {
    LabelFontFC: LabelFontFC
};

});