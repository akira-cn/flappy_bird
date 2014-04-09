#ifndef __CQWrap_NativeAdapter_H__
#define __CQWrap_NativeAdapter_H__

#include "cocos2d.h"
#include "cocos-ext.h"
#include "MessageDelegate.h"

class NativeAdapter{
public:
	static void postMessage(const char* message, const char* data);
};

#endif