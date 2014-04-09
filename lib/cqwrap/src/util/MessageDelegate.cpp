#include "NativeAdapter.h"
#include "MessageDelegate.h"

USING_NS_CC_EXT;

MessageDelegate* MessageDelegate::s_delegate = NULL;

MessageDelegate::MessageDelegate(){
	notifier = new CCNotificationCenter();

	notifier->addObserver(this, callfuncO_selector(MessageDelegate::scriptingHandler), "message", NULL);
}

MessageDelegate::~MessageDelegate(){
	notifier->release();
}

CCNotificationCenter* MessageDelegate::getNotifier(){
	return notifier;
}

void MessageDelegate::postMessage(const char* message, const char* data){
	NativeAdapter::postMessage(message, data);
}

void MessageDelegate::addObserver(CCObject* target, const char* message, SEL_CallFuncO func){
	notifier->addObserver(
		target,                         
		func,  
		message,                   
		NULL); 
}

void MessageDelegate::removeObserver(CCObject* target, const char* message){
	notifier->removeObserver(
		target,
		message); 
}

MessageDelegate* MessageDelegate::sharedMessageDelegate(){
	if(NULL == MessageDelegate::s_delegate){
		MessageDelegate::s_delegate = new MessageDelegate();
	}
	return MessageDelegate::s_delegate;
}

void MessageDelegate::purgeMessageDelegate(){
	if(NULL != MessageDelegate::s_delegate){
		CC_SAFE_DELETE(MessageDelegate::s_delegate);
	}
}

void MessageDelegate::scriptingHandler(CCObject* data){
	ScriptingCore::getInstance()->evalString(CCString::createWithFormat("native.onmessage('%s')", 
		((CCString*)data)->getCString())->getCString(), NULL);
}