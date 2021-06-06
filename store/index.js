import { arcsiServerURL, newsURL, aboutUsURL } from '~/constants'

export const state = () => ({
  arcsiShows: null,
  newsList: null,
  aboutUs: null
})

export const actions = {
  async nuxtServerInit ({ state }, { req }) {
    const responseArcsi = await this.$axios.get(arcsiServerURL)
    state.arcsiShows = responseArcsi.data
    const responseNews = await this.$axios.get(newsURL)
    state.newsList = responseNews.data
    const responseAboutUs = await this.$axios.get(aboutUsURL)
    state.aboutUs = responseAboutUs.data
  }
}
