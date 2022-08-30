const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/index.tsx',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
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
    new CopyPlugin({
      patterns: [
        { from: "public" }
      ],
    }),
  ],
}