import { useArcsiStore } from '~/stores/arcsi'
import { arcsiShowsBaseURL, rareShowsURL, customScheduleURL, config } from '~/constants'

export default async ({ $axios, isServer }) => {
  const arcsi = useArcsiStore()

  // Skip if data is already loaded (to avoid refetching on client-side navigation)
  if (!isServer && arcsi.allShows?.length > 0) {
    return
  }

  try {
    const [allShows, rareShows, customSchedule] = await Promise.all([
      $axios.get(arcsiShowsBaseURL + '/all_without_items', config).then(res => res.data),
      $axios.get(rareShowsURL).then(res => res.data?.acf),
      $axios.get(customScheduleURL).then(res => res.data?.acf)
    ])
    arcsi.refreshAllShowsList(allShows)
    arcsi.refreshRareShows(rareShows)
    arcsi.refreshCustomSchedule(customSchedule)
  } catch (e) {
    // Optionally log error
    console.error('Error loading arcsi data:', e)
  }
}
