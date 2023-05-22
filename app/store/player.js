export const state = () => ({
  isStreamPlaying: false,
  streamShowTitle: "",
  streamEpisodeTitle: "",
  streamEpisodeImageURL: "",
  streamVolume: 55,
  arcsiEpisode: {},
  arcsiPlayHistory: {},
  arcsiVolume: 1,
  isArcsiPlaying: false,
  isArcsiVisible: false,
  showsByDate: []
})

export const mutations = {
  isStreamPlaying (state, trigger) {
    state.isStreamPlaying = trigger
  },
  setStreamShowTitle (state, title) {
    state.streamShowTitle = title
  },
  setStreamEpisodeTitle (state, title) {
    state.streamEpisodeTitle = title
  },
  setStreamEpisodeImageURL (state, url) {
    state.streamEpisodeImageURL = url
  },
  currentlyPlayingArcsi (state, episode) {
    state.arcsiEpisode = episode
  },
  setArcsiVolume (state, volume) {
    state.arcsiVolume = volume
  },
  setStreamVolume (state, volume) {
    state.streamVolume = volume
  },
  setArcsiProgressHistory (state, progress) {
    const newData = {
      [progress.episodeID]: {
        playDate: Date.now(),
        playPosition: progress.value
      }
    }
    Object.assign(state.arcsiPlayHistory, newData)
  },
  isArcsiPlaying (state, trigger) {
    state.isArcsiPlaying = trigger
  },
  isArcsiVisible (state, showState) {
    state.isArcsiVisible = showState
  },
  setShowsByDate (state, shows) {
    state.showsByDate = shows
  }

}

export const getters = {
  getArcsiEpisode (state) {
    return state.arcsiEpisode
  },
  getArcsiPlayHistory (state) {
    return state.arcsiPlayHistory
  },
  getArcsiVolume (state) {
    return state.arcsiVolume
  },
  getArcsiPlayState (state) {
    return state.isArcsiPlaying
  },
  getArcsiVisibility (state) {
    return state.isArcsiVisible
  },
  getStreamVolume (state) {
    return state.streamVolume
  },
  getStreamPlayState (state) {
    return state.isStreamPlaying
  },
  getStreamShowTitle (state) {
    return state.streamShowTitle
  },
  getStreamEpisodeTitle (state) {  
    return state.streamEpisodeTitle
  },
  getStreamEpisodeImageURL (state) {
    return state.streamEpisodeImageURL
  },
  getShowsByDate (state) {
    return state.showsByDate
  }
}
