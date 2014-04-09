#ifndef __CQWrap_MessageDelegate_H__
#define __CQWrap_MessageDelegate_H__

#include "cocos2d.h"
#include "cocos-ext.h"

#include "ScriptingCore.h"
#include "jsb_cocos2dx_auto.hpp"
#include "cocos2d_specifics.hpp"

NS_CC_EXT_BEGIN

using namespace cocos2d;

class MessageDelegate : CCObject{
protected:
	CCNotificationCenter* notifier;
	static MessageDelegate* s_delegate;
	MessageDelegate();
public:
	virtual ~MessageDelegate();

	CCNotificationCenter* getNotifier();
	virtual void postMessage(const char* message, const char* data = "null");
	virtual void addObserver(CCObject* target, const char* message, SEL_CallFuncO func);
	virtual void removeObserver(CCObject* target, const char* message);

	void scriptingHandler(CCObject* target);

	static MessageDelegate* sharedMessageDelegate();
	static void purgeMessageDelegate();
};

NS_CC_EXT_END

#endif