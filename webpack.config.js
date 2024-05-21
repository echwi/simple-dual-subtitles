const webpack = require('webpack'),
    path = require('path'),
    CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin,
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    WriteFilePlugin = require('write-file-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    TerserPlugin = require("terser-webpack-plugin");

const options = {
    mode: process.env.NODE_ENV || 'development',
    devtool: 'hidden-nosources-cheap-source-map',
    entry: {
        popup: path.join(__dirname, 'src', 'modules', 'popup', 'entrypoint.ts'),
        background: path.join(__dirname, 'src', 'modules', 'background', 'entrypoint.ts'),
        content: path.join(__dirname, 'src', 'modules', 'content', 'entrypoint.ts'),
        styles: path.join(__dirname, 'src', 'scss', 'base.scss'),
        xhr_intercept: path.join(__dirname, 'src', 'modules', 'shared', 'xhr-intercept', 'xhr-intercept.ts'),
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\/src\/scss\/base\.scss$/,
                use: [
                    // fallback to style-loader in development
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: /node_modules/
            },
            {
                test: /\.twig$/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new CopyWebpackPlugin([{
            from: 'src/manifest.json',
            transform: function (content, path) {
                return Buffer.from(JSON.stringify({
                    description: process.env.npm_package_description,
                    version: process.env.npm_package_version,
                    ...JSON.parse(content.toString())
                }))
            }
        }]),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'modules', 'popup', 'view', 'popup.html'),
            filename: 'popup.html',
            chunks: ['popup']
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'options.html'),
            filename: 'options.html',
            chunks: ['options']
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'background.html'),
            filename: 'background.html',
            chunks: ['background']
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new CopyWebpackPlugin([
            // existing configurations...
            { from: 'src/img/icon16.png', to: 'icon16.png' },
            { from: 'src/img/icon48.png', to: 'icon48.png' },
            { from: 'src/img/icon128.png', to: 'icon128.png' },
            { from: 'LICENSE.md', to: 'LICENSE.md' },
            { from: 'README.md', to: 'README.md' },
        ]),
        new WriteFilePlugin()
    ],
    resolve: {
        extensions: ['.ts' ,'.twig', '.scss', '.js'],
        fallback: {
            fs: require.resolve("browserify-fs"),
            path: require.resolve("path-browserify"),
    },
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            })
        ],
    },
};

module.exports = options;