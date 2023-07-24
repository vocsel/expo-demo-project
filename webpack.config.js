require("dotenv").config();

const fs = require("fs");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
const openBundleAnalyzer = process.env.OPEN_BUNDLE_ANALYZER;

function plugins() {
  let list = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin({
      patterns: [
        // { from: path.resolve(__dirname, "src/assets/icons"), to: path.resolve(__dirname, "__dist__/assets/icons") },
        { from: path.resolve(__dirname, "src/assets/images"), to: path.resolve(__dirname, "__dist__/assets/images") },
        // { from: path.resolve(__dirname, "src/assets/meshes"), to: path.resolve(__dirname, "__dist__") },
      ],
    }),
    new MomentLocalesPlugin({
      localesToKeep: ["es-us", "ru"],
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ];

  if (openBundleAnalyzer) {
    list = [...list, new WebpackBundleAnalyzer()];
  }

  if (mode !== "production") {
    list = [...list, new Dotenv()];
  }

  return list;
}

module.exports = {
  entry: path.resolve(__dirname, "./src/index.tsx"),
  mode,
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    removeAvailableModules: true,
    mergeDuplicateChunks: true,
    concatenateModules: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
          options:
            {
              plugins: [
                [
                  "import",
                  { libraryName: "mui", style: true },
                  "mui",
                ],
              ],
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
        }],
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(ttf)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./",
            },
          },
        ],
      },
    ],
  },
  plugins: plugins(),
  resolve: {
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    alias: {
      src: path.resolve(__dirname, "src"),
      assets: path.resolve(__dirname, "src/assets"),
      containers: path.resolve(__dirname, "src/containers"),
      components: path.resolve(__dirname, "src/components"),
      core: path.resolve(__dirname, "src/core"),
      lib: path.resolve(__dirname, "src/lib"),
      store: path.resolve(__dirname, "src/store"),
      lang: path.resolve(__dirname, "lang"),
    },
  },
  output: {
    path: path.resolve(__dirname, "./__dist__"),
    filename: "bundle.[chunkhash].js",
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./__dist__"),
    hot: true,
    compress: true,
    port: process.env.PORT || 3000,
    historyApiFallback: true,
  },
};
