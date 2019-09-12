const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve('src', 'index'),
  watch: true,
  output: {
    path: path.resolve('dist'),
    filename: "index.js",
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /.jsx?$/,
      include: [
        path.resolve(__dirname, 'src')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      loader: 'babel-loader'
    },
    {
      test: /\.css$/,
      loader: ['style-loader', 'css-loader']
    }
  ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  resolve: {
    extensions: ['.json', '.js', '.jsx']
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join('/dist/'),
    inline: true,
    host: '0.0.0.0',
    port: 8080,
    historyApiFallback: true
  }
};