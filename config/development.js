export default {
    webpackDefinePlugin: {
        isProd: false,
        isLocal: true
    },
    middlewares: ['monking-react-render/lib/middleware'],
    devWebpckConfig: require.resolve('../webpack/webpack.dev.config.js'),
    showVConsole: false
};
