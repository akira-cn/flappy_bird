define(function(require, exports, module){

var BaseNode = require('cqwrap/nodes').BaseNode;

var TileNode = BaseNode.extend({
    init: function(width, height){
        height = height || width;
        this.width = width;
        this.height = height;
    },
    addChild: function(sprite, x, y) {
        this.setXY(sprite, x, y);
        this._super(sprite);
    },
    setXY: function(sprite, x, y) {
        if(!sprite._pos){
            var pos = sprite.getStyle('xy'); 
            sprite._pos = cc.p(pos.x, pos.y);         
        }
        sprite.setStyle({
            xy: [x * this.width + sprite._pos.x, y * this.height + sprite._pos.y],
        });        
    },
    locationToXY: function(location) {
        var pos = this.getPosition();
        var x = 0 | (location.x - pos.x) / this.width,
            y = 0 | (location.y - pos.y) / this.height;

        return cc.p(x, y);
    }
});

module.exports = {
    TileNode: TileNode
};

});