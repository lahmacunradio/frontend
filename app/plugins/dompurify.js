import DOMPurify from 'isomorphic-dompurify'

// v-dompurify-html directive for Vue 3 with SSR support.
// Usage:
//   <div v-dompurify-html="{ html, options }" />
//   - html: string to sanitize
//   - options: DOMPurify config (optional)
export default defineNuxtPlugin((nuxtApp) => {
  // Only register this SSR version on the server.
  if (!process.server) return
  function normalize(binding) {
    // Expected shape: { html: string, options?: object }
    const value = binding?.value
    if (value && typeof value === 'object' && 'html' in value) {
      return { html: value.html, options: value.options || {} }
    }
    // Fallback legacy: treat binding.value as html string
    return { html: typeof value === 'string' ? value : '', options: {} }
  }

  const directive = {
    // SSR hook: return attributes to merge into SSR-rendered HTML
    getSSRProps(binding) {
      const { html, options } = normalize(binding)
      if (typeof html === 'string' && html.length) {
        return { innerHTML: DOMPurify.sanitize(html, options) }
      }
      return {}
    },
    beforeMount(el, binding) {
      const { html, options } = normalize(binding)
      if (typeof html === 'string') {
        el.innerHTML = DOMPurify.sanitize(html, options)
      }
    },
    updated(el, binding) {
      const { html, options } = normalize(binding)
      if (typeof html === 'string') {
        el.innerHTML = DOMPurify.sanitize(html, options)
      }
    }
  }

  nuxtApp.vueApp.directive('dompurify-html', directive)
})
