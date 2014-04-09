#include "../CCWebView.h"
#include "../../util/MessageDelegate.h"
#include "WebViewLayer.h"

USING_NS_CC_EXT;

DECLARE_SINGLETON_MEMBER(CCWebView);

enum{
	tWebview = 16888,
	zWebview
};

bool CCWebView::open(const char* url){
	CCScene* scene = CCDirector::sharedDirector()->getRunningScene();

	if(scene->getChildByTag(tWebview)) {
        return false;
    }
    
    WebViewLayer* webview = WebViewLayer::create(url, "");
    webview->setPosition(CCPointZero);
    webview->setTag(tWebview);
    scene->addChild(webview, zWebview);

	return true;
}

void CCWebView::close(){
	CCScene* scene = CCDirector::sharedDirector()->getRunningScene();
	
	if(scene->getChildByTag(tWebview)) {
        ((WebViewLayer *)scene->getChildByTag(tWebview))->onBackbuttonClick();
    }
}

CCWebView::~CCWebView(){
	CCWebView::dropInstance();
}

