define(function(require, exports, module){

'use strict';

var when = require('cqwrap/when');

var id = 0,
    callbacks = [];

if(!global.native){
    global.native = {postMessage: function(){
        cc.log('native interface not found, ignored.');
    }};
}

Object.defineProperty(native, 'onmessage', {
    value: function(data){
        //try{

        var data = JSON.parse(data);
        if(data && data.jsonrpc == "2.0"){
            var callback = callbacks[data.id];
            if(callback){
                callback(data);
            }
        }
        //{protocal, code}
        else if(data && data.protocal == "weizoo"){
            var code = decodeURIComponent(data.code);
            if(code){
                (new Function(code))();
            }
        }
        //}catch(ex){
        //  cc.log('error parse json string:' + data);  
        //}        
    },
    enumerable: false,
    writable: false,
    configurable: false,
});

native.call = function(method, params){
    var deferred = when.defer();

    params = params || {};

    var data = {
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: id++,
    };

    callbacks[data.id] = function(data){
        if(data.result){
            deferred.resolve(data.result);
        }else{
            deferred.reject(data.error);
        }
    }

    native.postMessage(JSON.stringify(data));

    return deferred.promise;
};

module.exports = native;
});
    