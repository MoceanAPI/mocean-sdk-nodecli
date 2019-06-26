const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'mocean.js',
        path: path.resolve(__dirname, 'dist')
    },
    target: 'node',
    plugins: [
        new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true})
    ]
};
