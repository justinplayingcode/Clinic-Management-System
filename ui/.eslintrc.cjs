module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off',
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain":"off",
    "@typescript-eslint/no-empty-interface": "off",
    "react/jsx-key": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-unsafe-optional-chaining": "off",
    "no-const-assign": "off",
    "@typescript-eslint/no-var-requires": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "no-constant-condition": "off",
    "react-hooks/exhaustive-deps": "off",
    "no-extra-boolean-cast": "off",
    "no-extra-semi": "off"
  },
}
