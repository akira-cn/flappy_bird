#include "cqwrap_register_all_manual.h"
#include "../GUI/CCWebView.h"
#include "../util/MessageDelegate.h"
#include "../util/md5.h"


static JSBool js_cocos2dx_alert(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);

	if (argc == 1) {
		std::string* message = new std::string();

		do {
			JSBool ok = jsval_to_std_string(cx, argv[0], message);
			JSB_PRECONDITION2( ok, cx, JS_FALSE, "Error processing arguments");
		} while (0);

		CCMessageBox(message->c_str(), "");

		CC_SAFE_DELETE(message);

		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
	return JS_FALSE;
}

static JSBool js_cocos2dx_md5(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);

	if (argc == 1) {
		std::string text = std::string();

		do {
			JSBool ok = jsval_to_std_string(cx, argv[0], &text);
			JSB_PRECONDITION2( ok, cx, JS_FALSE, "Error processing arguments");
		} while (0);

		std::string std = md5(text); 
		JS_SET_RVAL(cx, vp, std_string_to_jsval(cx,  std));
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
	return JS_FALSE;
}

#if(CC_TARGET_PLATFORM == CC_PLATFORM_IOS)	
static JSBool js_cocos2dx_open(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);

	if (argc == 1) {
		std::string* url = new std::string();

		do {
			JSBool ok = jsval_to_std_string(cx, argv[0], url);
			JSB_PRECONDITION2( ok, cx, JS_FALSE, "Error processing arguments");
		} while (0);

		extension::CCWebView::getInstance()->open(url->c_str());

		CC_SAFE_DELETE(url);

		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
	return JS_FALSE;
}

static JSBool js_cocos2dx_close(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		extension::CCWebView::getInstance()->close();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
#endif

static JSBool js_cocos2dx_postMessage(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	if (argc >= 1) {
		std::string* msg = new std::string();

		do {
			JSBool ok = jsval_to_std_string(cx, argv[0], msg);
			JSB_PRECONDITION2( ok, cx, JS_FALSE, "Error processing arguments");
		} while (0);

		extension::MessageDelegate::sharedMessageDelegate()->postMessage("message", msg->c_str());

		CC_SAFE_DELETE(msg);

		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;	
	}
	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
	return JS_FALSE;
}

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#define USER_AGENT "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.94 Safari/537.36 Android/4.2 Cocos2dx/2.2"
#endif

#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
#define USER_AGENT "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.94 Safari/537.36 iOS/6.1 Cocos2dx/2.2"
#endif

#ifndef USER_AGENT
#define  USER_AGENT "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.94 Safari/537.36 Cocos2dx/2.2"
#endif

JSObject* createGlobalObj(JSContext* cx, JSObject* global, char* name){
	jsval nsval;
	JSObject *ns;
	JS_GetProperty(cx, global, name, &nsval);
	if (nsval == JSVAL_VOID) {
		ns = JS_NewObject(cx, NULL, NULL, NULL);
		nsval = OBJECT_TO_JSVAL(ns);
		JS_SetProperty(cx, global, name, &nsval);
	} else {
		JS_ValueToObject(cx, nsval, &ns);
	}
	return ns;	
}

void register_all_misc_manual(JSContext* cx, JSObject* global){
	
	JS_DefineProperty(cx, global, "global", OBJECT_TO_JSVAL(global), NULL, NULL, JSPROP_PERMANENT | JSPROP_READONLY);

	JS_DefineFunction(cx, global, "alert", js_cocos2dx_alert, 1, JSPROP_READONLY | JSPROP_PERMANENT | JSPROP_ENUMERATE);
	JS_DefineFunction(cx, global, "md5", js_cocos2dx_md5, 1, JSPROP_READONLY | JSPROP_PERMANENT | JSPROP_ENUMERATE);

#if(CC_TARGET_PLATFORM == CC_PLATFORM_IOS)	
	JS_DefineFunction(cx, global, "open", js_cocos2dx_open, 1, JSPROP_READONLY | JSPROP_PERMANENT | JSPROP_ENUMERATE);
	JS_DefineFunction(cx, global, "close", js_cocos2dx_close, 0, JSPROP_READONLY | JSPROP_PERMANENT | JSPROP_ENUMERATE);
#endif

	createGlobalObj(cx, global, "navigator");
	ScriptingCore::getInstance()->evalString(CCString::createWithFormat("(function(){navigator.userAgent = '%s'})()", USER_AGENT)->getCString(), NULL);

	JSObject* native = createGlobalObj(cx, global, "native");
	JS_DefineFunction(cx, native, "postMessage", js_cocos2dx_postMessage, 2, JSPROP_READONLY | JSPROP_PERMANENT);

	CCSize size = CCEGLView::sharedOpenGLView()->getFrameSize();
	ScriptingCore::getInstance()->evalString(CCString::createWithFormat("cc.Director.getInstance().getFrameSize = function(){return {width:%lf,height:%lf}};", size.width, size.height)->getCString(), NULL);
}