define(function(require, exports, module){

'use strict';

var EventEmitter = require('cqwrap/events').EventEmitter;
var BaseSprite = require('cqwrap/sprites').BaseSprite;
var when = require('cqwrap/when');

var BaseLayer = cc.Layer.extend({
    ctor: function(){
        this._super();
        this._contextDefer = when.defer();
        this.init.apply(this, arguments);
        cc.associateWithNative( this, cc.Layer );
    },
    getContext: function(){
        var deferred = this._contextDefer;
        return deferred.promise; 
    },
    publish: function(){
        var args = [].slice.apply(arguments);
        this.getContext().then(function(context){
            if(!context.__pubsubEmitter){
                context.__pubsubEmitter = new EventEmitter();
            }
            context.setTimeout(function(){
                context.__pubsubEmitter.emit.apply(context, args);
            }, 0); 
        });
    },
    subscribe: function(){
        var args = [].slice.apply(arguments);
        this.getContext().then(function(context){
            if(!context.__pubsubEmitter){
                context.__pubsubEmitter = new EventEmitter();
            }
            context.__pubsubEmitter.on.apply(context, args);
        });        
    },
    unsubscribe: function(){
        var args = [].slice.apply(arguments);
        this.getContext().then(function(context){
            if(!context.__pubsubEmitter){
                context.__pubsubEmitter = new EventEmitter();
            }
            context.__pubsubEmitter.removeListener.apply(context, args);
        });          
    },
    onEnter: function(){
        this._super();
        this._contextDefer.resolve(this.getParent());
    },
    onExit: function(){
        this._super();
        this.clearAllTimers();
    }
});

var BgLayer = BaseLayer.extend({
    init:function (bgImg) {
        this._super();
        var color = cc.color(bgImg);
        if(color){
            var colorLayer = cc.LayerColor.create(color.c4b);
            this.addChild(colorLayer);
        }else{
            var winSize = director.getWinSize();
            var sprite = new BaseSprite(bgImg);
            sprite.setPosition(cc.p(winSize.width/2, winSize.height/2));
            this.addChild(sprite);
        }
        return true;
    }
});

function delegateTouch(layer, touch, event){
    var touchLocation = touch.getLocation();
    var targets = layer._touchTargets;

    for(var i = 0; i < targets.length; i++){
        var node = targets[i];
        var local = node.convertToNodeSpace(touchLocation);
        var size = node.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        if (cc.rectContainsPoint(rect, local)) {
            touch.returnValue = true;
            touch.preventDefault = function(){
                touch.returnValue = false;
            }

            if(event === 'touchstart'){
                layer._touchedTarget = node;
                layer._currentTarget = node;
            }

            if(event === 'touchmove' && node !== layer._currentTarget){
                if(layer._currentTarget){
                    layer._currentTarget.emit('touchleave', touch, layer._currentTarget, layer);
                }
                node.emit('touchenter', touch, node, layer);
                layer._currentTarget = node;
            }

            if(layer._touchedTarget &&
                event === 'touchmove' && node !== layer._touchedTarget){
                layer._touchedTarget.emit('touchend', touch, layer._touchedTarget, layer);
                layer._moved = true;
                delete layer._touchedTarget;
            }

            node.emit(event, touch, node, layer);
            return touch.returnValue;
        } 
    }
    
    if(layer._touchedTarget &&
        (event === 'touchmove' || event === 'touchend')){
        layer._touchedTarget.emit('touchend', touch, layer._touchedTarget, layer);
        if(layer._currentTarget){
            layer._currentTarget.emit('touchleave', touch, layer._currentTarget, layer);
            delete layer._currentTarget;
        }
        layer._moved = true;
        delete layer._touchedTarget;
    } 

    return false;        
}

var GameLayer = BaseLayer.extend({
    init: function () {
        this._super();

        this._touchTargets = [];
        this._batches = {};

        //if this property was set to false, touch move will cancel click event
        this._clickAndMove = true;
        this._autoDelegate = true;

        if(this.backClicked && this.setKeypadEnabled){
            this.setKeypadEnabled(true);
        }
    },
    onEnter: function(){
        this._super();
        this.registerDelegate();
        
        if(this.getParent() instanceof cc.Scene){
            var offsetY = director.offsetY || 0;
            this.setPosition(cc.p(0, offsetY));
        }

        if(this.backClicked && typeof(history) !== 'undefined'){
            var self = this;
            history.pushState({}, '');
            var backClicked = function(state){
                //cc.log(self.backClicked);
                self.backClicked();
            } 
            this._pushState = backClicked;               
            window.addEventListener('popstate', backClicked);
        }
    },
    onExit: function(){
        //for(var i = 0; i < this._touchTargets.length; i++){
        //    this._touchTargets[i].removeAllListeners();
        //}
        this.unregisterDelegate();
        if(this.backClicked && typeof(history) !== 'undefined'){
            if(this._pushState){
                window.removeEventListener('popstate', this._pushState);
                this._pushState = null;
            }
        }
        this._batches = {};
        this._super();
    },
    addChild: function(node){
        if(cc.isArray(node)){
            var args = [].slice.call(arguments);
            for(var i = 0; i < node.length; i++){
                args[0] = node[i];
                this.addChild.apply(this, args);
            }
        }else{
            this._super.apply(this, arguments);
            
            if(this._autoDelegate && node.on){
                this.delegate(node);
            }
        }
    },
    addChildToBatch: function(node, batchName){
        if(cc.isArray(node)){
            var args = [].slice.call(arguments);
            for(var i = 0; i < node.length; i++){
                args[0] = node[i];
                this.addChildToBatch.apply(this, args);
            }
        }else{        
            var parent;
            if(this._batches[batchName]){
                parent = this._batches[batchName];
            }else{
                parent = cc.SpriteBatchNode.create(batchName);
                this._batches[batchName] = parent;
                parent.setZOrder(10);
                GameLayer.prototype.addChild.call(this, parent);
            }
            parent.addChild(node);

            if(this._autoDelegate && node.on){
                this.delegate(node);
            }
        }
    },
    setTouchRect: function(rect){
        this._touchRect = rect;
    },
    setClickAndMove: function(clickAndMove){
        this._clickAndMove = clickAndMove;
    },
    setAutoDelegate: function(autoDelegate){
        this._autoDelegate = autoDelegate;
    },
    addSprite: function(sprite, style, parent){

        var parent = parent || this;
        
        sprite = cc.createSprite(sprite, style);
        parent.addChild(sprite);
    },
    /**
     *  touchstart, touchend, touchmove, touchcancelled
     */
    delegate: function(node, event, func) {
        if(this._touchTargets.indexOf(node) < 0){
            if(!node.on){
                cc.mixin(node, new EventEmitter);
            }
            this._touchTargets.unshift(node);
            this._touchTargets.sort(function(a, b){
                return b.getZOrder() - a.getZOrder();
            });
        }
        if(event){
            node.on(event, func);
        }
    },
    undelegate: function(node, event){
        var idx = this._touchTargets.indexOf(node);
        if(idx >= 0){
            if(!event){
                this._touchTargets.splice(idx, 1);
                node.removeAllListeners();
            }else{
                node.removeAllListeners(event);
            }
        }
    },
    registerDelegate: function(){
        cc.registerTargetedDelegate(parseInt(-this.getZOrder()), true, this);
    },
    unregisterDelegate: function(){
        cc.unregisterTouchDelegate(this);
    },
    onTouchBegan: function(touch, event){
        if(this._touchRect){
            if(!cc.rectContainsPoint(this._touchRect, touch.getLocation())){
                return false;
            }
        }
        this._touchPoint = touch.getLocation();
        return delegateTouch(this, touch, 'touchstart');
    },
    onTouchMoved: function(touch, event){
        var location = touch.getLocation();
        var size = director.getWinSize();

        if(!this._clickAndMove && (Math.abs(this._touchPoint.x - location.x) >= size.width / 30
            || Math.abs(this._touchPoint.y - location.y) >= size.height / 30)){
            this._moved = true;
        }            
        return delegateTouch(this, touch, 'touchmove');
    },
    onTouchEnded: function(touch, event){
        delegateTouch(this, touch, 'touchend');

        if(!this._moved){
            delegateTouch(this, touch, 'click');
        }
        this._moved = false;
        return touch.returnValue;
    },
    onTouchCancelled: function(touch, event){
        return delegateTouch(this, touch, 'touchcancel');
    }
});

var MaskLayer = GameLayer.extend({
    init: function(opacity){
        opacity = opacity || 128;
        this._super();
        var mask = cc.LayerColor.create(cc.c4b(0, 0, 0, opacity));
        this.addChild(mask);  
    },
    onEnter: function(){
        this._super();
        this.getParent().delegate(this);
    },
    onExit: function(){
        this.getParent().undelegate(this);
        this._super();
    }
});

var MaskWithRectLayer = GameLayer.extend({
    init: function(rect, opacity){
        this._super();
        var masks = [ new MaskLayer(opacity),
                      new MaskLayer(opacity),
                      new MaskLayer(opacity),
                      new MaskLayer(opacity)];
    
        this.addChild(masks);
        this._masks = masks;

        this.setRect(rect);
    },
    setRect: function(rect){
        var masks = this._masks;
        var scene = director.getWinSize();
        masks[0].setPosition(cc.p(rect.x - scene.width, rect.y));
        masks[1].setPosition(cc.p(rect.x, rect.y + rect.height));
        masks[2].setPosition(cc.p(rect.x + rect.width, rect.y + rect.height - scene.height));
        masks[3].setPosition(cc.p(rect.x + rect.width - scene.width, rect.y - scene.height));
    }
});

module.exports = {
    BaseLayer: BaseLayer,
    BgLayer: BgLayer,
    GameLayer: GameLayer,
    MaskLayer: MaskLayer,
    MaskWithRectLayer: MaskWithRectLayer
};

});