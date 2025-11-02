import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    isStreamPlaying: false,
    streamShowTitle: '',
    streamEpisodeTitle: '',
    streamEpisodeImageURL: '',
    streamVolume: 55,
    arcsiEpisode: {},
    arcsiPlayHistory: {},
    arcsiVolume: 1,
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
      const newData = {
        [progress.episodeID]: {
          playDate: Date.now(),
          playPosition: progress.value
        }
      }
      this.arcsiPlayHistory = Object.assign({}, this.arcsiPlayHistory, newData)
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
