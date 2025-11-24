import { useArcsiStore } from '~/stores/arcsi'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const arcsi = useArcsiStore()

  // Skip global data fetch for dynamic show pages
  if (to.name === 'shows-slug' || (to.path && to.path.startsWith('/shows/'))) {
    return
  }

  // Only fetch on initial load (SSR or first client render) or hard refresh
  // Skip on client-side route navigation (from is defined during navigation)
  if (!from || !arcsi.allShows?.length) {
    await arcsi.fetchGlobalData(true)
  }
})
