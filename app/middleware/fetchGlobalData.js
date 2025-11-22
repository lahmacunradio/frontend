export default async function ({ store }) {
  // Dispatch the global data fetch on every navigation (client + SSR)
  if (store && store.dispatch) {
    await store.dispatch('fetchGlobalData')
  }
}
