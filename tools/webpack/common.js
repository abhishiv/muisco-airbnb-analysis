const path = require("path");
const webpack = require("webpack");

module.exports = {
  node: {
    fs: "empty",
    net: "empty",
    module: "empty",
    child_process: "empty"
  },
  entry: {
    hub: "./src/hub/src/entrypoints/browser.tsx",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json", ".scss"]
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "..", "..", "build"),
    publicPath: "https://www.grati.local:7080/",
    globalObject: "this",
    pathinfo: false
  }
};
