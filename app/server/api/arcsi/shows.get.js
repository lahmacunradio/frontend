export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const arcsiToken = config.arcsiToken || config.public.arcsiToken
  
  if (!arcsiToken) {
    throw createError({
      statusCode: 500,
      message: 'ARCSI_TOKEN not configured'
    })
  }
  
  try {
    const response = await $fetch('https://arcsi.lahmacun.hu/arcsi/show/all_without_items', {
      headers: {
        'authentication-token': arcsiToken,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      },
      params: { t: Date.now() }
    })
    return response
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: 'Failed to fetch shows from Arcsi API'
    })
  }
})
