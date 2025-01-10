// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: true,
  },
  dirs: {
    src: ['./playground'],
  },
}).append({
  rules: {
    '@stylistic/operator-linebreak': 'off',
    '@stylistic/brace-style': 'off',
    '@stylistic/comma-dangle': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'unicorn/number-literal-case': 'off',
    '@stylistic/indent': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-indent': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'nuxt/nuxt-config-keys-order': 'off',
    '@stylistic/arrow-parens': 'off',
  },
})
