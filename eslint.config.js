const kunalnagarcoConfig = require('@kunalnagarco/eslint-config')

module.exports = [
  kunalnagarcoConfig,
  {
    parserOptions: {
      ecmaVersion: 9,
      sourceType: 'module',
      project: './tsconfig.json',
    },
    env: {
      node: true,
      es6: true,
    },
    rules: {
      'import/prefer-default-export': 'off',
      'import/no-cycle': 'off',
      radix: 'off',
    },
    // ignores: ['dist/*', 'lib/*', 'node_modules/', 'jest.config.js'],
  },
]
