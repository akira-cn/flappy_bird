#ifndef __CQWrap_CCWEBVIEW_H__
#define __CQWrap_CCWEBVIEW_H__

#include "cocos2d.h"
#include "cocos-ext.h"
#include "../pattern/Singleton.h"

NS_CC_EXT_BEGIN

class CCWebView: public Singleton<CCWebView> {

public:
	virtual bool open(const char* url);
	virtual void close();
	~CCWebView();
};

NS_CC_EXT_END

#endif