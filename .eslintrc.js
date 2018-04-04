module.exports = {
	parser: 'babel-eslint',
	env: {
		browser: true,
		es6: true,
		node: true
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2018,
	},
	extends: ['react', 'plugin:flowtype/recommended', 'prettier'],
	plugins: ['react', 'flowtype', 'prettier'],
	rules: {
		'prettier/prettier': [
			1,
			{ singleQuote: true, tabWidth: 4, useTabs: true, semi: false, printWidth: 120 }
		],
		'camelcase': 0,
		'react/sort-comp': 0,
		'no-unused-expressions': 1,
		'react/jsx-no-undef': 1
	},
	settings: {
		"flowtype": {
			"onlyFilesWithFlowAnnotation": true
		}
	}
}
