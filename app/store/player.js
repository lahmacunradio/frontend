export const state = () => ({
  arcsiEpisode: {},
  arcsiHistory: [],
  arcsiVolume: 1,
  arcsiPlayPositions: []
})

export const mutations = {
  currentlyPlayingArcsi (state, episode) {
    state.arcsiEpisode = episode
    state.arcsiHistory.push({
      playDate: Date.now(),
      episodeID: episode.id
    })
  },
  setArcsiVolume (state, volume) {
    state.arcsiVolume = volume
  },
  setArcsiProgress (state, progress) {
    state.arcsiPlayPositions.push({
      episodeID: progress.episode,
      value: progress.value
    })
  }
}
