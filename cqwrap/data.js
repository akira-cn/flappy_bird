define(function(require, exports, module){

var default_salt = 'weizoo';

var SimpleStorage = cc.Class.extend({
    ctor: function(name, salt){
        this.name = name;
        this.salt = salt || default_salt;
    },
    getRootKey: function(){
        return [this.salt,this.name].join('::');
    },
    get: function(key, default_value){
        var ret = sys.localStorage.getItem(this.getRootKey()) || "{}";
        ret = JSON.parse(ret);
        if(key == null){
            return ret;
        }else{
            return ret[key] != null ? ret[key] : default_value;
        }
    },
    set: function(key, value){
        var obj = this.get();
        obj[key] = value;
        //cc.log([this.getRootKey(), JSON.stringify(obj)]);
        sys.localStorage.setItem(this.getRootKey(), JSON.stringify(obj));
    }
});

var GameSettings = new SimpleStorage('gameSettings');
var UserData = new SimpleStorage('userData');

module.exports = {
    SimpleStorage: SimpleStorage,
    GameSettings: GameSettings,
    UserData: UserData
};

});