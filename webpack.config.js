const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/index.tsx',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: () => ({
                before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
              }),
              // ts-loader won't work with HMR unless transpileOnly is set to true
              transpileOnly: isDevelopment,
            }          
          }
        ],
        exclude: /node_modules/,
        // outputPath: "static/js/"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        // outputPath: "static/css/"
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    // todo: add hash
    // see https://create-react-app.dev/docs/production-build/#static-file-caching
    filename: 'main.js',
    // todo: split css bundle
    path: path.resolve(__dirname, 'build'),
  },
  // mode: 'development',
  target: 'web',  
  devServer: {
    // port: '3000',
    static: {       
      directory: path.resolve(__dirname, './build'),
    },
    hot: true,
  },
  plugins: [
    new ESLintPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "public" }
      ],
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    // because ts-loader needs transpileOnly is set to true (see above)
    // use ForkTsCheckerWebpackPlugin for typechecking during development
    isDevelopment && new ForkTsCheckerWebpackPlugin()
  ].filter(Boolean),
}