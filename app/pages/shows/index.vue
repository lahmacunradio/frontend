<template>
  <div>
    <AutoCompleteSearch
      :defaultItems="defaultArcsiShows"
      suggestionAttribute="name"
      :searchFields="searchFields"
      @update="onUpdate"
      placeHolder="Search"
    />
    <div class="m-8 text-center title">
      <h1>Lahmacun Shows</h1>
    </div>
    <!-- Make a listing component -->
    <ShowsLister :shows="arcsiShowsList" />
    <div class="m-8 text-center title">
      <h1>Past Shows</h1>
    </div>
    <ShowsLister :shows="pastShowsList" />
  </div>
</template>

<script>

import { mediaServerURL } from '~/constants'

export default {
  components: {},

  data () {
    return {
      mediaServerURL,
      defaultArcsiShows: this.$store.state.arcsiShows,
      arcsiShows: this.$store.state.arcsiShows,
      searchFields: ['name', 'description']
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
  },
  methods: {
    onUpdate (result) {
      this.arcsiShows = result
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
