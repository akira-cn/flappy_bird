/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org

 http://www.cocos2d-x.org


 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


require("jsb.js");
require('cqwrap/_define.js');
require('src/resource.js');

(function(){

cc.dumpConfig();
    
    var director = cc.Director.getInstance(),
        eglView = cc.EGLView.getInstance();

    // director.setDisplayStats(true);
    // set FPS. the default value is 1.0/60 if you don't call this
    director.setAnimationInterval(1.0 / 60);

    var frameSize = director.getFrameSize();

    eglView.setDesignResolutionSize(720, 1280, cc.RESOLUTION_POLICY.SHOW_ALL);
    director.offsetY = 0;

    /*if (frameSize.width / frameSize.height < 480.0/800 
        || frameSize.width / frameSize.height >= 0.7) {
        eglView.setDesignResolutionSize(480, 800, cc.RESOLUTION_POLICY.SHOW_ALL);
        director.offsetY = 0;
    }else{
        eglView.setDesignResolutionSize(480, 800, cc.RESOLUTION_POLICY.NOBORDER);
        var winSize = director.getWinSize();
        director.offsetY = (winSize.height - winSize.width * frameSize.height / frameSize.width)/2;
    }*/
    
    //require+CommonJS wrapper
    _require('src/app.js'); 
})();