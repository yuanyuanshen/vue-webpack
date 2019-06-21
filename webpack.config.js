const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')
const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: '[name].[chunkhash].bundle.js',
    // filename: 'bundle.js',
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
        test: /\.(sa|sc|c)ss$/,
        use: [
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     publicPath: '../'
          //   }
          // },
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
        // use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff2?)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.(ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot(\?.*)?$/,
        loader: 'file-loader'
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
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
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
    new VueLoaderPlugin()
  ]
}

if (isDev) {
  config.mode = 'development'
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
} else {
  config.mode = 'production'
  config.devtool = 'source-map'
  // css压缩
  ;(config.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        parallel: true,
        uglifyOptions: {
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_fnames: false
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'initial',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        commons: {
          name: 'comomns',
          minChunks: 2, // 最小共用次数
          minSize: 0, //代码最小多大，进行抽离
          priority: 1 //该配置项是设置处理的优先级，数值越大越优先处理
        }
      }
    }
  }),
    // 生产环境下单独提取css
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      // 使用 npm run build --report 查看分析报告
      new BundleAnalyzerPlugin({
        //  可以是`server`，`static`或`disabled`。
        //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
        //  在“静态”模式下，会生成带有报告的单个HTML文件。
        //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
        analyzerMode: 'server',
        //  将在“服务器”模式下使用的主机启动HTTP服务器。
        analyzerHost: '127.0.0.1',
        //  将在“服务器”模式下使用的端口启动HTTP服务器。
        analyzerPort: 8888,
        //  路径捆绑，将在`static`模式下生成的报告文件。
        //  相对于捆绑输出目录。
        reportFilename: 'report.html',
        //  模块大小默认显示在报告中。
        //  应该是`stat`，`parsed`或者`gzip`中的一个。
        //  有关更多信息，请参见“定义”一节。
        defaultSizes: 'parsed',
        //  在默认浏览器中自动打开报告
        openAnalyzer: true,
        //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成9
        generateStatsFile: false,
        //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
        //  相对于捆绑输出目录。
        statsFilename: 'stats.json',
        //  stats.toJson（）方法的选项。
        //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
        //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        statsOptions: null,
        logLevel: 'info' // 日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
      })
    )
}
module.exports = config
