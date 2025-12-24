import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: [
    'components/icon/Sandclock.vue'
  ],
  rules: {
    'vue/first-attribute-linebreak': 'off'
  }
})
