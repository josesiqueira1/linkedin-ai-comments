const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        'content/content': './src/content/content.ts',
        'popup/popup': './src/popup/popup.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devtool: 'inline-source-map',
    optimization: {
        minimize: false // Desabilita minificação para melhor debug
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                sourceMap: true
                            }
                        }
                    }
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "src/manifest.json",
                    to: "manifest.json"
                },
                {
                    from: "src/popup",
                    to: "popup",
                    globOptions: {
                        ignore: ["**/*.ts"],
                    },
                },
                {
                    from: "src/icon.png",
                    to: "icon.png"
                },
                {
                    from: "src/models",
                    to: "models"
                },
                {
                    from: "src/services",
                    to: "services"
                }
            ],
        }),
    ],
}; 