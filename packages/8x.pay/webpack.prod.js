const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          query: {
            plugins:[ 'transform-object-rest-spread' ]
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: "file?name=assets/fonts/[name].[ext]"
      },
      {
        test: /\.scss/,
        loaders: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: "file-loader?name=assets/images/[name].[ext]"
      },
      {
        test: /\.mp4$/,
        loader: 'url-loader?limit=10000&mimetype=video/mp4'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new CleanWebpackPlugin('dist', {} ),
    new MiniCssExtractPlugin({
      filename: "style.css",
      chunkFilename: "[name].css"
    })
  ],
  entry: './src/index.js',
  output: {
    filename: "index.js",
    publicPath: "/dist",
    library: '',
    libraryTarget: 'commonjs'
  },
  devServer: {
   historyApiFallback: true,
   contentBase: '.',
 }
};
