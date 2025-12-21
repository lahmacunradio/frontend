import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: [
    'components/icon/Sandclock.vue'
  ],
  rules: {
    // Add any custom rules here
  }
})
