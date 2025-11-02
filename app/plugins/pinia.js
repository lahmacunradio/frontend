import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { setActivePinia } from 'pinia'

Vue.use(PiniaVuePlugin)

export default (context) => {
  const pinia = createPinia()
  // attach to Nuxt context so stores can access during SSR if needed
  // make Pinia active for the current Nuxt context (SSR + client)
  setActivePinia(pinia)
  context.app.pinia = pinia
  context.pinia = pinia
  // also provide to Vue prototype for compatibility
  if (context.app && context.app?.vueApp) {
    // Nuxt 3 style, unlikely here, but safe guard
    context.app.vueApp.use && context.app.vueApp.use(pinia)
  }
}
