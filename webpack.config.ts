import path from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';
import CopyPlugin from "copy-webpack-plugin";
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ReactRefreshTypeScript from 'react-refresh-typescript';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: './src/index.tsx',
    embed: {
      import: './embed/index.ts',
      filename: './embed.js'
    }
  },
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
        {
          from: "public",
          globOptions: {
            ignore: ["**/*.ts"]
          }
        }
      ],
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    // because ts-loader needs transpileOnly is set to true (see above)
    // use ForkTsCheckerWebpackPlugin for typechecking during development
    isDevelopment && new ForkTsCheckerWebpackPlugin()
  ].filter(Boolean),
}