//
//  UIDelegateBridge.mm
//  MyApp1
//
//  Created by DAC-TOAN HO on 11-10-10.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "UIWebViewBridge.h"
#import "EAGLView.h"

@implementation UIWebViewBridge

- (id)init
{
    self = [super init];
    if (self) {
        // Initialization code here.
    }
    
    return self;
}

- (void)dealloc
{
    [mTitle release];
   	[mBackButton release];
    [mToolbar release];
	[mWebView release];
	[mView release];
    [mLoading release];
    [super dealloc];
}


-(void) setLayerWebView : (WebViewLayer*) iLayerWebView URLString:(const char*) urlString : (const char *) title {
    mLayerWebView = iLayerWebView;
    CGRect windowRect = [[UIScreen mainScreen]bounds];  
    cocos2d::CCSize size = cocos2d::CCSizeMake(windowRect.size.width, windowRect.size.height);
    mView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, size.width , size.height)];
    
    // create webView
    int wTopMargin = 32;
    int wWebViewHeight = size.height - wTopMargin;
    mWebView = [[UIWebView alloc] initWithFrame:CGRectMake(0, wTopMargin, size.width, wWebViewHeight)];
    mWebView.delegate = self;
    //mWebView.backgroundColor = [UIColor darkGrayColor];
    mWebView.opaque = NO;
    
    //NSString *urlBase = [NSString stringWithCString:urlString encoding:NSUTF8StringEncoding];
    NSString *fullPath = [NSBundle pathForResource:@"web/more"
                                            ofType:@"html" inDirectory:[[NSBundle mainBundle] bundlePath]];
    
    [mWebView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:fullPath ]]];
    [mWebView setUserInteractionEnabled:NO];
    
    mToolbar = [UIToolbar new];
    [mToolbar setFrame:CGRectMake(0, 0, size.width, wTopMargin)];
    mToolbar.barStyle = UIBarStyleBlackOpaque;
    
    NSMutableArray *buttons = [[NSMutableArray alloc]initWithCapacity:2];
    
    //Create a button
    mBackButton = [[UIBarButtonItem alloc] initWithTitle:@"Back"
                                                   style: UIBarButtonItemStyleBordered
                                                  target: self
                                                  action:@selector(backClicked:)];
    
    [buttons addObject:mBackButton];
    
    mTitle = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 180.0f, wTopMargin)];
    mTitle.font=[UIFont systemFontOfSize:22];
    mTitle.textAlignment = NSTextAlignmentCenter;
    mTitle.backgroundColor = [UIColor clearColor];
    mTitle.textColor = [UIColor whiteColor];
    mTitle.text = [NSString stringWithCString:title encoding:NSUTF8StringEncoding];
    UIBarButtonItem *mTitleItem = [[UIBarButtonItem alloc]initWithCustomView:mTitle];
    
    [buttons addObject: mTitleItem];     //添加文本
    
    [mToolbar setItems:buttons animated:YES];
    [mView addSubview:mToolbar];
    
    [mView addSubview:mWebView];
    
    mLoading = [[UIActivityIndicatorView alloc]
                initWithFrame : CGRectMake(0.0f, 0.0f, 128.0f, 128.0f)];
    [mLoading setCenter: mView.center] ;
    [mLoading setActivityIndicatorViewStyle: UIActivityIndicatorViewStyleWhiteLarge];
    [mLoading startAnimating];
    
    [mView addSubview : mLoading] ;

    [[EAGLView sharedEGLView] addSubview:mView];
}

- (void)webViewDidStartLoad:(UIWebView *)thisWebView {
}

- (void)webViewDidFinishLoad:(UIWebView *)thisWebView{ 
    [mWebView setUserInteractionEnabled:YES];
    [mLoading stopAnimating];
    
    mLayerWebView->webViewDidFinishLoad();
}

- (void)webView:(UIWebView *)thisWebView didFailLoadWithError:(NSError *)error 
{
	if ([error code] != -999 && error != NULL) { //error -999 happens when the user clicks on something before it's done loading.
        [mLoading stopAnimating];
        /*
		UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Network Error" message:@"It was unable to load the page. Please try again later when you have a network connection."
													   delegate:self cancelButtonTitle:nil otherButtonTitles:@"OK", nil];
		[alert show];
		[alert release];
		*/
	}		
} 

- (BOOL) webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    static NSString *prefix = @"weizoo:";
    NSString *url = request.URL.absoluteString;
    
    if ([url hasPrefix:prefix]) {
        NSMutableString *mstr = [NSMutableString stringWithString:url];
        
        [mstr deleteCharactersInRange:NSMakeRange(0, 7)];
        
        // NSLog(url);
        // 自己去分析你的url,提取你的参数
        cocos2d::CCString *jsonResult =
            cocos2d::CCString::createWithFormat("{\"protocal\":\"weizoo\", \"code\":\"%s\"}"
                                                , [mstr UTF8String]);
        
        //NSLog(mstr);
        
        cocos2d::extension::MessageDelegate::sharedMessageDelegate()->getNotifier()->postNotification("message", jsonResult);
        
        return NO;
    }
    
    return YES;
}

-(void) backClicked:(id)sender {
	mWebView.delegate = nil; //keep the webview from firing off any extra messages
    
	//remove items from the Superview...just to make sure they're gone
	[mToolbar removeFromSuperview];
	[mWebView removeFromSuperview];
	[mView removeFromSuperview];    
   
	mLayerWebView->onBackbuttonClick();
}


@end
