# vue-webpack

介绍 vue+webpack 手动搭建过程，熟悉 webpack 的配置，loader&amp;插件的使用

### 介绍

**目标：熟悉 webpack 的配置，loader&amp;插件的使用**

通常新建 vue 项目都使用 vue-cli 脚手架，其实对于 webpack 的配置是一知半解，当需要升级 webpack 或者优化项目配置时，就显得很无力。通过手动搭建 webpack 可以对 webpack 有更深入的了解，当我们使用其他模块管理器时（eg：rollup，gulp），也不会那么生疏。

### 关于 dependencies 和 devDependencies

通过 NODE_ENV=developement 或 NODE_ENV=production 指定开发还是生产环境

devDependencies 是只会在开发环境下依赖的模块，生产环境不会被打入包内。

而 dependencies 依赖的包不仅开发环境能使用，生产环境也能使用。其实这句话是重点，按照这个观念很容易决定安装模块时是使用--save 还是--save-dev。

### 项目包版本

[项目地址](https://github.com/yuanyuanshen/vue-webpack)

```json
    "dependencies": {
        "@xunlei/vue-lazy-component": "^1.1.3",
        "echarts": "^4.2.1",
        "element-resize-event": "^3.0.3",
        "element-ui": "^2.7.2",
        "file-loader": "^4.0.0",
        "html-loader": "^0.5.5",
        "html-webpack-plugin": "^3.2.0",
        "intersection-observer": "^0.7.0",
        "lodash": "^4.17.11",
        "url-loader": "^2.0.0",
        "vue": "^2.6.10",
        "webpack": "^4.34.0"
    }
```

### 遇到的配置错误

#### 1.vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin in your webpack config.

解决办法：Vue-loader 在 15.\*之后的版本都是 vue-loader 的使用都是需要伴生 VueLoaderPlugin 的

#### 2.Entrypoint undefined = index.html 代码不报错但是页面白版

解决办法：webpcak.config.js 中

```json
new HTMLPlugin({
  template: 'index.html'
}),
```

#### 3.Child html-webpack-plugin for "index.html": Entrypoint undefined = index.html

解决办法：webpcak.config.js 中

```json
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
```

这里涉及到一个小知识点 编译时&运行时

#### 4.运行时 + 编译器 vs. 只包含运行时

https://cn.vuejs.org/v2/guide/installation.html#%E8%BF%90%E8%A1%8C%E6%97%B6-%E7%BC%96%E8%AF%91%E5%99%A8-vs-%E5%8F%AA%E5%8C%85%E5%90%AB%E8%BF%90%E8%A1%8C%E6%97%B6

因为在 Vue.js 2.0 中，最终渲染都是通过 render 函数，如果写 template 属性，则需要编译成 render 函数，那么这个编译过程会发生运行时，所以需要带有编译器的版本。很显然，这个编译过程对性能会有一定损耗，所以通常我们更推荐使用 Runtime-Only 的 Vue.js。

只有以下情况会用到 compiler： 1.有指定 template; 2.没指定 template，也没指定 render（这时候使用的就是被挂载元素的 outerHtml）。

所以，**没有使用到 compiler 的情况只有：没有指定 template，但指定了 render。**

有时会遇到这样的错误：[Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.

以上提到，解决这个问题有两种方式，但大多会选择后者，也就是使用全功能的 vue（runtime+compiler），这个版本的 vue 文件相比仅包含 runtime 的版本体积要大，而且运行时的 compiler 转换会消耗性能，compiler 过程其实可以放到构建过程中进行。总结就是，如果可以的话，尽量使用 runtime 版的 vue 文件。

#### 5. It's no longer allowed to omit the '-loader' suffix when using loaders.

Webpack 新版本要求配置 module 中的 loader 不能缩写，也就是

loader:"json-loader"

中的-loader 必须要写。

(在网上找配置时需要注意)

### 搭建步骤

#### 1.生成 package.json

```
npm init
```

#### 2.安装依赖

```
npm i webpack vue vue-loader
npm i css-loader vue-template-compiler
```

#### 3.文件目录

##### 新建 app.vue

```html
<template>
  <div id="test">{{text}}</div>
</template>

<script>
  export default {
    data() {
      return {
        text: 'abc'
      }
    }
  }
</script>
<style>
  #test {
    color: red;
  }
</style>
```

##### 新建入口文件 index.js

```js
import Vue from 'vue'
import App from './app.vue'

// Runtime Only
// new Vue({
//   render: h => h(App) //h就是vue中的createApp参数
// }).$mount('#app') //将app挂载到body下的div上

// 会用到 compiler 所以使用全功能的 vue
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
```

##### 新建 webpack.config.js 配置

```js
const path = require('path') //nodeJs的基本包
module.exports = {
  //path.join(__dirname, 'src/index.js')中__dirname表示当前文件的路径，path.join就是将当前文件的路径跟'src/index.js'拼接起来，形成一个绝对路径
  entry: path.join(__dirname, 'src/index.js'),
  //输出文件，取名为bundle.js，路径为dist文件夹
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}
```

##### 修改 package.json 文件

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.config.js"
  }
```

##### webpack 配置项目加载各种静态资源及 css 预处理器

其中 index.js 入口文件如下：

```js
import './assets/css/global.css'
```

其中 webpack.config.js 如下：

```js
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader', //能够将图片转成base64代码直接写在js里面,依赖file-loader，所以在安装的时候不仅要装url-loader还要装file-loader
            options: {
              limit: 1024, //如果文件大小小于1024字节，就会转义成base64,否则仍然是图片
              name: '[name]-aaa.[ext]' //输出文件的名字,name就是原先图片的名字,-aaa是自己家的字段
            }
          }
        ]
      }
    ]
  },
