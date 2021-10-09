<template>
  <div class="container">
    <h1>Arcsives</h1>
    <article class="grid gap-4 py-8 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="(episode, i) in arcsiEpisodesListSortedLatest" :key="episode + i">
        <ArcsiEpisodeBlock :episode="episode" :arcsilist="arcsiList" />
      </div>
    </article>
    <div id="loadmore" class="p-4 text-center">
      <a href="#" class="font-bold" @click.prevent="loadMoreEpisodes">
        Load previous
      </a>
    </div>
  </div>
</template>

<script>
import { arcsiItemBaseURL } from '~/constants'

export default {
  data () {
    return {
      startIndex: 0,
      preloadImages: false,
      numberOfEpisodes: 12,
      startNumberofEpisodes: 12,
      arcsiEpisodes: null
    }
  },
  async fetch () {
    this.arcsiEpisodes = await fetch(arcsiItemBaseURL + '/all')
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  },
  computed: {
    getToday () {
      const d = new Date()
      const year = d.getFullYear()
      const month = (d.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
      const day = d.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })
      return `${year}-${month}-${day}`
    },
    arcsiEpisodesListSortedLatest () {
      if (this.arcsiEpisodes) {
        const showslist = [...this.arcsiEpisodes]
        return showslist
          .filter(item => item.play_date < this.getToday)
          .filter(item => item.archived === true)
          .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
          .slice(this.startIndex, this.numberOfEpisodes)
      }
      return null
    },
    arcsiList () {
      return [...this.$store.state.arcsiShows]
    }
  },
  methods: {
    loadMoreEpisodes () {
      this.numberOfEpisodes = this.numberOfEpisodes + this.startNumberofEpisodes
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
