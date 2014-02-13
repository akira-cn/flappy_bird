(function(global){
    /* define(function(require, exports, module){}) */
    var _modCache = {};
    var _moduleStack = [];

    function _require(mod){
        
        mod = mod.replace(/\.js$/, '');

        if(!_modCache[mod]){
            _moduleStack.push({exports:{}});
            require(mod + '.js');
            _modCache[mod] = module.exports;
            _moduleStack.pop();
        }
        
        return _modCache[mod];
    }

    global.define = function(func){
        var ret = func(_require, module.exports, module);
        if(module.use <= 1){
            module.exports = ret;
        }
        return ret;
    } 

    Object.defineProperty(global, 'module', {
        get: function(){
            var module = _moduleStack[_moduleStack.length - 1];
            module.use = module.use || 0;
            module.use++;
            return module;
        },
        enumerable: true,
        configurable: false,    
    }); 

    Object.defineProperty(global, 'exports', {
        get: function(){
            return module.exports;
        },
        enumerable: true,
        configurable: false,
    });

    Object.defineProperty(global, '_require', {
        value: _require,
    });

})(this);   
