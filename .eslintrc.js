module.exports = {
  ignorePatterns: [
    '*.js',
    'lib/**/*.d.ts'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
    project: 'tsconfig.json',
    tsconfigRootDir: '.',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: [
    'filenames',
    'prettier',
  ],
  rules: {},
};
