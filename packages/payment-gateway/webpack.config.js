const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  module: {
    rules: [
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
        test: /\.scss/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: "file?name=assets/fonts/[name].[ext]"
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
  plugins: [
    new CleanWebpackPlugin('dist', {} ),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ],
  devServer: {
   historyApiFallback: true,
   contentBase: './',
 },
};
