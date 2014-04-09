#include "../pattern/CustEvent.h"

USING_NS_CC_EXT;

CustEvent::CustEvent(){
	m_notifier = NULL;
}

CustEvent::~CustEvent(){
	CC_SAFE_RELEASE(m_notifier);
}

void CustEvent::lazyInit(){
	if(!m_notifier){
		m_notifier = new CCNotificationCenter();
	}
}

void CustEvent::on(const char* type, CCObject* target, SEL_CallFuncO callback){
	lazyInit();
	m_notifier->addObserver(target, callback, type, NULL);
}

void CustEvent::un(const char* type, CCObject* target, SEL_CallFuncO callback){
	lazyInit();
	m_notifier->removeObserver(target, type);
}

void CustEvent::fire(const char* type, CCObject* args){
	lazyInit();
	m_notifier->postNotification(type, args);
}