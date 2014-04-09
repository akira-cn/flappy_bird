//
//  WebViewLayer.h
//  MyApp1
//
//  Created by DAC-TOAN HO on 11-10-10.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#ifndef __CC_UIWEBVIEW_H__
#define __CC_UIWEBVIEW_H__

#include "cocos2d.h"
#include "cqwrap.h"

class WebViewLayer : public cocos2d::CCLayer {
private:
	int mWebViewLoadCounter;

public:
    WebViewLayer();
    ~WebViewLayer();
    
    virtual bool init(const char* url, const char* title);
    static WebViewLayer* create(const char* url, const char* title);
    
    void webViewDidFinishLoad();
    void onBackbuttonClick();
};
    

#endif