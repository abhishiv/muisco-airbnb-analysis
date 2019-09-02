module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    [
      "css-modules-transform",
      {
        camelCase: false,
        devMode: false,
        preprocessCss: "./tools/sass.js",
        extensions: [".css", ".scss", ".less"],
        generateScopedName: "[name]--[local]--[hash:base64:8]",
        extractCss: "./dist/stylesheets/combined.css"
      }
    ]
  ]
};
