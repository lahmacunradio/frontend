<template>
  <div class="container">
    <AutoCompleteSearch
      :default-items="defaultArcsiShows"
      suggestion-attribute="name"
      :search-fields="searchFields"
      place-holder="Search"
      @update="onUpdate"
    />
    <div class="my-8 title">
      <h1>Lahmacun Shows</h1>
    </div>
    <!-- Make a listing component -->
    <div v-if="arcsiShowsList.length">
      <ShowsLister :shows="arcsiShowsList" />
    </div>
    <div v-else>
      <p class="italic">
        No matching Shows found
      </p>
    </div>
    <div class="my-8 title">
      <h1>Past Shows</h1>
    </div>
    <div v-if="pastShowsList.length">
      <ShowsLister :shows="pastShowsList" />
    </div>
    <div v-else>
      <p class="italic">
        No matching Shows found
      </p>
    </div>
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
