import { mediaURL } from '@/constants'

// Internal helper exported for unit tests
export async function fetchWpPageWithImage ($axios, url, $sentry) {
  try {
    const pageRes = await $axios.get(url)
    const page = pageRes?.data || null

    let featuredImage = null
    if (page && page.featured_media && page.featured_media !== 0) {
      try {
        const imgRes = await $axios.get(`${mediaURL}/${page.featured_media}`)
        featuredImage = imgRes?.data || null
      } catch (e) {
        if ($sentry) {
          $sentry.captureException(new Error('WP featured image fetch failed'))
        }
      }
    }

    return { page, featuredImage }
  } catch (e) {
    if ($sentry) {
      $sentry.captureException(new Error('WP page fetch failed'))
    }
    throw e
  }
}

// Fetch a single WordPress page by full REST URL and its featured image (if any)
// Returns useAsyncData result where data.value = { page, featuredImage }
export function useWpPage (url, key) {
  const { $axios, $sentry } = useNuxtApp()
  const cacheKey = key || `wp-page:${url}`
  return useAsyncData(cacheKey, () => fetchWpPageWithImage($axios, url, $sentry))
}
