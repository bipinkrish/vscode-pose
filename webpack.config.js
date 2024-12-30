const path = require("path");

module.exports = {
  entry: "./src/webview/index.tsx",
  experiments: {
    topLevelAwait: true,
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, "out"),
    filename: "webview.js",
    libraryTarget: "module",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
