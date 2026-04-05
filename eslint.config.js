import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
// 1. Importa el paquete de typescript-eslint
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },

  js.configs.recommended,
  // 2. Carga las configuraciones recomendadas de TS
  ...tseslint.configs.recommended,

  {
    // 3. Extiende los archivos permitidos a TS y TSX
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      // 4. Usa el parser de TypeScript para que entienda tu código
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // 5. Regla para variables no usadas (ignora las que empiezan con _)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto', // Esto evita los errores de Delete ␍ que tenías
        },
      ],
    },
  },
  eslintConfigPrettier // Siempre al final para que mande sobre el resto
);
