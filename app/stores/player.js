import { defineStore } from 'pinia'

const MAX_HISTORY_ENTRIES = 100

function pruneHistory(history) {
  const entries = Object.entries(history)
  if (entries.length <= MAX_HISTORY_ENTRIES) return history

  // Sort by playDate descending, keep most recent 30
  const sorted = entries.sort((a, b) => (b[1].playDate || 0) - (a[1].playDate || 0))
  return Object.fromEntries(sorted.slice(0, MAX_HISTORY_ENTRIES))
}

export const usePlayerStore = defineStore('player', {
  state: () => ({
    isStreamPlaying: false,
    streamShowTitle: '',
    streamEpisodeTitle: '',
    streamEpisodeImageURL: '',
    streamVolume: 55,
    arcsiEpisode: {},
    arcsiVolume: 1,
    arcsiPlayHistory: {},
    isArcsiPlaying: false,
    isArcsiVisible: false,
    showsByDate: []
  }),
  getters: {
    getArcsiEpisode: (state) => state.arcsiEpisode,
    getArcsiPlayHistory: (state) => state.arcsiPlayHistory,
    getArcsiVolume: (state) => state.arcsiVolume,
    getArcsiPlayState: (state) => state.isArcsiPlaying,
    getArcsiVisibility: (state) => state.isArcsiVisible,
    getStreamVolume: (state) => state.streamVolume,
    getStreamPlayState: (state) => state.isStreamPlaying,
    getStreamShowTitle: (state) => state.streamShowTitle,
    getStreamEpisodeTitle: (state) => state.streamEpisodeTitle,
    getStreamEpisodeImageURL: (state) => state.streamEpisodeImageURL,
    getShowsByDate: (state) => state.showsByDate
  },
  actions: {
    setIsStreamPlaying(trigger) {
      this.isStreamPlaying = trigger
    },
    setStreamShowTitle(title) {
      this.streamShowTitle = title
    },
    setStreamEpisodeTitle(title) {
      this.streamEpisodeTitle = title
    },
    setStreamEpisodeImageURL(url) {
      this.streamEpisodeImageURL = url
    },
    setCurrentlyPlayingArcsi(episode) {
      this.arcsiEpisode = episode
    },
    setArcsiVolume(volume) {
      this.arcsiVolume = volume
    },
    setStreamVolume(volume) {
      this.streamVolume = volume
    },
    setArcsiProgressHistory(progress) {
      // Add new entry
      const updated = {
        ...this.arcsiPlayHistory,
        [progress.episodeID]: {
          showID: progress.showID || '',
          showName: progress.showName || '',
          episodeSlug: progress.episodeSlug || '',
          episodeName: progress.episodeName || '',
          playDate: Date.now(),
          playPosition: progress.value
        }
      }

      // Prune to keep only last entries and save to state
      this.arcsiPlayHistory = pruneHistory(updated)
    },
    setIsArcsiPlaying(trigger) {
      this.isArcsiPlaying = trigger
    },
    setIsArcsiVisible(showState) {
      this.isArcsiVisible = showState
    },
    setShowsByDate(shows) {
      this.showsByDate = shows
    }
  }
})
