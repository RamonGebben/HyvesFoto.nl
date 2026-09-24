import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

const eslintConfig = defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'storybook-static/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
  ]),

  ...nextVitals,
  ...nextTs,

  {
    plugins: { import: importPlugin },
    rules: {
      // Functions and plain data only — no classes, no inheritance, no `this`.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ClassDeclaration',
          message:
            'Classes are not used in this codebase. Export a function from src/utils/<name>/ instead.',
        },
        {
          selector: 'ClassExpression',
          message:
            'Classes are not used in this codebase. Export a function from src/utils/<name>/ instead.',
        },
      ],

      // `~/*` beats climbing out of a folder.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../**'],
              message: "Use the '~/*' alias instead of a deep relative path.",
            },
          ],
        },
      ],

      'import/no-default-export': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [{ pattern: '~/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  {
    // Files where a framework convention demands a default export.
    files: [
      'src/app/**/{page,layout,template,loading,error,not-found,route,default,global-error}.{ts,tsx}',
      'src/app/**/{opengraph,twitter}-image.tsx',
      'src/**/*.stories.tsx',
      '*.config.{ts,mts,cts,mjs,js}',
      '.storybook/**',
    ],
    rules: { 'import/no-default-export': 'off' },
  },

  // Must stay last: turns off everything Prettier already handles.
  prettier,
]);

export default eslintConfig;
