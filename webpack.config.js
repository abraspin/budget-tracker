const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: "./public/index.js",
  output: {
    //path.resolve? FIXME:TODO:
    path: __dirname + "public/dist",
    filename: "bundle.js",
  },
  mode: "development",

  // configure webpack to use babel-loader to bundle our separate modules and transpile the code
  // refer to https://github.com/babel/babel-loader for more information on the settings
  module: {
    rules: [
      {
        test: /\.js$/, // files must end in ".js" to be transpiled
        exclude: /node_modules/, // don't transpile code from "node_modules"
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },

  // webpack plug ins - webmanifest generator
  plugins: [
    new WebpackPwaManifest({
      publicPath: "/dist/",
      filename: "manifest.webmanifest",
      inject: false,
      fingerprints: false,
      name: "Online/Offline Progressive Budget Tracker App",
      short_name: "Budget Tracker PWA",
      description:
        "An application that allows you to enter deposits and withdrawals with offline functionality, and updating-upon-reconnection for offline activity.",
      background_color: "#01579b",
      theme_color: "#ffffff",
      "theme-color": "#ffffff",
      start_url: "/",
      display: "standalone",
      icons: [
        {
          src: path.resolve(__dirname, "public/icons/icon-512x512.png"),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join("assets", "icons"),
        },
      ],
    }),
  ],
};

module.exports = config;