```

##### webpack-dev-server 的配置和使用

- 先在 package.json 中的 script 中加一个命令"dev":“webpack-dev-server --config webpack.config.js”

```json
"scripts": {
  "build": "cross-env NODE_ENV=production webpack --config webpack.config.js",
  "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js"
}
```

cross-env 能跨平台地设置及使用环境变量

npm 安装方式

npm i --save-dev cross-env

在 npm 脚本(多是 package.json)里这么配置

```json
"scripts": {
  "build": "cross-env NODE_ENV=production webpack --config webpack.config.js",
}
```

运行 npm run build，这样 NODE_ENV 便设置成功，无需担心跨平台问题

- 修改 webpack 设置，来专门适应我们的 webpack-dev-server 的开发模式

- 添加 webpack 的编译目标 target 为 web

- 添加变量 isDev，用于读取是否为 development 环境。

- 需要一个 html，去容纳我们的 js 文件,不然没有 html，我们的项目是不能在浏览器中显示的[html-webpack-plugin 详细用法](https://webpack.docschina.org/plugins/html-webpack-plugin/)

- devServer 中，还有其他的配置
  1.historyFallback 对于非定义的路由的处理
  2.open: true,//启动的时候，自动打开浏览器
  3.hot: true,//热加载，不需要刷新页面就能加载出来

- 当使用热加载时还需要添加插件
  1.new webpack.HotModuleReplacementPlugin()
  2.new webpack.NoEmitOnErrorsPlugin()//减少我们不需要的信息的展示

- source-map 的配置
  config.devtool = '#cheap-module-eval-source-map';

所以，整个 webpack 的代码为：

```js
const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'dist/bundle.js',
    path: path.join(__dirname, 'dist')
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js' // 用 webpack 1 时需用 'vue/dist/vue.common.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader', //能够将图片转成base64代码直接写在js里面,依赖file-loader，所以在安装的时候不仅要装url-loader还要装file-loader
            options: {
              limit: 1024, //如果文件大小小于1024字节，就会转义成base64,否则仍然是图片
              name: '[name]-aaa.[ext]' //输出文件的名字,name就是原先图片的名字,-aaa是自己家的字段
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }), //一般vue、react等框架都要用到这个插件。
    //在这里定义了，在我们的js代码中是可以引用到的。
    //现在,veu/react这类框架会根据环境去区分打包，打包后的dist在开发环境中是比较大的，因为有很多类似错误的信息们可以帮助我们开发人员开发，而生产环境是比较小的，没有繁多的错误信息，我们也不希望错误信息给用户看，所以就没必要把错误信息打包进去了
    //为什么单引号里面还要双引号？因为如果没有的话，调用的时候，就成了process.env.NODE_ENV = development,这时候development就成了一个变量，所以需要写上双引号
    new HTMLPlugin({
      template: 'index.html'
    }),
    new VueLoaderPlugin()
  ]
}

