//
//  UIDelegateBridge.h
//  MyApp1
//
//  Created by DAC-TOAN HO on 11-10-10.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <UIKit/UIKit.h>
#import <UIKIt/UIColor.h>

#import "WebViewLayer.h"

@interface UIWebViewBridge : NSObject<UIWebViewDelegate,UIAlertViewDelegate>
{
    WebViewLayer * mLayerWebView; 
    UIView    *mView;
    UIWebView *mWebView;
    UIToolbar *mToolbar;
    UILabel *mTitle;
    UIBarButtonItem *mBackButton;
    UIActivityIndicatorView *mLoading;
}

-(void) setLayerWebView : (WebViewLayer*) iLayerWebView URLString:(const char*) urlString: (const char*) title ;
-(void) backClicked:(id)sender;
-(BOOL) shouldStartLoadWithRequest:(NSURLRequest *)navigationType;

@end