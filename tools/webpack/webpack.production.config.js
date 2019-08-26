const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require("./common");

class CleanUpStatsPlugin {
  shouldPickStatChild(child) {
    return child.name.indexOf("mini-css-extract-plugin") !== 0;
  }

  apply(compiler) {
    compiler.hooks.done.tap("CleanUpStatsPlugin", stats => {
      const children = stats.compilation.children;
      if (Array.isArray(children)) {
        // eslint-disable-next-line no-param-reassign
        stats.compilation.children = children.filter(child =>
          this.shouldPickStatChild(child)
        );
      }
    });
  }
}
module.exports = {
  ...common,
  mode: "production",
  devtool: "eval",
  optimization: {
    minimize: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].bundle.css",
      chunkFilename: "[name].bundle.css"
    }),
    // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/168#issuecomment-420095982
    new CleanUpStatsPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css|.scss|.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true, // default is false
              sourceMap: true,
              importLoaders: 1,
              localIdentName: "[name]--[local]--[hash:base64:8]"
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  }
};
