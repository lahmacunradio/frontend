import { VuexPersistence } from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    key: 'LahmaStore',
    storage: window.localStorage,
    reducer: state => ({
    // add here the store objects for local Storage
      player: state.player
    })
  }).plugin(store)
}
