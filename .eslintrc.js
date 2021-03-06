module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    extends: ['plugin:react/recommended', 'airbnb', 'plugin:prettier/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        React: 'writable',
        JSX: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint', 'react-hooks'],
    rules: {
        indent: 'off',
        radix: 'warn',
        camelcase: 'off',
        'no-console': 'off',
        'no-plusplus': 'off',
        'no-continue': 'off',
        'no-redeclare': 'off',
        'no-unused-vars': 'off',
        'no-multi-assign': 'off',
        'no-await-in-loop': 'off',
        'no-param-reassign': 'off',
        'consistent-return': 'off',
        'spaced-comment': ['error', 'always', { markers: ['/'] }],
        'prefer-destructuring': 'off',
        'no-restricted-syntax': 'off',
        'no-underscore-dangle': 'off',
        'max-classes-per-file': 'off',
        'no-use-before-define': 'off',
        'class-methods-use-this': 'off',

        'import/extensions': 'off',
        'import/no-default-export': 'error',
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': ['error', { optionalDependencies: true }],

        'react/prop-types': 'off',
        'react/button-has-type': 'off',
        'react/no-array-index-key': 'off',
        'react/no-unescaped-entities': 'warn',
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-no-useless-fragment': 'off',
        'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'react/destructuring-assignment': 'off',
        'react/static-property-placement': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'react/function-component-definition': 'off',

        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': ['error'],

        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/label-has-associated-control': [
            'error',
            { required: { some: ['nesting', 'id'] }, controlComponents: ['Textarea'] },
        ],

        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-redeclare': 'error',
        '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    },
    settings: {
        'import/resolver': { node: { extensions: ['.ts', '.js', '.tsx', '.jsx'] } },
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
            },
        },
        {
            files: ['**/*.stories.*'],
            rules: {
                'import/no-anonymous-default-export': 'off',
                'import/no-extraneous-dependencies': 'off',
                'import/no-default-export': 'off',
            },
        },
        {
            files: ['**/*.stories.*'],
            rules: {
                'import/no-anonymous-default-export': 'off',
            },
        },
    ],
}
