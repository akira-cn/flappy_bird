/**
 * cc base Extends
 */

(function(global){

'use strict';

if(!global.console){
	global.console = {
    log: cc.log,
    error: cc.log,
    trace: cc.log,
    warn: cc.log
	};
}

if(!cc.Assert){
  cc.Assert = function(cond, msg){
    if(!cond){
      throw new Error(msg);
    }
  }
}

var isHtml5 = navigator.userAgent.indexOf('Cocos2dx') < 0;
var isAndroid = navigator.userAgent.indexOf('Android') >= 0;
var isIOS = navigator.userAgent.indexOf('iOS') >= 0;

cc.isHtml5 = isHtml5;
cc.isAndroid = isAndroid;
cc.isIOS = isIOS;
cc.__defineGetter__('isOpenGL', function(){
  return cc.isIOS || cc.isAndroid || cc.Browser && cc.Browser.supportWebGL;
});

if(!cc.isOpenGL){
  cc.TransitionCrossFade = cc.TransitionFadeBL = cc.TransitionFadeTR = cc.TransitionFade;
}

var timers = [null];
function setTimer(target, callback, interval, repeat, delay, paused) {
  if(isHtml5){
    setTimeout(function(){
      cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(target, callback, interval / 1000, repeat, delay, paused);
    }, 0);
  }else{
    cc.Director.getInstance().getScheduler().unscheduleCallbackForTarget(target, callback);
    cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(target, callback, interval / 1000, repeat, delay, paused);
  }
  timers.push(callback);
  return timers.length - 1
}
function clearTimer(target, id) {
  var callback = timers[id];
  if (callback != null) {
    cc.Director.getInstance().getScheduler().unscheduleCallbackForTarget(target, callback);
    timers[id] = null;
  }
}
function clearAllTimers(target){
  cc.Director.getInstance().getScheduler().unscheduleAllCallbacksForTarget(target);
}
cc.Node.prototype.setTimeout = function (callback, interval) {
  return setTimer(this||global, callback, interval||0, 0, 0, false);
};
cc.Node.prototype.setInterval = function (callback, interval) {
  return setTimer(this||global, callback, interval||0, cc.REPEAT_FOREVER, 0, false);
};
cc.Node.prototype.clearAllTimers = function(){
  return clearAllTimers(this||global);
};

cc.Node.prototype.clearInterval = cc.Node.prototype.clearTimeout = function (id) {
  return clearTimer(this||global, id);
};

if (global.setTimeout == undefined) {
  global.setTimeout = cc.Node.prototype.setTimeout;
  global.setInterval = cc.Node.prototype.setInterval;
  global.clearTimeout = cc.Node.prototype.clearTimeout;
  global.clearInterval = cc.Node.prototype.clearInterval
}

//修复cc.MenuItemSprite.create(sprite, sprite)在浏览器下重复使用报错的问题
if (isHtml5) {
  var create = cc.MenuItemSprite.create;
  cc.MenuItemSprite.create = function(){
    var sprite = arguments[0];
    var args = [].slice.call(arguments).map(function(item, i){
      if (i && item === sprite) {
        item = null;
      };
      return item;
    });
    return create.apply(create, args);
  }
}

cc.mixin = function(des, src, mixer) {
	mixer = mixer || function(d, s){
		if(typeof d === 'undefined'){
			return s;
		}
	}
	
	if(mixer == true){
		mixer = function(d, s){return s};
	} 		

	for (var i in src) {
		var v = mixer(des[i], src[i], i, des, src);
		if(typeof v !== 'undefined'){
			des[i] = v;
		}
	}

	return des;
};

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
cc.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
cc.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
cc.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
cc.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
cc.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
cc.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
cc.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
cc.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
cc.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
cc.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
cc.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
cc.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
cc.isFunction = isFunction;

Object.defineProperty(global, 'director', {
  get: function(){
    return cc.Director.getInstance();
  },
  enumerable: true,
  configurable: false,
});

Object.defineProperty(global, 'scene', {
  get: function(){
    return cc.Director.getInstance().getRunningScene();
  },     
  enumerable: true,
  configurable: false, 
});

cc.random = function(n, m){
  if(typeof n === 'number'){
    m = m || 0;
    return 0 | (n + Math.random() * (m - n));
  }
  else if(n instanceof Array){
    var len = n.length;
    if(m == null){
      return n[0 | Math.random() * (len)];
    }else{
      var ret = cc.arrayShuffle(n.slice(0));
      return ret.slice(0, m);
    }   
  }
  else{
    return Math.random();
  }
}

cc.tmpl = function(str, data, format){      
  str = str.replace(/\{([^\{\}]*)\}/g, function(sub, expr){
    if(!expr) return '';
      try{
        var r = (new Function("data", "with(data){return (" + expr + ");}"))(data);
        return format? format(r, expr) : r;
      }catch(ex){
        return sub;
      }
    }
  );

  return str;
};

cc.arrayShuffle = function(arr){
  for (var i = arr.length - 1; i > 0; i--) {
    var j = 0|(Math.random() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }  
  return arr;
}

cc.strToArray = function(value){
  return value.trim().split(/\s*,\s*/).map(function(o){return parseInt(o)});
}

function hex_color_to_cxb(str){
  if(typeof str !== 'string'){
    return str;
  }
  var c3b, c4b, c4f;

  str = str.trim();
  var values = [0, 0, 0];
  if(str[0] === '#'){
    str = str.slice(1);
    if(str.length === 3){
      str = str.replace(/(\w)/g, '$1$1');
    }
    values = str.match(/\w\w/g).map(function(o){
      return parseInt(o, 16);
    });
    c3b = cc.c3b.apply(null, values);
    c4b = cc.c4b.apply(null, values.concat([255]));
    c4f = cc.c4f(c4b.r/255, c4b.g/255, c4b.b/255, c4b.a/255);
    return {c3b:c3b, c4b:c4b, c4f:c4f};
  }else if(str.slice(0, 4) === 'rgb('){
    str = str.slice(4, -1);
    values = cc.strToArray(str);
    c3b = cc.c3b.apply(null, values);
    c4b = cc.c4b.apply(null, values.concat([255]));
    c4f = cc.c4f(c4b.r/255, c4b.g/255, c4b.b/255, c4b.a/255);
    return {c3b:c3b, c4b:c4b, c4f:c4f};
  }else if(str.slice(0, 5) === 'rgba('){
    str = str.slice(5, -1);
    values = cc.strToArray(str);
    c3b = cc.c3b.apply(null, values.slice(-1));
    c4b = cc.c4b.apply(null, values);
    c4f = cc.c4f(c4b.r/255, c4b.g/255, c4b.b/255, c4b.a/255);
    return {c3b:c3b, c4b:c4b, c4f:c4f};    
  }
}

cc.color = function(r, g, b, a){
  if(typeof(r) === 'string'){
    return hex_color_to_cxb(r);
  }else{
    a = a || 255;
    var c3b, c4b, c4f;
    c3b = cc.c3b(r, g, b);
    c4b = cc.c4b(r, g, b, a);
    c4f = cc.c4f(c4b.r/255, c4b.g/255, c4b.b/255, c4b.a/255);
    return {c3b:c3b, c4b:c4b, c4f:c4f}; 
  }
}

if(!isHtml5){
  cc.Director.prototype.pauseAllActions = function(){
    var ret = [];
    var actionManager = director.getActionManager();
    var _pausedTargets = director.getActionManager().pauseAllRunningActions();
    var count = _pausedTargets.count();
    for(var i = 0; i < count; i++){
      var obj = _pausedTargets.anyObject();
      ret.push(obj);
      _pausedTargets.removeObject(obj);
    }
    return ret;
  }
  cc.Director.prototype.resumeActions = function(actions){
    var actionManager = director.getActionManager();
    for(var i = 0; i < actions.length; i++){
      actionManager.resumeTarget(actions[i]);
    }    
  }
}else{
  cc.Director.prototype.pauseAllActions = function(){
    var actionManager = director.getActionManager();
    return actionManager.pauseAllRunningActions();
  }
  cc.Director.prototype.resumeActions = function(actions){
    var actionManager = director.getActionManager();
    return actionManager.resumeTargets(actions);
  }
}

})(this);