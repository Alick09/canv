const path = require('path');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        globalObject: 'this',
        library: 'canv',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
};