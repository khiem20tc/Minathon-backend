const webpack = require("webpack");
// webpack.production.config.js
module.exports = {
  mode: "Production",
  performance: {
    hints: "warning",
  },
  output: {
    pathinfo: false,
  },
  optimization: {
    moduleIds: "deterministic",
    chunkIds: "deterministic",
    mangleExports: "deterministic",
    nodeEnv: "Production",
    flagIncludedChunks: true,
    // occurrenceOrder: true,
    concatenateModules: true,
    splitChunks: {
      hidePathInfo: true,
      minSize: 30000,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
    },
    emitOnErrors: false,
    checkWasmTypes: true,
    minimize: true,
  },
  plugins: [
    // new TerserPlugin(/* ... */),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("Production"),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};
