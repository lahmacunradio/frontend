<template>
  <div>
    <div class="m-4 text-center title">
      <h1>Lahmacun Shows</h1>
    </div>
    <!-- Make a listing component -->
    <SearchInput
      :suggestions='suggestions'
      :suggestionAttribute='suggestionAttribute'
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
import SearchInput from '~/components/SearchInput'

export default {
  components: { SearchInput },

  data () {
    return {
      mediaServerURL,
      value: '',
      suggestions: [{ id: '1', name: 'name1' }, { id: '2', name: 'name2' }],
      suggestionAttribute: 'name'
    }
  },
  head () {
    return {
      title: 'Lahmacun Shows'
    }
  },
  computed: {
    arcsiShows () {
      return this.$store.state.arcsiShows
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
    },
    // changed () {
    //   this.suggestions = this.arcsiShows.filter(show => show.name.toLowerCase().includes(this.value.toLowerCase()))
    // }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
