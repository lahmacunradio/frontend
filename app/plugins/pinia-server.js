import { useArcsiStore } from '~/stores/arcsi'

export default defineNuxtPlugin(async () => {
  const arcsi = useArcsiStore()
  // If already hydrated on client, skip.
  if (process.client && arcsi.allShows?.length > 0) return
  try {
    await arcsi.fetchGlobalData(true)
  } catch (e) {
    console.error('Error loading arcsi data:', e)
  }
})
