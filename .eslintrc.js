module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
		"indent": ["error", "tab"],
		"no-mixed-spaces-and-tabs": "off",
		"react/prop-types": "off",
		"react/no-unescaped-entities": "off",
		"react/no-string-refs": "off",
		"no-prototype-builtins": "off",
		"no-unused-vars": ["error", {"argsIgnorePattern": "^_"}]
    },
	"globals": {
        "global": false,
        "require": false,
        "VERSION": false,
        "BRANCH": false,
        "COMMITHASH": false
    }
};