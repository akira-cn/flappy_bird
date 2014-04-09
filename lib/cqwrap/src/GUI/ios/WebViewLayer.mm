//
//  WebViewLayer.mm
//  MyApp1
//
//  Created by DAC-TOAN HO on 11-10-10.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//
#include "WebViewLayer.h"
#include "UIWebViewBridge.h"

    static UIWebViewBridge *gUIWebViewBridge=nil;

    WebViewLayer::WebViewLayer() {
    
    }
                  
    WebViewLayer::~WebViewLayer() {
      [gUIWebViewBridge release];
    }

    void WebViewLayer::webViewDidFinishLoad() {
      
    }

    void WebViewLayer::onBackbuttonClick() {
        this->removeFromParentAndCleanup(true);
    }

    bool WebViewLayer::init(const char* url, const char* title)  {
        if ( !CCLayer::init() ) {
            return false;
        }
        
        gUIWebViewBridge = [[UIWebViewBridge alloc] init];
        [gUIWebViewBridge setLayerWebView : this URLString : url : title];
        
        return true;
    } 

    WebViewLayer *WebViewLayer::create(const char* url, const char* title) {
        WebViewLayer *webview = new WebViewLayer();
        webview->autorelease();
        webview->init(url, title);
        
        return webview;
    }
