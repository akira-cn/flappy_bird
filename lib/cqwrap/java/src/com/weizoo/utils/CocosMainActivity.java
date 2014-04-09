package com.weizoo.utils;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Method;
import java.net.URLEncoder;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class CocosMainActivity extends Cocos2dxActivity implements CocosMessageInterface{
	private boolean _paused = false;
	protected void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		//you must call this method on sub-class
		//CocosMessageDelegate.register(this);
	}
	
    public JSONObject open(final JSONObject params){
    	this.runOnUiThread(new Runnable(){
			@Override
			public void run() {
    			Intent intent= new Intent(CocosMainActivity.this, CocosWebActivity.class);        
    			try {
					intent.putExtra("url", params.getString("url"));
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
    			startActivity(intent);
			}			
		});    
    	return null;
    }
    
	@Override
	public void onMessage(String message, String data) {
		Log.d("Log", data);

		if(message.equals("message")){
			try {
				JSONObject jsonData = new JSONObject(data);
				if(jsonData.has("jsonrpc")){
					JSONObject result = new JSONObject();
					result.put("id", jsonData.getInt("id"));
					result.put("jsonrpc", "2.0");
					try {
						@SuppressWarnings("rawtypes")
						Class[] cargs = new Class[1];
						cargs[0] = JSONObject.class;
						Method method = this.getClass().getMethod(jsonData.getString("method"), cargs);
						result.put("result", method.invoke(this, jsonData.getJSONObject("params")));
					} catch (Exception e) {
						result.put("error", e.getMessage());
						e.printStackTrace();
					}
					this.postMessage("message", result.toString());
				}
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
		}	
	}

	@Override
	public void postMessage(String message, String data) {
		CocosMessageDelegate.postMessage(message, data);
	}
	
	@Override
	public void onPause(){
		super.onPause();
		this._paused = true;
		
		final JSONObject data = new JSONObject();
		try {
			data.put("protocal", "weizoo");
			data.put("code", URLEncoder.encode("director.emit('appDidEnterBackground')", "utf-8"));
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.runOnGLThread(new Runnable(){
			@Override
			public void run() {
				postMessage("message", data.toString());
			}
		});
	}
	
	@Override
	public void onResume(){
		super.onResume();
		
		if(this._paused){
			final JSONObject data = new JSONObject();
			try {
				data.put("protocal", "weizoo");
				data.put("code", URLEncoder.encode("director.emit('appWillEnterForeground')", "utf-8"));
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			this.runOnGLThread(new Runnable(){
				@Override
				public void run() {
					postMessage("message", data.toString());
				}
			});
		}
	}
}