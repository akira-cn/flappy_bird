define(function(require, exports, module){

if(typeof cp === 'undefined'){
    cc.log('chipmunk not available!');
    return;
}


var BaseSprite = require('cqwrap/sprites').BaseSprite;
var GameLayer = require('cqwrap/layers').GameLayer;

if(!cc.RADIANS_TO_DEGREES){
    cc.RADIANS_TO_DEGREES = function(angle){
        return angle * 180 / Math.PI;
    }
}

if(!cc.DEGREES_TO_RADIANS){
    cc.DEGREES_TO_RADIANS = function(deg){
        return (deg * Math.PI) / 180;
    }
}

var Space = new cp.Space();
Space.iterations = 5;
Space.gravity = cp.v(0, -750);

var CPSprite = BaseSprite.extend({
    init:function(filename, pos, mass, elasticity, friction){
        this._super(filename);

        mass = mass || 5;

        var body = Space.addBody(new cp.Body(mass, cp.momentForBox(mass, this.getContentSize().width, this.getContentSize().height)));
        body.setPos(cp.v(pos.x, pos.y));
        var shape = Space.addShape(new cp.BoxShape(body, this.getContentSize().width, this.getContentSize().height));
        shape.setElasticity(elasticity || 0.2);
        shape.setFriction(friction || 0.8);
        this.body = body;
        this.shape = shape;

        this.scheduleUpdate();
    },
    update:function(dt){
        cc.Assert(this.body, 'no body?');

        var pos = this.body.p;
        this.setPosition(pos.x, pos.y);
        this.setRotation(cc.RADIANS_TO_DEGREES(-1*this.body.a));
            
        this._super(dt);
    }
});

var CPLayer = GameLayer.extend({
    init: function(){
        this._super();
        this.scheduleUpdate();
    },
    update:function(dt){
        Space.step(dt);
    }
});

module.exports = {
    CPSprite: CPSprite,
    CPLayer: CPLayer,
    Space: Space,
}

});