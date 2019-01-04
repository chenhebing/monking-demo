import webpackConfig from 'monking-react-render/lib/webpack/webpack.dev.config';

webpackConfig.module.rules.push({
    test: /\.(less|css)$/,
    include: /node_modules/,
    use: [
        'style-loader',
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

webpackConfig.module.rules.push({
    test: /page[\\/][.-\w]*[\\/]router[\\/]index\.jsx?$/,
    loader: 'react-hot-loader-loader'
});

export default webpackConfig;
