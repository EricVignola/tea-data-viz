const path = require('path');

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'production.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};