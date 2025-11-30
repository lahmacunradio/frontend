// Deprecated: Unified under useArcsiStore. This stub prevents build errors
// if any leftover imports exist. It performs no fetching.
export const useGlobalDataStore = () => ({
  allShowsList: [],
  rareShows: null,
  customSchedule: null,
  lastFetched: 0,
  returnArcsiShows: [],
  returnRareShows: null,
  returnCustomSchedule: null,
  fetchGlobalData: async () => {},
  refreshAllShowsList: () => {},
  refreshRareShows: () => {},
  refreshCustomSchedule: () => {}
})
