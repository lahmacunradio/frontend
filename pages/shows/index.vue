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
      value: ''
    }
  },
  head () {
    return {
      title: 'Lahmacun Shows'
    }
  },
  computed: {
    arcsiShows: {
      get () {
        return this.$store.state.arcsiShows
      },
      set (newValue) {
        this.arcsiShows = [newValue]
      }
    },
    arcsiShowsList () {
      if (this.arcsiShows) {
        const arcsiShowsList = [...this.arcsiShows]
        return arcsiShowsList.filter((show) => {
          return !(show.archive_lahmastore_base_url === 'off-air' || !show.active)
        }).sort((a, b) => a.name.localeCompare(b.name))
      }
      return null
    },
    pastShowsList () {
      if (this.arcsiShows) {
        const arcsiShowsList = [...this.arcsiShows]
        return arcsiShowsList.filter((show) => {
          return !show.active
        }).sort((a, b) => a.name.localeCompare(b.name))
      }
      return null
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
