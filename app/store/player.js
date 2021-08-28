export const state = () => ({
  arcsiEpisode: {},
  arcsiPlayHistory: {},
  arcsiVolume: 1,
  isArcsiPlaying: {}
})

export const mutations = {
  currentlyPlayingArcsi (state, episode) {
    state.arcsiEpisode = episode
  },
  setArcsiVolume (state, volume) {
    state.arcsiVolume = volume
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
  }
}
