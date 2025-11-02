import { defineStore } from 'pinia'

export const useArcsiStore = defineStore('arcsi', {
  state: () => ({
    allShows: [],
    rareShows: null,
    customSchedule: null
  }),
  getters: {
    // Return sorted shows array with rare shows injected
    returnArcsiShows: (state) => {
      if (!state.allShows?.length) {
        return []
      }
      return [...state.allShows].sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
    },
    returnRareShows: (state) => state.rareShows,
    returnCustomSchedule: (state) => state.customSchedule
  },
  actions: {
    refreshAllShowsList(shows) {
      this.allShows = shows
    },
    refreshRareShows(shows) {
      this.rareShows = shows
    },
    refreshCustomSchedule(schedule) {
      this.customSchedule = schedule
    }
  }
})
