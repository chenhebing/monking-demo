const webpackConfig = require('monking-react-render/lib/webpack/webpack.prod.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

webpackConfig.module.rules.push({
    test: /\.(less|css)$/,
    include: /node_modules/,
    use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
            loader: 'less-loader',
            options: {
                javascriptEnabled: true
            }
        }
    ]
});

webpackConfig.module.rules.push({
    test: /\.jsx?$/,
    loader: 'babel-loader',
    options: {
        presets: ['@babel/preset-env'],
        plugins: [['@babel/plugin-transform-runtime', {
            corejs: false,
            helpers: false,
            regenerator: true,
            useESModules: false
        }]]
    }
});

webpackConfig.optimization.minimizer = [
    new UglifyJsPlugin({
        parallel: true
    }),
    new OptimizeCSSAssetsPlugin()
];

module.exports = webpackConfig;
