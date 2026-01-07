export default defineEventHandler(async (event) => {
  const storage = useStorage('cache')
  const cacheKey = 'rare_shows_v2' // bumped version to invalidate old full-response cache
  const ttlMs = 10 * 60 * 1000 // 10 minutes
  const now = Date.now()
  const query = getQuery(event) || {}
  const forceBypass = String(query.force || '').trim() === '1'
  const cached = await storage.getItem(cacheKey)
  if (!forceBypass && cached && cached.expires > now) {
    return cached.data
  }
  try {
    const response = await $fetch('https://cms.lahmacun.hu/wp-json/wp/v2/pages/3721')
    // Only cache and return the acf field to reduce memory footprint
    const acfOnly = { acf: response.acf }
    await storage.setItem(cacheKey, { data: acfOnly, expires: now + ttlMs })
    return acfOnly
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: 'Failed to fetch rare shows'
    })
  }
})
