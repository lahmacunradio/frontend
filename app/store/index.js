import { arcsiServerURL, newsURL, arcsiItemBaseURL } from '~/constants'

export const state = () => ({
  arcsiShows: null,
  arcsiEpisodes: null,
  newsList: null,
  aboutUs: null
})

export const actions = {
  async nuxtServerInit ({ state }, { req }) {
    const responseArcsi = await this.$axios.get(arcsiServerURL)
    state.arcsiShows = responseArcsi.data
    const responseNews = await this.$axios.get(newsURL)
    state.newsList = responseNews.data
    const responseAllEpisodes = await this.$axios.get(arcsiItemBaseURL + '/all')
    state.arcsiEpisodes = responseAllEpisodes.data
  }
}
