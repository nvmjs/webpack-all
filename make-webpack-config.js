/*
* @Author: dmyang
* @Date:   2015-08-02 14:16:41
* @Last Modified by:   Ian Hu
* @Last Modified time: 2016-08-09 22:06:18
*/

// 'use strict';

const path = require('path')
const fs = require('fs')

const webpack = require('webpack')
const _ = require('lodash')
const glob = require('glob')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
const DefinePlugin = webpack.DefinePlugin

const srcDir = path.resolve(process.cwd(), 'src')
const assets = path.resolve(process.cwd(), 'assets')
const nodeModPath = path.resolve(__dirname, './node_modules')
const pathMap = require('./src/pathmap.json')

let entries = (() => {
    let jsDir = path.resolve(srcDir, 'js')
    let entryFiles = glob.sync(jsDir + '/*.js')
    let map = {}

    entryFiles.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        map[filename] = filePath
    })

    return map
})()
let chunks = Object.keys(entries)

module.exports = (options) => {
    options = options || {}

    let dev = options.dev !== undefined ? options.dev : true
    // 这里publicPath要使用绝对路径，不然scss/css最终生成的css图片引用路径是错误的，应该是scss-loader的bug
    let publicPath = dev ? '/' :'./'
    let extractCSS
    let cssLoader

    // generate entry html files
    // 自动生成入口文件，入口js名必须和入口文件名相同
    // 例如，a页的入口文件是a.html，那么在js目录下必须有一个a.js作为入口文件
    let plugins = (() => {
        let entryHtml = glob.sync(srcDir + '/*.html')
        let r = []

        entryHtml.forEach((filePath) => {
            let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
            let conf = {
                template: 'html!' + filePath,
                filename: filename + '.html'
            }

            if(filename in entries) {
                conf.inject = 'body'
                conf.chunks = ['vender', filename]
            }

            r.push(new HtmlWebpackPlugin(conf))
        })

        return r
    })()

    if(dev) {
        extractCSS = new ExtractTextPlugin('css/[name].css')
        cssLoader = extractCSS.extract('style', ['css'])
        plugins.push(extractCSS, new webpack.HotModuleReplacementPlugin())
    } else {
        extractCSS = new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {
            // 当allChunks指定为false时，css loader必须指定怎么处理
            // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
            // 第一个参数`notExtractLoader`，一般是使用style-loader
            // @see https://github.com/webpack/extract-text-webpack-plugin
            allChunks: false
        })
        cssLoader = extractCSS.extract('style', ['css?minimize'])

        plugins.push(
            extractCSS,
            new UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                },
                mangle: {
                    except: ['$', 'exports', 'require']
                }
            }),
            // use `production` mode
            new DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('production')}}),
            // new AssetsPlugin({
            //     filename: path.resolve(assets, 'source-map.json')
            // }),
            new webpack.optimize.DedupePlugin(),
            new webpack.NoErrorsPlugin()
        )
    }

    let config = {
        entry: Object.assign(entries, {
            // 用到什么公共lib（例如React.js），就把它加进vender去，目的是将公用库单独提取打包
            'vender': ['jquery']
        }),

        output: {
            path: assets,
            filename: dev ? '[name].js' : 'js/[chunkhash:8].[name].min.js',
            chunkFilename: dev ? '[chunkhash:8].chunk.js' : 'js/[chunkhash:8].chunk.min.js',
            hotUpdateChunkFilename: dev ? '[id].js' : 'js/[id].[chunkhash:8].min.js',
            publicPath: publicPath
        },

        resolve: {
            root: [srcDir, nodeModPath],
            alias: pathMap,
            extensions: ['', '.js', '.css', '.tpl', '.png', '.jpg']
        },

        // externals: {
        //     "jquery": "window.$"
        // },

        module: {
            loaders: [
                {
                    test: /\.(svg|jpe?g|png|gif|ico)$/,
                    loaders: [
                        // url-loader更好用，小于10KB的图片会自动转成dataUrl，
                        'url?limit=10000&name=img/[hash:8].[name].[ext]'
                    ]
                },
                { test: /\.css$/, loader: cssLoader},
                {
                    test   : /\.woff|\.woff2|\.svg|\.eot|\.ttf/,
                    loader : 'url?limit=10000'
                },
                {
                    test: /\.tpl$/,
                    loader: "tmod",
                    query: {
                        // 编译输出目录设置
                        output: assets,

                        // 设置输出的运行时路径
                        runtime: "src/js/lib/tmod.js",

                        // 定义模板采用哪种语法，内置可选：
                        // simple: 默认语法，易于读写。可参看语法文档
                        // native: 功能丰富，灵活多变。语法类似微型模板引擎 tmpl
                        syntax: "simple",

                        // 模板文件后缀
                        suffix: '.tpl'
                    } 
                },
                {test: /\.jsx?$/, loader: 'babel?presets[]=es2015'}

            ]
        },

        plugins: [
            // new webpack.DllReferencePlugin({
            //     context: process.cwd(),
            //     manifest: require(path.join(assets, 'dll', 'js', 'reactStuff-manifest.json')),
            //     sourceType: 'var',
            //     // name: 'assets/dll/js/reactStuff.js'
            // }),
            new CommonsChunkPlugin({
                name: 'vender'
            })
        ].concat(plugins),
        
        devServer: {
            content: srcDir,
            //hot: true,
            noInfo: false,
            inline: true,
            port: 8090,
            publicPath: publicPath,
            stats: {
                cached: false,
                colors: true
            },
            proxy: {
                "/api":{
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    pathRewrite: {
                     '^/api' : '/mockjs/2'     // rewrite path
                    },
                    logLevel:'debug'
                }
            }
        }
    }

    return config
}
