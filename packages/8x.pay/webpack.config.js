const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const combineLoaders = require('webpack-combine-loaders');

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
          "style-loader?" + JSON.stringify({
          }),
          "css-loader?" + JSON.stringify({
            localIdentName: '[path][name]__[local]--[hash:base64:5]'
          }),
          "sass-loader?" + JSON.stringify({
            localIdentName: '[path][name]__[local]--[hash:base64:5]'
          }),
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
    new HtmlWebPackPlugin({
      template: './examples/src/index.html',
      filename: 'index.html'
    })
  ],
  entry: './examples/src/index.js',
  devServer: {
   historyApiFallback: true,
   contentBase: '.',
 }
};
