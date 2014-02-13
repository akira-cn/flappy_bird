define(function(require, exports, module){

'use strict';

var GameLayer = require('cqwrap/layers').GameLayer;

var ScrollLayer = GameLayer.extend({
    onEnter: function(){
        this._super();
        this.setTouchRect(this.getParent().getBoundingBox());
        this.getParent().setTouchPriority(this.getTouchPriority() - 1);
    }
});

function ScrollView(viewport, contentSize){

    var scrollLayer = new ScrollLayer();
    scrollLayer.setAnchorPoint(cc.p(0, 0));
    scrollLayer.setPosition(cc.p(0, 0));
    scrollLayer.setContentSize(contentSize);
    scrollLayer.setClickAndMove(false);

    var scrollView = cc.ScrollView.create(viewport, scrollLayer);

    scrollView.getContentLayer = function(){
        return scrollLayer;
    }  
    return scrollView;
}

ScrollView.create = function(viewport, contentSize){
    return new ScrollView(viewport, contentSize);
}

module.exports = {
    ScrollView: ScrollView
};

});