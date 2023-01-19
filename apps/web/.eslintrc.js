const config = require('eslint-config-custom/index')

module.exports = {
  ...config,
  root: true,
  extends: ['custom'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
}
