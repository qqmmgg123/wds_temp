var path = require('path')
var webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: {
    index: './src/index/main.js',
    chocie: './src/chocie/main.js',
    dev: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/dev-server',
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]/bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['index'],
      filename: 'index/index.html',
      template: './src/index/index.html'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['chocie'],
      filename: 'chocie/index.html',
      template: './src/chocie/index.html'
    }),
    new ExtractTextPlugin('[name]/styles.css')
  ],
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.sass$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        }))
      }, {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({ 
          fallback: 'style-loader', 
          use: 'css-loader'
        }))
      }, {
        test   : /\.woff|\.woff2|\.svg|.eot|\.ttf/,
        loader : 'url-loader?prefix=font/&limit=10000'
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i, 
        loader: "file-loader?name=images/[name].[ext]"
      },
      {
        test: /\.html$/,
        use: "raw-loader" // loaders: ['raw-loader'] is also perfectly acceptable.
      }
    ]
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    proxy: {
      '/api': {    
        target: 'https://107cine.com',  // 接口域名
        changeOrigin: true,  //是否跨域
      }
    }
  },
  resolve: {
    enforceExtension: false,
    extensions: ['.js'],
    alias: {
      '@': path.join(process.cwd(), './src')
    }
  },
}