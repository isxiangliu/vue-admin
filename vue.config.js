const fs = require('fs')
const path = require('path')
const spritesmithPlugin = require('webpack-spritesmith')
const terserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const cdnDependencies = require('./dependencies.cdn')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const spritesmithTasks = []
fs.readdirSync('src/assets/sprites').map(dirname => {
    if (fs.statSync(`src/assets/sprites/${dirname}`).isDirectory()) {
        spritesmithTasks.push(
            new spritesmithPlugin({
                src: {
                    cwd: path.resolve(__dirname, `src/assets/sprites/${dirname}`),
                    glob: '*.png'
                },
                target: {
                    image: path.resolve(__dirname, `src/assets/sprites/${dirname}.[hash].png`),
                    css: [
                        [path.resolve(__dirname, `src/assets/sprites/_${dirname}.scss`), {
                            format: 'handlebars_based_template',
                            spritesheetName: dirname
                        }]
                    ]
                },
                customTemplates: {
                    'handlebars_based_template': path.resolve(__dirname, 'scss.template.hbs')
                },
                // 样式文件中调用雪碧图地址写法
                apiOptions: {
                    cssImageRef: `~${dirname}.[hash].png`
                },
                spritesmithOptions: {
                    algorithm: 'binary-tree',
                    padding: 10
                }
            })
        )
    }
})

// CDN 相关
const isCDN = process.env.VUE_APP_CDN == 'ON'
const externals = {}
cdnDependencies.forEach(pkg => {
    externals[pkg.name] = pkg.library
})
const cdn = {
    css: cdnDependencies.map(e => e.css).filter(e => e),
    js: cdnDependencies.map(e => e.js).filter(e => e)
}
// gzip 相关
const isGZIP = process.env.VUE_APP_GZIP == 'ON'

const IP = "http://10.1.128.123:5300"
module.exports = {
    parallel: false, // thread-loader 与worker-loader有冲突。
    lintOnSave:false,
    publicPath: '',
    productionSourceMap: false,
    devServer: {
        open: true,
        // proxy: {
        //     '/webapi': {                 //这里的/webapi表示的意思是以/webapi开头的才生效 ->刷下面的重点
        //         target: 'http://10.1.128.123:5300/',
        //         changeOrigin: true,      //如果接口跨域这里就要这个参数配置
        //         pathRewrite:{
        //             '^/webapi':`${IP}/webapi` //实际请求地址是target/webapi/news/list
        //             // '^/webapi':'/'    //实际请求地址是target/news/list
        //         }
        //     }
        // },
        // 用于 mock-server
        // proxy: {
        //     '/mock': {
        //         target: '/',
        //         changeOrigin: true
        //     },
        //     '/': {
        //         target: process.env.VUE_APP_API_ROOT,
        //         changeOrigin: true
        //     }
        // },
    },
    transpileDependencies: ['element-ui'],
    configureWebpack: config => {
        config.resolve.modules = ['node_modules', 'assets/sprites']
        config.plugins.push(...spritesmithTasks)
        if (isCDN) {
            config.externals = externals
        }
        config.optimization = {
            minimizer: [
                new terserPlugin({
                    terserOptions: {
                        compress: {
                            warnings: false,
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ['console.log']
                        }
                    }
                })
            ]
        }
        if (isGZIP) {
            return {
                plugins: [
                    new CompressionPlugin({
                        algorithm: 'gzip',
                        test: /\.(js|css|gltf|html|vue)$/, // 匹配文件名
                        threshold: 10240, // 对超过10k的数据压缩
                        deleteOriginalAssets: false, // 不删除源文件
                        minRatio: 1 // 压缩比
                    }),
                    new BundleAnalyzerPlugin({
                        analyzerPort: 8889, // 分析页面
                        openAnalyzer: true // 默认打开分析模块页面
                    })
                ]
            }
        }
    },
    pluginOptions: {
        lintStyleOnBuild: true,
        stylelint: {
            fix: true
        },
        mock: {
            entry: './src/mock/server.js',
            debug: true,
            disable: true
        }
    },
    chainWebpack: config => {
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item.use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    resources: [
                        './src/assets/styles/resources/*.scss',
                        './src/assets/sprites/*.scss'
                    ]
                })
                .end()
        })
        config.module
            .rule('svg')
            .exclude.add(path.join(__dirname, 'src/assets/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.join(__dirname, 'src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
        config.plugin('html')
            .tap(args => {
                args[0].title = process.env.VUE_APP_TITLE
                if (isCDN) {
                    args[0].cdn = cdn
                }
                args[0].debugTool = process.env.VUE_APP_DEBUG_TOOL
                return args
            })
    }
}
