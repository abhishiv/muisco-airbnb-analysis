const path = require("path");
module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    ...(process.env.BABEL_ENV === "webpack"
      ? []
      : [
          [
            "css-modules-transform",

            {
              append: [],
              camelCase: false,
              devMode: false,
              extensions: [".scss"], // list extensions to process; defaults to .css
              preprocessCss: path.join(__dirname, "tools", "sass.js"),
              generateScopedName: "[name]__[local]", // in case you don't want to use a function
              hashPrefix: "string",
              extractCss: "./dist/assets/css.css"
            }
          ]
        ])
  ]
};
