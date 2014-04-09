flappy_bird
===========

flappy bird using [cocos2d-html5](https://github.com/cocos2d/cocos2d-html5) and [cqwrap](http://go.akira-cn.gitpress.org/)

## 如何调试？

1. 删除 main.js 文件
2. 修改 main-src.js 文件为 main.js
3. 将修改后的main.js开头代码的注释去掉：

```js
require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});
```

执行 ./build.sh 运行服务

访问 localhost:8000 进行调试
