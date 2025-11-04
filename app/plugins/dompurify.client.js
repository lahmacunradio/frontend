import Vue from 'vue'
import DOMPurify from 'isomorphic-dompurify'

Vue.directive('dompurify-html', {
  bind(el, binding) {
    const config = binding.arg || {}
    el.innerHTML = DOMPurify.sanitize(binding.value, config)
  },
  update(el, binding) {
    const config = binding.arg || {}
    el.innerHTML = DOMPurify.sanitize(binding.value, config)
  }
})

