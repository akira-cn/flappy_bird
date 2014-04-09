define(function(require, exports, module){
    'use strict';

    var BaseScene = require('cqwrap/scenes').BaseScene;
    var layers = require('cqwrap/layers');
    var Audio = require('cqwrap/audio');
    var Button = require('cqwrap/buttons').Button;

    var UserData = require('cqwrap/data').UserData;

    var StartLayer = layers.GameLayer.extend({
        init: function(){
            this._super();

            var readySprite = cc.createSprite('res/img/getready.png', {
                anchor: [0.5, 0],
                xy: [360, 780]
            });

            this.addChild(readySprite);

            var startSprite = cc.createSprite('res/img/click.png', {
                anchor: [0.5, 0],
                xy: [360, 460]
            });

            this.addChild(startSprite);

            var self = this;
            this.subscribe('flap', function f(){
                readySprite.fadeOut(0.5).act();
                startSprite.fadeOut(0.5).act();
                self.unsubscribe('flap', f);
            });
        }
    });

    var MainLayer = layers.GameLayer.extend({
        init: function(){
            this._super();
            
            var groundSprite = cc.createSprite('res/img/ground.png', {
                anchor: [0, 0],
                xy: [0, 0]
            });

            groundSprite.moveBy(0.5, cc.p(-120, 0)).moveBy(0, cc.p(120, 0)).repeat().act();
            this.addChild(groundSprite);

            var birdSprite = cc.createSprite('bird1.png', {
                anchor: [0.5, 0],
                xy: [220, 650]
            });

            birdSprite.animate(0.6, 'bird1.png', 'bird2.png', 'bird3.png').repeat().act();
            birdSprite.moveBy(0.3, cc.p(0, -20)).reverse().repeat().act();
            this.addChild(birdSprite);

            var self = this;

            function flap(){
                Audio.playEffect('res/audio/sfx_wing.ogg');
                var birdX = birdSprite.getPositionX();
                var birdY = birdSprite.getPositionY();
                var fallTime = birdY / 1000;

                birdSprite.stopAllActions();
                birdSprite.animate(0.2, 'bird1.png', 'bird2.png', 'bird3.png').repeat().act();

                var jumpHeight = Math.min(1280 - birdY, 120);
                birdSprite.moveBy(0.2, cc.p(0, jumpHeight), cc.EaseOut, 2).act();

                birdSprite.rotateTo(0.2, -20).act();

                birdSprite.delay(0.2).moveTo(fallTime, cc.p(birdX, 316), cc.EaseIn, 2).act();
                birdSprite.delay(0.5).rotateTo(fallTime - 0.3, 90, 90, cc.EaseIn, 2)
                    .then(function(){
                        birdSprite.stopAllActions();
                        groundSprite.stopAllActions();
                        self.hosesLayer.stopAllActions();
                        self.shineOnce();
                        self.unsubscribe('flap', flap);
                        self.gameOver();
                    }).act(); 
            }
            this.subscribe('flap', flap);

            self.subscribe('fall', function(){
                self.shineOnce();
                self.unsubscribe('flap', flap);
            });

            var scoreSprite = cc.createSprite('@0', {
                anchor: [0.5, 0],
                xy: [360, 1000],
                fontSize: 64,
            });
            this.addChild(scoreSprite);
            this.scoreSprite = scoreSprite;
            
            var num = 500;
            var hosesLayer = self.createHose(num);

            this.subscribe('flap', function f(){
                var moveByDis = 400 * num + 1200;
                hosesLayer.moveBy(moveByDis/200, cc.p(-moveByDis, 0)).act();
                self.unsubscribe('flap', f);
                self.scheduleUpdate();
            });

            this.birdSprite = birdSprite;

            this.score = 0;
        },
        gameOver: function(){
            this.scoreSprite.fadeOut(0.1).moveTo(0.6, cc.p(550, 665)).fadeIn(0.1).act();
            this.scoreSprite.setStyle('zOrder', 10);

            var bestScore = UserData.get('best', 0);
            if(this.score > bestScore){
                bestScore = this.score;
                UserData.set('best', bestScore);
            }

            var bestScore = cc.createSprite('@'+bestScore, {
                anchor: [0.5, 0],
                xy: [550, 555],
                fontSize: 64,
                zOrder: 10,
                opacity: 0,
            });

            bestScore.delay(0.7).fadeIn(0.1).act();
            this.addChild(bestScore);

            var gameOver = cc.createSprite('res/img/gameover.png', {
                anchor: [0.5, 0],
                xy: [360, 850]                
            });

            gameOver.moveBy(0.1, cc.p(0, 10)).reverse().act();

            this.addChild(gameOver);

            var baseSprite = cc.createSprite('res/img/base.png', {
                anchor: [0.5, 0],
                xy: [360, -520]  
            });

            baseSprite.delay(0.5).moveTo(0.2, cc.p(360, 520)).act();

            this.addChild(baseSprite);
            
            var clickButton = new Button({
                texture: 'res/img/start.png', 
                anchor: [0, 0],
                xy: [70, 256],
                zOrder: 5
            }, function(){
                scene.reload();
            });

            clickButton.getContentSprite().setOpacity(0);
            clickButton.getContentSprite().delay(0.8).fadeIn(0.1).act();

            this.addChild(clickButton);

            var gradeButton = new Button({
                texture: 'res/img/grade.png', 
                anchor: [0, 0],
                xy: [370, 256],
                zOrder: 5
            }, function(){});
            
            gradeButton.getContentSprite().setOpacity(0);
            gradeButton.getContentSprite().delay(0.8).fadeIn(0.1).act();

            if(this.score >= 10){
                var material = this.score >= 20 ? 'gold.png' : 'silver.png';
                var medal = cc.createSprite(material, {
                    anchor: [0.5, 0.5],
                    xy: [191, 651],
                    zOrder: 5
                });
                this.setTimeout(function(){
                    this.addChild(medal);
                }, 800);
            }

            this.addChild(gradeButton);
        },
        shineOnce: function(){
            if(!this.shineMask){
                var shineMask = cc.LayerColor.create(cc.color('#fff').c4b);
                shineMask.setStyle({
                    zOrder: 10,
                    opacity: 0
                });
                shineMask.fadeIn(0.1).fadeOut(0.1).act();
                Audio.playEffect('res/audio/sfx_hit.ogg');
                this.addChild(shineMask);
                this.shineMask = shineMask;
            }
        },
        update: function(t){
            var self = this;

            var bird = this.birdSprite;
            var score = this.score;
            var hose = this.hoses[score];
            var offsetX = hose[0].getParent().getParent().getPositionX();

            var hoseX = hose[0].getPositionX() + offsetX;

            if(hoseX <= 220){
                //已经飞过去了
                Audio.playEffect('res/audio/sfx_point.ogg');
                this.scoreSprite.setString(++this.score);
                return;
            } 
            
            //这里可以用 boundingBox 的 上下左右的中间点来判断碰撞，会更准确一些
            var box = bird.getBoundingBox();
            var bottom = cc.p(box.x + box.width / 2, box.y);
            var right = cc.p(box.x + box.width, box.y + box.height / 2);
            var left = cc.p(box.x, box.y + box.height / 2);
            var top = cc.p(box.x + box.width / 2, box.y + box.height);  
            
            hose.forEach(function(h){
                var box = h.getBoundingBox();
                box.x += offsetX;
                
                if(cc.rectContainsPoint(box, left)
                    || cc.rectContainsPoint(box, right)
                    || cc.rectContainsPoint(box, top)
                    || cc.rectContainsPoint(box, bottom)){

                    self.unscheduleUpdate();
                    self.publish('fall');
                }                
            });
        },
        createHose: function(max){
            var hoseHeight = 830;
            var acrossHeight = 250;

            var self = this;
            
            var hosesLayer = new layers.GameLayer();
            //设置一个比较低的层级
            hosesLayer.setStyle('zOrder', -1);
            this.addChild(hosesLayer);
            this.hoses = [];

            this.hosesLayer = hosesLayer;

            for(var i = 0; i < max; i++){
                var downHeight = 200 + (400 * Math.random() | 0);
                var upHeight = 1000 - downHeight - acrossHeight;
                var hoseX = 1200 + 400 * i;

                var hoseDown = cc.createSprite('holdback1.png', {
                    anchor: [0.5, 0],
                    xy: [hoseX, 270 + downHeight - 830],
                });

                var hoseUp = cc.createSprite('holdback2.png', {
                    anchor: [0.5, 0],
                    xy: [hoseX, 270 + downHeight + acrossHeight],
                });

                hosesLayer.addChildToBatch(hoseDown, 'res/img/hoses.png');
                hosesLayer.addChildToBatch(hoseUp, 'res/img/hoses.png');

                this.hoses.push([hoseDown, hoseUp]);
            }
            return hosesLayer;
        }
    });

    var ControlLayer = layers.GameLayer.extend({
        init: function(){
            this._super();

            var delegator = new layers.BaseLayer();
            
            this.delegate(delegator);
            
            var self = this; 

            delegator.on('touchstart', function(){
                self.publish('flap');
            });
            
            this.addChild(delegator);
        }
    });

    var MyScene = BaseScene.extend({
        init:function () {
            this._super();

            var cache = cc.SpriteFrameCache.getInstance();
                cache.addSpriteFrames("res/img/birds.plist", "res/img/birds.png");
                cache.addSpriteFrames("res/img/hoses.plist", "res/img/hoses.png");

            var bgLayer = new layers.BgLayer('res/img/bg.png');
            this.addChild(bgLayer);

            var controlLayer = new ControlLayer();
            this.addChild(controlLayer);

            var mainLayer = new MainLayer();
            this.addChild(mainLayer);

            var startLayer = new StartLayer();
            this.addChild(startLayer);
        }
    });

    module.exports = MyScene;
});