import { useArcsiStore } from '~/stores/arcsi'

export default defineNuxtRouteMiddleware(async () => {
  const arcsi = useArcsiStore()
  await arcsi.fetchGlobalData(true)
})
