<template>
  <div>
    <AutoCompleteSearch
      :defaultItems="defaultArcsiShows"
      suggestionAttribute="name"
      :searchFields="searchFields"
      @update="onUpdate"
      placeHolder="Search"
    />
    <div v-if="arcsiShowsList.length  > 0" >
      <h1 class="m-4 text-center title">Lahmacun Shows</h1>
      <ShowsLister :shows='arcsiShowsList' />
    </div>
    <div v-if="pastShowsList.length > 0">
      <h1 class="m-4 text-center title">Past Shows</h1>
      <ShowsLister :shows="pastShowsList" />
    </div>
  </div>
</template>

<script>

import { mediaServerURL } from '~/constants'

export default {
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
