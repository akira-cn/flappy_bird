#ifndef __Pattern_CustEvent_H_
#define __Pattern_CustEvent_H_

#include "cocos2d.h"
#include "cocos-ext.h"
#include "json.h"

using namespace cocos2d;

NS_CC_EXT_BEGIN

class CustEvent{
protected:
	CCNotificationCenter* m_notifier;
	CustEvent();
	~CustEvent();
	void lazyInit();
public:
	virtual void on(const char* type, CCObject* target, SEL_CallFuncO callback);
	virtual void un(const char* type, CCObject* target, SEL_CallFuncO callback);
	virtual void fire(const char* type, CCObject* args);
};

NS_CC_EXT_END

#endif