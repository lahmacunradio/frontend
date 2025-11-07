import { useArcsiStore } from '~/stores/arcsi'
import { arcsiShowsBaseURL, rareShowsURL, customScheduleURL, config } from '~/constants'

export default defineNuxtPlugin(async (nuxtApp) => {
  const arcsi = useArcsiStore()

  // Avoid refetching on client if already populated
  if (process.client && arcsi.allShows?.length > 0) return

  try {
    const [allShows, rareShows, customSchedule] = await Promise.all([
      nuxtApp.$axios.get(arcsiShowsBaseURL + '/all_without_items', config).then(res => res.data),
      nuxtApp.$axios.get(rareShowsURL).then(res => res.data?.acf),
      nuxtApp.$axios.get(customScheduleURL).then(res => res.data?.acf)
    ])
    arcsi.refreshAllShowsList(allShows)
    arcsi.refreshRareShows(rareShows)
    arcsi.refreshCustomSchedule(customSchedule)
  } catch (e) {
    console.error('Error loading arcsi data:', e)
  }
})
