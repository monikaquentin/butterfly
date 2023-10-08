module.exports = {
  env: {
    node: true,
    browser: false,
    commonjs: true,
    es2021: true
  },
  extends: ['plugin:@typescript-eslint/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false
    }
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-var-requires': 0,
    'handle-callback-err': 2,
    'no-debugger': 2,
    'no-fallthrough': 2,
    'eol-last': 1,
    'no-irregular-whitespace': 1,
    'no-mixed-spaces-and-tabs': [1, 'smart-tabs'],
    'no-trailing-spaces': 1,
    'no-new-require': 2,
    'no-undef': 2,
    'no-unreachable': 2,
    'no-unused-vars': [
      0,
      {
        vars: 'all',
        args: 'none'
      }
    ],
    'no-console': 1,
    'new-cap': 0,
    'max-len': [2, 300, 4],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'ignore',
        named: 'never',
        asyncArrow: 'ignore'
      }
    ]
  }
}
