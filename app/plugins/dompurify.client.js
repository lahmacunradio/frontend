import DOMPurify from 'isomorphic-dompurify'

export default defineNuxtPlugin((nuxtApp) => {
  function normalize(binding) {
    const value = binding?.value
    if (value && typeof value === 'object' && 'html' in value) {
      return { html: value.html, options: value.options || {} }
    }
    return { html: typeof value === 'string' ? value : '', options: {} }
  }

  nuxtApp.vueApp.directive('dompurify-html', {
    beforeMount(el, binding) {
      const { html, options } = normalize(binding)
      el.innerHTML = DOMPurify.sanitize(html, options)
    },
    updated(el, binding) {
      const { html, options } = normalize(binding)
      el.innerHTML = DOMPurify.sanitize(html, options)
    }
  })
})

