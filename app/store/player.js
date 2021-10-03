export const state = () => ({
  arcsiEpisode: {},
  arcsiPlayHistory: {},
  arcsiVolume: 1,
  streamVolume: 0.55
})

export const mutations = {
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
  }
}
