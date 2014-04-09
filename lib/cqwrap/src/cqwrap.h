
#ifndef __CQWrap_Core_H__
#define __CQWrap_Core_H__

//Detect Memory Leaks
#if(CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
	#include "vld.h"
#endif

#include "cocos2d.h"
#include "pattern/Singleton.h"
#include "pattern/CustEvent.h"
#include "util/NativeAdapter.h"
#include "util/MessageDelegate.h"
#include "util/md5.h"
#include "GUI/CCWebView.h"

#include "scripting/cqwrap_register_all_manual.h"

#endif