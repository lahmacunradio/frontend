// Axios-compat plugin for Nuxt 3 using ofetch/$fetch
// Provides $axios with axios-like methods returning { data, status, headers, ... }
// Also provides $get/$post shortcuts returning only data.

export default defineNuxtPlugin(() => {
  // Only access private runtime config (arcsiToken) on the server.
  // Accessing non-public keys on the client triggers a Nuxt runtime error.
  const runtimeConfig = useRuntimeConfig()
  const isServer = import.meta.server
  // Prefer private token (server-only) and fall back to public exposure if intentionally exposed.
  const publicArcsiToken = runtimeConfig.public?.arcsiToken
  const privateArcsiToken = runtimeConfig.arcsiToken || publicArcsiToken
  if (isServer && !privateArcsiToken) {
    console.warn('[axios] ARCSI token is not configured. Set ARCSI_TOKEN in your .env file to enable authenticated Arcsi requests.')
  }

  const request = async (url, opts = {}) => {
    const headers = Object.assign({}, opts.headers || {})
    // Attach Authentication-Token. If token is public, it's already safe client-side. If private only, we restrict to server.
  // Detect Arcsi requests by domain OR common path fragments (supports relative proxy paths)
  const isArcsiRequest = typeof url === 'string' && /arcsi\.lahmacun\.hu|\/wp-json\/arcsi|\/arcsi\//.test(url)

    if (isArcsiRequest && privateArcsiToken && !headers['Authentication-Token'] && !headers['authentication-token']) {
      const headerName = 'authentication-token' // API expects this exact casing
      // If token is publicly exposed, allow client usage; otherwise restrict to server-side.
      if (publicArcsiToken || isServer) {
        headers[headerName] = privateArcsiToken
      }
    }

    const method = (opts.method || 'GET').toUpperCase()
    const body = opts.body || opts.data // allow axios-like opts.data

    const timeoutMs = typeof opts.timeout === 'number' ? opts.timeout : 15000
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      // Use $fetch.raw to get access to response headers
      const response = await $fetch.raw(url, {
        method,
        headers,
        body,
        signal: controller.signal
      })
      clearTimeout(timer)

      // Extract headers from the Response object
      const responseHeaders = {}
      if (response.headers) {
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value
        })
      }

      return {
        data: response._data,
        status: response.status || 200,
        headers: responseHeaders,
        config: { url, method }
      }
    } catch (error) {
      clearTimeout(timer)
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
