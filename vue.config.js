const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const config = require("./build/config.js");

// You can change the port by the following method:
// port = 9999 npm run dev OR npm run dev --port = 9999
const port = process.env.port;

module.exports = {
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: require("./aliases.config").webpack
    },
    plugins: [
      /* new CopyWebpackPlugin({
        patterns: [{
            from: path.resolve(__dirname, "src", "www")
          }]
      })*/
    ]
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true
  },
  publicPath:
    process.env.NODE_ENV === "production"
      ? "https://www.static-src.com/frontend/search-ui/"
      : "/",
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {...config.staging.proxyTable}
    //proxy: (typeof config.static.proxyTable != 'undefined') ? {...config.staging.proxyTable} : null
  }
};
