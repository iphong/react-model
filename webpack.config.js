module.exports = {
	entry: './src/demo.js',
	output: {
		filename: './demo/demo.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [/node_modules/],
				use: ['babel-loader?cacheDirectory']
			}
		]
	}
}