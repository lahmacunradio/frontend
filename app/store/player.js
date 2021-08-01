export const state = () => ({
  arcsiEpisode: {},
  arcsiHistory: [],
  arcsiPlayHistory: {},
  arcsiVolume: 1
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
  }
}
