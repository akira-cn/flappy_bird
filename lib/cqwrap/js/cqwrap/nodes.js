define(function(require, exports, module){
    
'use strict';

var BaseNode = cc.Node.extend({
    ctor: function(){
        this._super();
        this.init.apply(this, arguments);
        cc.associateWithNative( this, cc.Sprite );            
    },
    init: function(){
        this._super();
    }
});

module.exports = {
    BaseNode: BaseNode
};

});