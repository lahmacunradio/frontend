import axios from 'axios'
import { arcsiServerURL } from '~/constants'

export const state = () => ({
  arcsiShows: null

})

export const actions = {
  async nuxtServerInit ({ state }, { req }) {
    const response = await axios.get(arcsiServerURL)
    state.arcsiShows = response.data
  }
}
