<template>
  <div>
    <div class="m-4 text-center title">
      <h1>Lahmacun Shows</h1>
    </div>
    <!-- Make a listing component -->
    <AutoCompleteSearch
      v-model='arcsiShows'
      suggestionAttribute='name'
    />
    <ShowsLister :shows='arcsiShowsList' />
    <div class="m-4 text-center title">
      <h1>Past Shows</h1>
    </div>
    <ShowsLister :shows="pastShowsList" />
  </div>
</template>

<script>

import { mediaServerURL } from '~/constants'

export default {
  data () {
    return {
      mediaServerURL,
      arcsiShows: this.$store.state.arcsiShows
    }
  },
  head () {
    return {
      title: 'Lahmacun Shows'
    }
  },
  computed: {
    arcsiShowsList () {
      if (this.arcsiShows) {
        return this.arcsiShows.filter(show => (
          !(show.archive_lahmastore_base_url === 'off-air' || !show.active)
        )).sort((a, b) => a.name.localeCompare(b.name))
      }
      return null
    },
    pastShowsList () {
      if (this.arcsiShows) {
        return this.arcsiShows.filter(show => !show.active)
          .sort((a, b) => a.name.localeCompare(b.name))
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
