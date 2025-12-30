import { defineStore } from 'pinia'

const PLAY_HISTORY_KEY = 'lahma_arcsi_play_history'
const MAX_HISTORY_ENTRIES = 100

// Helper to safely access localStorage (SSR-safe)
function getStoredPlayHistory() {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(PLAY_HISTORY_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function savePlayHistory(history) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PLAY_HISTORY_KEY, JSON.stringify(history))
  } catch {
    // localStorage full or unavailable - silently fail
  }
}

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
    isArcsiPlaying: false,
    isArcsiVisible: false,
    showsByDate: []
  }),
  getters: {
    getArcsiEpisode: (state) => state.arcsiEpisode,
    getArcsiPlayHistory: () => getStoredPlayHistory(),
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
      // Read current history from localStorage
      const currentHistory = getStoredPlayHistory()

      // Add new entry
      currentHistory[progress.episodeID] = {
        playDate: Date.now(),
        playPosition: progress.value
      }

      // Prune to keep only last 30 entries and save
      const prunedHistory = pruneHistory(currentHistory)
      savePlayHistory(prunedHistory)
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
