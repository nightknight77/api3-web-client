const
    {resolve: resolvePath} = require('path'),
    {existsSync, readFileSync} = require('fs'),
    dotenv = require('dotenv'),
    {DefinePlugin, HotModuleReplacementPlugin} = require('webpack'),
    HtmlPlugin = require('html-webpack-plugin'),
    MiniCSSExtractPlugin = require('mini-css-extract-plugin'),
    ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'),
    NodePolyfillPlugin = require('node-polyfill-webpack-plugin'),
    {mapValues, pick} = require('lodash')

const
    isDev = process.env.NODE_ENV === 'development',
    cwd = resolvePath(__dirname), // eslint-disable-line no-undef
    envFilePath = cwd + '/.env',
    envExampleFilePath = cwd + '/.env.example',
    envExampleContent = readFileSync(envExampleFilePath),
    appEnvVarNames = Object.keys(dotenv.parse(envExampleContent))
    // We will only forward the env vars found in the .env.example file
    // to the application. So it is important to keep .env.example up to date.

if (existsSync(envFilePath))
    Object.assign(process.env, dotenv.parse(readFileSync(envFilePath)))
// Load env files from the .env file (if exists) into process.env

const appEnvVars = pick(process.env, appEnvVarNames)


module.exports = {
    mode: process.env.NODE_ENV,

    entry: {
        main: cwd + '/src/index.js',
    },

    output: {
        path: cwd + '/public',
        publicPath: '/',
        filename: '[name].[fullhash:8].js',
    },

    resolve: {
        modules: [cwd + '/src', 'node_modules'],
    },

    plugins: [
        new DefinePlugin({
            'process.env': mapValues(appEnvVars, JSON.stringify),
        }),

        new HtmlPlugin({
            template: cwd + '/src/index.html',
        }),

        new NodePolyfillPlugin(),

        ...(isDev ? [
            new HotModuleReplacementPlugin(),
            new ReactRefreshWebpackPlugin(),
        ] : [
            new MiniCSSExtractPlugin({
                filename: '[name].[fullhash:8].css',
                chunkFilename: '[id].[fullhash:8].css',
            }),
        ]),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                include: [cwd + '/src'],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            isDev && require('react-refresh/babel'),
                        ]
                            .filter(Boolean),
                    },
                }],
            },

            {
                test: /\.css$/,
                use: [
                    isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,

                    {loader: 'css-loader', options: {
                        modules: {
                            // generate helpful class names:
                            localIdentName: '[local]--[fullhash:base64:10]',
                        },
                    }},
                ],
            },

            {
                test: /\.(png|svg)$/,
                use: [{loader: 'file-loader', options: {
                    name: '[name].[fullhash:8].[ext]',
                }}],
            },
        ],
    },

    devtool: isDev ? 'eval-source-map' : 'source-map',

    devServer: {
        historyApiFallback: true,
        hot: true,
    },
}
