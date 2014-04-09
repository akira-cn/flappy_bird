define(function(require, exports, module){
    var BaseScene = require('cqwrap/scenes').BaseScene,
        GameLayer = require('cqwrap/layers').GameLayer,
        Button = require('cqwrap/buttons').Button;

    var BaseSprite = require('cqwrap/sprites').BaseSprite;

    var MyLayer = GameLayer.extend({
        init: function(){
            this._super();

            var size = director.getWinSize();

            var label = cc.createSprite('@Hello World', {
                anchor: [0.5, 0.5],
                xy: [size.width/2, 600],
                fontSize: 64
            });

            this.addChild(label);

            var sprite = cc.createSprite({
                texture: 'res/img/HelloWorld.png',
                anchor: [0.5, 0.5],
                xy: [size.width/2, size.height/2]
            });

            this.addChild(sprite);

            var closeBtn = new Button({
                texture: 'res/img/CloseNormal.png',
                anchor: [0.5, 0.5],
                xy: [size.width - 50, 50]
            }, function(){
                cc.log('close button clicked');
            });

            this.addChild(closeBtn);

            var drawNode = cc.DrawNode.create();
            
            // star poly (doesn't trigger bug... order is important un tesselation is supported.
            o=180;
            w=20;
            h=50;
            star = [
                cc.p(o,o), cc.p(o+w,o-h), cc.p(o+w*2, o),       // lower spike
                cc.p(o + w*2 + h, o+w ), cc.p(o + w*2, o+w*2),  // right spike
                cc.p(o +w, o+w*2+h), cc.p(o,o+w*2),             // top spike
                cc.p(o -h, o+w)                                 // left spike
            ];
            drawNode.drawPoly(star, cc.c4f(1,0,0,0.5), 1, cc.c4f(0,0,1,1) );

            this.addChild(drawNode);
        }
    });

    var MyScene = BaseScene.extend({
        init:function () {
            this._super();

            var layer = new MyLayer();
            this.addChild(layer);
        }
    });

    module.exports = MyScene;
});