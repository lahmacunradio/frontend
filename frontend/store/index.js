import axios from 'axios'
import { arcsiServerURL, newsURL, contentApiURL, aboutUsURL } from '~/constants'

export const state = () => ({
  arcsiShows: null,
  newsList: null,
  aboutUs: null
})

export const actions = {
  async nuxtServerInit ({ state }, { req }) {
    const responseArcsi = await axios.get(arcsiServerURL)
    state.arcsiShows = responseArcsi.data
    const responseNews = await axios.get(newsURL)
    state.newsList = responseNews.data
    const responseAboutUs = await axios.get(aboutUsURL)
    state.aboutUs = responseAboutUs.data
  }
}
