module.exports = {
	entry: './src/demo.js',
	output: {
		filename: './dist/demo.js'
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