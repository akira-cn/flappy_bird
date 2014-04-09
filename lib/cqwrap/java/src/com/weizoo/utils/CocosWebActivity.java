package com.weizoo.utils;

import java.net.URLEncoder;

import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class CocosWebActivity extends Activity {
	
	protected void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		
		String url = this.getIntent().getExtras().getString("url");
		
		WebView mWebView = new WebView(this);
		
		mWebView.setWebChromeClient(new WebChromeClient());
		initWebViewSettings(mWebView);
		mWebView.setHorizontalScrollBarEnabled(false);
		mWebView.setVerticalScrollBarEnabled(false);
        
		mWebView.setWebViewClient(new WebViewClient()
        {
        	public boolean shouldOverrideUrlLoading(final WebView view, final String url) {
        		if(url.startsWith("weizoo:")){
        			//JavaScript interface to cocos2dx-jsb
        			String jsCode = url.replaceAll("^weizoo:", "");
        			//jsCode = jsCode.replaceAll("\"", "\\\\\"");
        			
        			if(jsCode.equals("close()")){
        				CocosWebActivity.this.finish();
        				return true;
        			}
        			
        			JSONObject data = new JSONObject();
        			try {
        				jsCode = URLEncoder.encode(jsCode, "utf-8");
						data.put("protocal", "weizoo");
						data.put("code", jsCode);
					} catch (Exception e) {
						e.printStackTrace();
					}
        			
        			CocosMessageDelegate.postMessage("message", data.toString());
        			CocosWebActivity.this.finish();
        		}else if(url.startsWith("market:")){
        			Intent intent= new Intent();        
        			intent.setAction("android.intent.action.VIEW");  

        			try{  
	        			Uri content_url = Uri.parse(url);   
	        			intent.setData(content_url);  
	        			startActivity(intent);
        			}catch(Exception ex){
        				String newURL = url.replaceAll("^market://", "http://play.google.com/store/apps/");
	        			Uri content_url = Uri.parse(newURL);   
	        			intent.setData(content_url);  
	        			startActivity(intent);
        			}
        		}else{
        			view.loadUrl(url);
        		}
        		
        		return true; 
        	}
        });		
		//LayoutParams layoutParams = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
		//mWebView.setVisibility(View.GONE);
		
		mWebView.loadUrl(url);
		this.setContentView(mWebView);
	}

	@SuppressLint("SetJavaScriptEnabled")
	private void initWebViewSettings(WebView webView){
		final WebSettings settings = webView.getSettings();
		//settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);
		//settings.setUseWideViewPort(true);
		settings.setJavaScriptEnabled(true);
		//settings.setJavaScriptCanOpenWindowsAutomatically(true);
		//settings.setSupportMultipleWindows(true);
		//settings.setBuiltInZoomControls(true);
		settings.setDefaultTextEncodingName("utf-8");
		//settings.setDomStorageEnabled(true);		
		//settings.setAppCacheEnabled(true);  
		settings.setLoadWithOverviewMode(true);
		//settings.setSupportZoom(true);
		//settings.setUserAgentString("Android");		
	}	
}
