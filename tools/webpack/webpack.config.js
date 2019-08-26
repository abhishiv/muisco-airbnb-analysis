const common = require("./common");

module.exports = {
  ...common,
  entry: Object.keys(common.entry).reduce(function(state, key) {
    return {
      ...state,
      [key]: [
        ...(key.match(/sw$/)
          ? []
          : [
              "webpack-dev-server/client?http://localhost:7080",
              "webpack/hot/only-dev-server"
            ]),
        common.entry[key]
      ]
    };
  }, {}),
  mode: "development",
  devtool: "eval",
  plugins: [],
  devServer: {
    disableHostCheck: true,
    contentBase: "./dist",
    publicPath: "http://localhost:7080",
    headers: { "Access-Control-Allow-Origin": "*" }
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css|.scss|.sass$/,
        use: [
          {
            loader: "style-loader"
          },
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
