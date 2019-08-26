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
              "webpack-dev-server/client?https://www.grati.local:8080",
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
    publicPath: "https://www.grati.local:7080",
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
