/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

define(function(require, exports, module){

    var layers = require('cqwrap/layers'),
        BaseScene = require('cqwrap/scenes').BaseScene;
    var GameLayer = layers.GameLayer, BgLayer = layers.BgLayer;
    var Button = require('cqwrap/buttons').Button;

    var UserData = require('cqwrap/data').UserData;
    var Audio = require('cqwrap/audio');

    var MyLayer = GameLayer.extend({

        init:function () {
            this._super();

            var cache = cc.SpriteFrameCache.getInstance();
            cache.addSpriteFrames("res/flappy_packer.plist", "res/flappy_packer.png");

            var ground = cc.createSprite('res/ground.png', {
                anchor: [0, 0],
                xy: [0, 0],
                zOrder: 3
            });

            ground.moveBy(0.5, cc.p(-120, 0)).moveBy(0, cc.p(120, 0)).repeatAll().act();

            this.addChild(ground);

            var ready = cc.createSprite('getready.png', {
                anchor: [0.5, 0],
                xy: [360, 780]
            });

            this.addChild(ready);

            var start = cc.createSprite('click.png', {
                anchor: [0.5, 0],
                xy: [360, 460]
            });

            this.addChild(start);

            var scoreSprite = cc.createSprite('@0', {
                anchor: [0.5, 0],
                xy: [360, 1000],
                fontSize: 64,
                zOrder: 10
            });

            this.addChild(scoreSprite);
            this.scoreSprite = scoreSprite;

            var bird = cc.createSprite('bird1.png', {
                anchor: [0.5, 0],
                xy: [220, 650],
                zOrder: 2
            });

            bird.animate(0.6, 'bird1.png', 'bird2.png', 'bird3.png').repeat().act();
            bird.moveBy(0.3, cc.p(0, -20)).reverse().repeatAll().act();

            this.addChild(bird);

            this.delegate(this);

            this.status = 'ready';

            var self = this;

            self.hoses = [];

            function createHose(dis){
                var hoseHeight = 830;
                var acrossHeight = 250;
                var downHeight = 200 + (400 * Math.random() | 0);
                var upHeight = 1000 - downHeight - acrossHeight;
                
                var n = (self.hoses.length / 2) | 0;
                var hoseX = dis + 400 * n;

                var hoseDown = cc.createSprite('holdback1.png', {
                    anchor: [0.5, 0],
                    xy: [hoseX, 270 + downHeight - 830],
                });

                var hoseUp = cc.createSprite('holdback2.png', {
                    anchor: [0.5, 0],
                    xy: [hoseX, 270 + downHeight + acrossHeight],
                });

                self.addChild(hoseDown);
                self.addChild(hoseUp);

                var moveByDis = hoseX+500;
                hoseUp.moveBy(moveByDis/200, cc.p(-moveByDis, 0)).then(function(){
                    hoseUp.removeFromParent(true);
                }).act();
                hoseDown.moveBy(moveByDis/200, cc.p(-moveByDis, 0)).then(function(){
                    createHose(-500);
                    var idx = self.hoses.indexOf(hoseDown);
                    self.hoses.splice(idx, 2);
                    self.scoreBuf ++;
                    hoseDown.removeFromParent(true);
                }).act();

                self.hoses.push(hoseDown, hoseUp);
                
            };

            this.scoreBuf = 0;
            this.score = 0;

            this.on('touchstart', function(){
                //cc.log('bird:', bird.getBoundingBox());
                Audio.playEffect('audio/sfx_wing.ogg')
                if(self.status == 'ready'){
                    for(var i = 0; i < 4; i++){
                        createHose(1200);
                    }

                    ready.fadeOut(0.5).act();
                    start.fadeOut(0.5).act();

                    //碰撞检测
                    self.checker = self.setInterval(function(){
                        //cc.log(111);
                        var score = 0;

                        //这里可以用 boundingBox 的 上下左右的中间点来判断碰撞，会更准确一些
                        var box = bird.getBoundingBox();
                        var bottom = cc.p(box.x + box.width / 2, box.y);
                        var right = cc.p(box.x + box.width, box.y + box.height / 2);
                        var left = cc.p(box.x, box.y + box.height / 2);
                        var top = cc.p(box.x + box.width / 2, box.y + box.height);

                        self.hoses.some(function(hose){
                            var box = hose.getBoundingBox();

                            if(hose.getPositionX() <= 220) score ++;

                            //cc.log(score);

                            if(hose.getPositionX() > 0 && hose.getPositionX() < 720
                                //&& cc.rectIntersectsRect(hose.getBoundingBox(), bird.getBoundingBox())
                                && (cc.rectContainsPoint(box, left)
                                    || cc.rectContainsPoint(box, right)
                                    || cc.rectContainsPoint(box, top)
                                    || cc.rectContainsPoint(box, bottom))){
                                //cc.log([hose.getBoundingBox(), bird.getBoundingBox()]);
                                layerMask.fadeIn(0.1).fadeOut(0.1).act();
                                Audio.playEffect('audio/sfx_hit.ogg');
                                self.status = 'falling';
                                return true;
                            }
                        });

                        if(self.status == 'falling'){
                            self.clearInterval(self.checker);
                            ground.stopAllActions();
                            
                            self.hoses.forEach(function(o){
                                o.stopAllActions();
                                //o.removeFromParent(true);
                            });
                        }

                        score = Math.ceil(score/2) + self.scoreBuf;

                        if(score > self.score){
                            self.score = score;
                            this.scoreSprite.setString(score);
                            Audio.playEffect('audio/sfx_point.ogg');
                        }

                    }, 50)

                    self.status = 'playing';
                }
                if(self.status == 'playing'){
                    var birdX = bird.getPositionX();
                    var birdY = bird.getPositionY();
                    var fallTime = birdY / 1000;

                    bird.stopAllActions();
                    bird.animate(0.2, 'bird1.png', 'bird2.png', 'bird3.png').repeat().act();

                    var jumpHeight = Math.min(1280 - birdY, 120);
                    bird.moveBy(0.2, cc.p(0, jumpHeight), cc.EaseOut, 2).act();

                    bird.rotateTo(0.2, -20).act();
                    bird.delay(0.2).moveTo(fallTime, cc.p(birdX, 316), cc.EaseIn, 2)
                        .then(function(){
                            if(self.status == 'playing'){
                                ground.stopAllActions();
                                
                                self.hoses.forEach(function(o){
                                    o.stopAllActions();
                                    //o.removeFromParent(true);
                                }); 
                                layerMask.fadeIn(0.1).fadeOut(0.1).act();
                                Audio.playEffect('audio/sfx_hit.ogg');                               
                            }

                            bird.stopAllActions();
                            self.status = 'gameover';
                            
                            setTimeout(function(){
                                self.onGameOver();
                            }, 200)
                        }).act();
                    bird.delay(0.5).rotateTo(fallTime - 0.3, 90, 0, cc.EaseIn, 2).act();                    
                }
            });

            var label = cc.createSprite('@@75team', {
                anchor: [0.5, 0.5],
                xy: [360, 180],
                fontSize: 54,
                zOrder: 99,
                color: '#000'
            });

            this.addChild(label);

            var layerMask = cc.LayerColor.create(cc.c4b(255,255,255, 255));
            layerMask.setZOrder(88);
            layerMask.setOpacity(0);
            this.addChild(layerMask);
            this.layerMask = layerMask;

            return true;
        },
        backClicked: function(){
            director.end();
            //director.popScene();
        },
        onGameOver: function(){
            cc.log('gameover');

            this.scoreSprite.fadeOut(0.1).moveTo(0.6, cc.p(550, 665)).fadeIn(0.1).act();

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

            var gameOver = cc.createSprite('gameover.png', {
                anchor: [0.5, 0],
                xy: [360, 850]                
            });

            gameOver.moveBy(0.1, cc.p(0, 10)).reverse().act();

            this.addChild(gameOver);

            var scoreSprite = cc.createSprite('base.png', {
                anchor: [0.5, 0],
                xy: [360, -520]  
            });

            scoreSprite.delay(0.5).moveTo(0.2, cc.p(360, 520)).act();

            this.addChild(scoreSprite);
            
            var clickButton = new Button({
                texture: 'start.png', 
                anchor: [0, 0],
                xy: [70, 256],
                zOrder: 5
            }, function(){
                //cc.log('aaa');
                director.replaceScene(cc.TransitionFade.create(0.5, new MyScene()));
            });

            clickButton.getContentSprite().setOpacity(0);
            clickButton.getContentSprite().delay(0.8).fadeIn(0.1).act();

            this.addChild(clickButton);

            var gradeButton = new Button({
                texture: 'grade.png', 
                anchor: [0, 0],
                xy: [370, 256],
                zOrder: 5
            }, function(){});
            
            gradeButton.getContentSprite().setOpacity(0);
            gradeButton.getContentSprite().delay(0.8).fadeIn(0.1).act();

            if(this.score >= 10){
                //不知道为啥，原版就是先金牌后银牌的
                var material = this.score >= 20 ? 'silver.png' : 'gold.png';
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
        }
    });

    var MyScene = BaseScene.extend({
        init:function () {
            this._super();

            var bg = new BgLayer("res/bg.png");
            this.addChild(bg);

            var layer = new MyLayer();
            this.addChild(layer);
        }
    });

    module.exports = MyScene;
});

