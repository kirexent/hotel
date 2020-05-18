const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require('fs');

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
            inject: true,
        })
    })
}

const htmlPlugins = generateHtmlPlugins('./src/html/views')

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        'js/bundle': './src/js/index.js',
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/bundle.css',
        }),
        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     template: './src/html/views/index.html',
        //     inject: true
        // }),
        // new HtmlWebpackPlugin({
        //     filename: 'onpug.html',
        //     template: './src/pug/pages/onpug.pug',
        //     inject: true
        // }),
    ].concat(htmlPlugins),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["env"]
                    }
                }
            },
            // {
            //     test: /\.pug$/,
            //     loader: 'pug-loader?pretty=true'
            // },
            {
                test: /\.html$/,
                include: path.resolve(__dirname, './src/html/includes'),
                use: ['html-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            }
        ],
    },
};