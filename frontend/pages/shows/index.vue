<template>
  <div>
    <div class="m-4 text-center title">
      <h1>Lahmacun Shows</h1>
    </div>
    <!-- Make a listing component -->
    <ShowsLister :shows="arcsiShowsList" />
    <div class="m-4 text-center title">
      <h1>Past Shows</h1>
    </div>
    <ShowsLister :shows="pastShowsList" />
  </div>
</template>

<script>

import { mediaServerURL } from '~/constants'

export default {
  components: {
  },

  data () {
    return {

      mediaServerURL

    }
  },

  computed: {
    arcsishows () {
      return this.$store.state.arcsiShows
    },
    arcsiShowsList () {
      if (this.arcsishows) {
        const arcsiShowsList = [...this.arcsishows]
        return arcsiShowsList.filter((show) => {
          if (show.archive_lahmastore_base_url === 'off-air' || !show.active) { return false }
          return true
        }).sort((a, b) => a.name.localeCompare(b.name))
      }
      return null
    },
    pastShowsList () {
      if (this.arcsishows) {
        const arcsiShowsList = [...this.arcsishows]
        return arcsiShowsList.filter((show) => {
          if (!show.active) { return true }
          return false
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
