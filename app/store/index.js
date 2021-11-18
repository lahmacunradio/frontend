import { arcsiServerURL, newsURL } from '~/constants'

export const state = () => ({
  arcsiShows: {},
  newsList: {},
  arcsiEpisodes: null,
  aboutUs: null
})

export const actions = {
  async nuxtServerInit ({ state }, { req, error }) {
    await this.$axios.get(arcsiServerURL)
      .then((res) => {
        state.arcsiShows = res.data
      })
      .catch((e) => {
        error({ statusCode: 500, message: 'Post not found' })
      })
    await this.$axios.get(newsURL)
      .then((res) => {
        state.newsList = res.data
      })
      .catch((e) => {
        error({ statusCode: 500, message: 'Post not found' })
      })
  }
}