if (isDev) {
  config.devtool = '#cheap-module-eval-source-map' //帮助我们在页面上调试我们的代码的,并且有很多种source-map的映射方式，不同映射方式有不同的优缺点，这里写的只是其中一种，这个值，可以让你在浏览器看到源码
  config.devServer = {
    port: 8088,
    host: 'localhost', //可以通过localhost,127.0.0.1,本机的内网IP进行访问（IP的话，就可以在别人的电脑上访问）
    overlay: {
      error: true //如果编译有错误，就直接显示在网页上
    },
    open: true,
    hot: true //热加载，不需要刷新页面就能加载出来
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin() //减少我们不需要的信息的展示
  )
}
module.exports = config
```

### webpack 指定 mode

这部分厉害了，看完文档就知道为什么使用 vue-cli 脚手架 vue init webpack [项目名]生成的 webpack 配置文件包含

```js
;-build | -webpack.base.conf.js | -webpack.base.dev.js | -webpack.base.prod.js
```

#### 配置

development(开发环境) 和 production(生产环境) 这两个环境下的构建目标存在着巨大差异。

- 开发环境中：强大的 source map 和一个有着 live reloading(实时重新加载) 或 hot module replacement(热模块替换) 能力的 localhost server
- 生产环境：关注点在于压缩 bundle、更轻量的 source map、资源优化等，通过这些优化方式改善加载时间。

我们先从安装 webpack-merge 开始，并将已经成型的那些代码进行分离：

```
npm install --save-dev webpack-merge
```

```
- |- webpack.config.js
+ |- webpack.common.js
+ |- webpack.dev.js
+ |- webpack.prod.js
```

具体使用方式查看文档[webpack 指定 mode](https://webpack.docschina.org/guides/production/#%E6%8C%87%E5%AE%9A-mode)

### 生产环境性能优化

#### 1.html-webpack-plugin

该插件将为你生成一个 HTML5 文件， 其中包括使用 script 标签的 body 中的所有 webpack 包。

[插件配置项地址](https://github.com/jantimon/html-webpack-plugin#options)

```json
new HTMLPlugin({
      template: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
```

针对生成的 html 移除注释、删除空行、html 压缩等操作

#### 2.MiniCssExtractPlugin

##### 将 CSS 提取为独立的文件的插件

[MiniCssExtractPlugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin/#src/components/Sidebar/Sidebar.jsx)

查看文件中 webpack.config.js 配置

```json
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // 类似 webpackOptions.output里面的配置 可以忽略
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
            {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isDev ? 'sass-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
    ]
  }
}
```

测试 css 被单独提取，文件大小为 main.css 264K

##### 高级配置示例

### 参考（特别感谢）

1. [你真的理解 devDependencies 和 dependencies 区别吗?](https://blog.csdn.net/achenyuan/article/details/80899783)
2. [webpack 中文文档](https://www.webpackjs.com/)
3. [vue 编译时运行时](https://www.cnblogs.com/xiangxinhouse/p/8447507.html)
4. [了解 vue 里的 Runtime Only 和 Runtime+Compiler](https://www.jianshu.com/p/466510d84e36)
5. [It’s no longer allowed to omit the ‘-loader’ suffix ](https://www.jianshu.com/p/71a94516b607)
6. [vue 项目从 0 搭建(webpack 手动搭建)](https://blog.csdn.net/qq_17175013/article/details/82947957)
7. [webpack4 mini-css-extract-plugin](https://www.cnblogs.com/ysk123/p/9990082.html)
