/**
 * cc base Extends
 */

(function(global){

'use strict';

if(!global.console){
	global.console = {
		log: cc.log
	};
}

if(!cc.Assert){
  cc.Assert = function(cond, msg){
    if(!cond){
      throw new Error(msg);
    }
  }
}

var timers = [null];

function setTimer(target, callback, interval, repeat, delay, paused) {
  cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(target, callback, interval / 1000, repeat, delay, paused);
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

var isHtml5 = navigator.userAgent.indexOf('Cocos2dx') < 0;
var isAndroid = navigator.userAgent.indexOf('Android') >= 0;
var isIOS = navigator.userAgent.indexOf('iOS') >= 0;

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

cc.random = function(n){
  if(typeof n === 'number'){
    return 0 | Math.random() * n;
  }
  if(n instanceof Array){
    var len = n.length;
    return n[0 | Math.random() * (len)];    
  }
}

cc.ArrayShuffle = function(arr){
  for (var i = arr.length - 1; i > 0; i--) {
    var j = 0|(Math.random() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }  
}

})(this);