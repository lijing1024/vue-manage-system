const path = require('path')
const resolve = file => path.resolve(__dirname, file)
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')
const runEnv = process.env.VUE_APP_RUN_ENV
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {

    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    outputDir: process.env.OUTPUT_DIR,
    productionSourceMap: runEnv !== 'prod',
    assetsDir: 'static',
    lintOnSave: !isProduction,
    filenameHashing: true,
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            // title: 'Index Page',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        // 当使用只有入口的字符串格式时，
        // 模板会被推导为 `public/subpage.html`
        // 并且如果找不到的话，就回退到 `public/index.html`。
        // 输出文件名会被推导为 `subpage.html`。
        // subpage: 'src/subpage/main.js'
    },
    chainWebpack: config => {
        if (process.env.use_analyzer) {
            config
                .plugin('webpack-bundle-analyzer')
                .use(BundleAnalyzerPlugin)
        }
        // 生产环境去掉console
        // if (isProduction) {
        // config.optimization.minimizer('terser').tap((args) => {
        //     console.log('args------', args[0].terserOptions.compress)
        //     args[0].terserOptions.compress.drop_console = true
        //     return args
        // })
        // }
        config.resolve.alias
            .set('@views', resolve('src/views'))
            .set('@comp', resolve('src/components'))
            .set('@api', resolve('src/api'))

        config.entry('main').add('babel-polyfill')
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 15000, esModule: false }))
    },

    css: {
        sourceMap: runEnv !== 'prod',
        loaderOptions: {
            postcss: {
                plugins: [
                    require('autoprefixer')()
                ]
            }
        }
    },

    devServer: { // 开发服务器
        proxy: { //匹配规则
            '/api': {
                //要访问的跨域的域名
                // target: 'http://123.59.213.33:8083',
                target: 'http://10.203.161.45:8087',     //开发联调
                ws: true,
                secure: false, // 使用的是http协议则设置为false，https协议则设置为true
                changOrigin: true, //开启代理
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [resolve('./src/styles/var.scss'), resolve('./src/styles/common.scss')]
        }
    }
}

