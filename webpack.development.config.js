const webpack = require("webpack");

module.exports = {
  mode: "staging",
  devtool: "eval",
  cache: true,
  performance: {
    hints: false,
  },
  optimization: {
    // moduleIds: "ebs-dashboard",
    // chunkIds: "ebs-dashboard",
    mangleExports: false,
    nodeEnv: "staging",
    flagIncludedChunks: false,
    // occurrenceOrder: false,
    concatenateModules: false,
    splitChunks: {
      hidePathInfo: false,
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
    },
    emitOnErrors: true,
    checkWasmTypes: false,
    minimize: false,
    removeAvailableModules: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("Staging"),
    }),
  ],
};
