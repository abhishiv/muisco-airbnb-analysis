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
    sw: "./src/hub/src/entrypoints/sw.ts"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"]
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "..", "..", "build"),
    publicPath: "http://localhost:7080/",
    globalObject: "this"
  }
};
