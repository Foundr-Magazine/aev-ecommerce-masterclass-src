// Change This.
const projectVersion = '8'
const projectEntryFile = 'main.php'

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV;
const path = require('path')
const projectFolder = path.basename( path.dirname(__filename) );
const publicPath = env == 'production' ? `https://foundr.com/${projectFolder}/` :  './';

let config = {

    mode: env == 'production' || env == 'none' ? env : 'development',
    // devtool: "source-map",
    entry: {
        "main": path.resolve(__dirname + `/src/js/index.js`)
    },
    output: {
        path: path.resolve(__dirname + '/dist'),
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[id].bundle_[chunkhash].js',
        publicPath: publicPath
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it uses publicPath in webpackOptions.output
                            publicPath: '../'//path.resolve(`${__dirname}/src/`  ),
                            // hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            // minimize: process.env.NODE_ENV === 'production',
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: 'postcss.config.js'
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jp(e*)g|webp)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './images/'
                    }
                }]
            },
            {
                test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './fonts/'
                    }
                }]
            },
            {
                test: /\.svg$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    outputPath: (url, resourcePath, context) => {
                        const relativePath = path.relative(context, resourcePath);

                        if (/\/images\//.test(relativePath)) {
                            // return target for svg images
                            return `images/${url}`;
                        } else if (/\/fonts\//.test(relativePath)) {
                            // return target for svg fonts
                            return `./fonts/${url}`;
                        }

                        return `./images/${url}`;
                    },
                },
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        minimize: true, //env === 'production'?true:false
                        attrs: ['img:src', ':data-src', 'link:href', 'source:srcset'],
                        interpolate: true
                    }
                }]
            }
        ]
    },
    plugins: [new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: '[id].css'
        }),
        new TerserPlugin(),
        new OptimizeCssAssetsPlugin({
            cssProcessorPluginOptions: {
                preset: ['default', {
                    discardComments: {
                        removeAll: true
                    }
                }]
            }
        }),
        new HtmlWebpackPlugin({ // Also generate a test.html
            filename: `./${projectEntryFile}`,
            template: `projects/${projectFolder}/src/${projectEntryFile}`,
            minify: {
                collapseWhitespace: true //isProd?true:false
            },
            publicPath: './',
            chunks: ['main'],
            inject: false,
            CustomData: {
                version: projectVersion
            }
        })
    ]
}

module.exports = config;