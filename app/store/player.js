export const state = () => ({
  isStreamPlaying: false,
  arcsiEpisode: {},
  arcsiPlayHistory: {},
  arcsiVolume: 1,
  isArcsiPlaying: false,
  isArcsiVisible: false
})

export const mutations = {
  isStreamPlaying (state, trigger) {
    state.isStreamPlaying = trigger
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
  }

}
