const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
	entry: ['babel-polyfill', './src/index.js'],

	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},

	plugins: [
		new webpack.ProgressPlugin(),
		new HtmlWebpackPlugin({
			template: './src/index.html'
		}),
		new CopyWebpackPlugin([
			{
				from: './assets',
				to: '.'
			}
		]),
		gitRevisionPlugin,
		new webpack.DefinePlugin({
			'VERSION': JSON.stringify(gitRevisionPlugin.version()),
			'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
			'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
		})
	],

	module: {
		rules: [
			{
				test: /.(js|jsx)$/,
				include: [path.resolve(__dirname, 'src')],
				loader: 'babel-loader',

				options: {
					plugins: ['syntax-dynamic-import'],

					presets: [
						[
							'@babel/preset-env',
							{
								modules: false
							}
						]
					]
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader"
					}
				]
			},
			{
				test: /\.s?[ac]ss$/i,
				use: ['style-loader', 'css-loader',
					{
						loader: 'sass-loader',
						options: {
							implementation: require('sass'),
							sassOptions: {
								fiber: require('fibers')
							},
						}
					}]
			},
			{
				test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
				loader: 'url-loader',
				options: {
					limit: 8192,
				},
			},
		]
	},


};
