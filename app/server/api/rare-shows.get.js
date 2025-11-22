export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch('https://cms.lahmacun.hu/wp-json/wp/v2/pages/3721', {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      },
      params: { t: Date.now() }
    })
    return response
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: 'Failed to fetch rare shows'
    })
  }
})
