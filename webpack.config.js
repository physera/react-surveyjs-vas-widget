const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'lib');
const APP_DIR = path.resolve(__dirname, 'src');

const WebpackConfig = {

    entry: APP_DIR + '/index.js',

    output: {
        path: BUILD_DIR,
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'CodeHighlight'
    },

    module: {
        rules: [
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include : APP_DIR,
                options: {
                    presets: [ 'env', 'react', 'es2015', 'stage-2' ]
                }
            },
            { test: /\.css$/, loader: "style-loader!css-loader?modules" },
            { test: /\.svg/, loader: 'svg-url-loader' },
        ],
    },
}



// webpack production config.
if ( process.env.NODE_ENV === 'production' ) {

    WebpackConfig.externals = {
        'react': 'react',
        'react-dom': 'react-dom',
        'highlight.js': 'highlight.js'
    };

    WebpackConfig.plugins = [
        new webpack.optimize.AggressiveMergingPlugin(),
    ];

}


module.exports = WebpackConfig;
