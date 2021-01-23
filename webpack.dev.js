const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',

	devServer: {
		contentBase: __dirname + "/dist/",
		open: true,
		inline: true
	},
	
	devtool: "eval-source-map"
});
