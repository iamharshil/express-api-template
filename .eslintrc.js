module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:prettier/recommended",
		"plugin:node/recommended", // Add Node.js specific rules
	],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	rules: {
		"prettier/prettier": "error",
		"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
		"no-console": ["warn", { allow: ["warn", "error"] }],
		"no-process-exit": "error",
		"node/no-unsupported-features/es-syntax": "off", // If using ES modules
	},
};
