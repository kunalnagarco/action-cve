import configPkg from '@kunalnagarco/eslint-config'
import tseslint from 'typescript-eslint'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'

const config = configPkg.default ?? configPkg

export default tseslint.config(
  { ignores: ['dist/**', 'lib/**', 'node_modules/**'] },
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    settings: {
      jest: { version: 29 },
      'import-x': {
        resolver: createTypeScriptImportResolver(),
      },
    },
    rules: {
      'import-x/prefer-default-export': 'off',
      'import-x/no-cycle': 'off',
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: ['tests/**/*.test.ts', 'vitest.config.ts'] },
      ],
    },
  },
  {
    files: ['tests/**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
)
