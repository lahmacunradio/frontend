<template>
  <div>
    <div class="m-4 text-center title">
      <h1>Lahmacun Shows</h1>
    </div>
    <!-- Make a listing component -->
    <vue-instant 
      name="customName"
      placeholder="custom placeholder"
      type="google">
    </vue-instant>
    <ShowsLister :shows="arcsiShowsList" />
    <div class="m-4 text-center title">
      <h1>Past Shows</h1>
    </div>
    <ShowsLister :shows="pastShowsList" />
  </div>
</template>

<script>

import { mediaServerURL } from '~/constants'
import 'vue-instant/dist/vue-instant.css'

export default {
  components: {},

  data() {
    return {
      mediaServerURL
    }
  },
  head() {
    return {
      title: 'Lahmacun Shows'
    }
  },
  computed: {
    arcsiShows() {
      return this.$store.state.arcsiShows
    },
    arcsiShowsList() {
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
    // console.log(this.arcsiShows)
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
