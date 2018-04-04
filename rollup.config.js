import builtins from 'rollup-plugin-node-builtins'
import flow from 'rollup-plugin-flow'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import jsx from 'rollup-plugin-jsx'

export default {
	input: './src/index.js',
	output: {
		file: './dist/index.js',
		name: 'ReactModel',
		format: 'umd'
	},
	plugins: [
		flow(),
		babel(/* { exclude: 'node_modules/**' } */),
		jsx({ factory: 'React.createElement' })
		// uglify()
	]
}
