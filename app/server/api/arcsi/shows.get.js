export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const arcsiToken = config.arcsiToken || config.public.arcsiToken
  if (!arcsiToken) {
    throw createError({ statusCode: 500, message: 'ARCSI_TOKEN not configured' })
  }

  // Basic in-memory (or filesystem) caching using Nitro storage
  // Avoids fetching and re-allocating large show arrays for every SSR request.
  const storage = useStorage('cache')
  const cacheKey = 'arcsi_shows_v1'
  const ttlMs = 5 * 60 * 1000 // 5 minutes
  const now = Date.now()
  const query = getQuery(event) || {}
  const forceBypass = String(query.force || '').trim() === '1'
  const cached = await storage.getItem(cacheKey)
  if (!forceBypass && cached && cached.expires > now && Array.isArray(cached.data)) {
    return cached.data
  }

  try {
    const response = await $fetch('https://arcsi.lahmacun.hu/arcsi/show/all_without_items', {
      headers: {
        'authentication-token': arcsiToken
      }
    })
    // Persist with expiry
    await storage.setItem(cacheKey, { data: response, expires: now + ttlMs })
    return response
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: 'Failed to fetch shows from Arcsi API'
    })
  }
})
