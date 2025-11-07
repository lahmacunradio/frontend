// Axios-compat plugin for Nuxt 3 using ofetch/$fetch
// Provides $axios with axios-like methods returning { data, status, headers, ... }
// Also provides $get/$post shortcuts returning only data.

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  const request = async (url, opts = {}) => {
    const headers = Object.assign({}, opts.headers || {})
    // Attach Authentication-Token from runtimeConfig if present
    if (runtimeConfig.arcsiToken && !headers['Authentication-Token']) {
      headers['Authentication-Token'] = runtimeConfig.arcsiToken
    }

    const method = (opts.method || 'GET').toUpperCase()
    const body = opts.body || opts.data // allow axios-like opts.data

    try {
      const data = await $fetch(url, {
        method,
        headers,
        body
      })
      return { data, status: 200, headers: {}, config: { url, method } }
    } catch (error) {
      // Normalize error to axios-like shape
      const e = error || {}
      const response = {
        data: e?.data,
        status: e?.status || e?.response?.status,
        headers: e?.headers || e?.response?.headers,
        config: { url, method }
      }
      const err = new Error(e?.message || 'Request failed')
      err.response = response
      throw err
    }
  }

  const axios = {
    get: (url, opts = {}) => request(url, { ...opts, method: 'GET' }),
    delete: (url, opts = {}) => request(url, { ...opts, method: 'DELETE' }),
    post: (url, data, opts = {}) => request(url, { ...opts, method: 'POST', data }),
    put: (url, data, opts = {}) => request(url, { ...opts, method: 'PUT', data }),
    patch: (url, data, opts = {}) => request(url, { ...opts, method: 'PATCH', data }),
    $get: async (url, opts = {}) => (await request(url, { ...opts, method: 'GET' })).data,
    $delete: async (url, opts = {}) => (await request(url, { ...opts, method: 'DELETE' })).data,
    $post: async (url, data, opts = {}) => (await request(url, { ...opts, method: 'POST', data })).data,
    $put: async (url, data, opts = {}) => (await request(url, { ...opts, method: 'PUT', data })).data,
    $patch: async (url, data, opts = {}) => (await request(url, { ...opts, method: 'PATCH', data })).data
  }

  // Let Nuxt handle injection and globalProperties mapping.
  // Access via useNuxtApp().$axios or this.$axios in Options API.
  return { provide: { axios } }
})
