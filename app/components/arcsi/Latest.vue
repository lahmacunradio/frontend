<template>
  <div>
    <h3 class="title-block">
      Arcsi's Latest
    </h3>
    <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-32">
      <img src="@/assets/img/preloader.svg" class="h-8 mb-2">
      <p>Loading...</p>
    </div>
    <div v-else class="container relative py-10 latest-container">
      <div class="relative arcsi-episodes">
        <div v-for="(episode, i) in arcsiLatestDisplay" :key="episode + i">
          <ArcsiLatestBlock :episode="episode" :arcsilist="arcsiList" />
        </div>
      </div>
      <a ref="button-prev" href="#" class="absolute left-0 top-36" @click.prevent="previousBlock">
        <img src="@/assets/img/arrow-left.svg" alt="">
      </a>
      <a ref="button-next" href="#" class="absolute right-0 top-36" @click.prevent="nextBlock">
        <img src="@/assets/img/arrow-right.svg" alt="">
      </a>
    </div>
    <div v-if="$fetchState.error" class="py-32 text-center">
      Error happened
    </div>
  </div>
</template>

<script>
import { arcsiItemBaseURL } from '~/constants'

export default {
  name: 'LatestArcsi',
  data () {
    return {
      startIndex: 0,
      preloadImages: false,
      numberOfEpisodes: 9,
      positionStart: 0,
      positionEnd: 3,
      arcsiEpisodes: null
    }
  },
  async fetch () {
    this.arcsiEpisodes = await this.$axios.get(arcsiItemBaseURL + '/all')
      .then(res => res.data)
      .catch((error) => {
        console.log(error)
        this.$nuxt.error({ statusCode: 500, message: 'Arcsi latest not found' })
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
    arcsiLatestDisplay () {
      if (this.arcsiEpisodesListSortedLatest) {
        return this.arcsiEpisodesListSortedLatest.slice(this.positionStart, this.positionEnd)
      }
      return null
    },
    arcsiList () {
      return [...this.$store.state.arcsiShows]
    }
  },
  mounted () {
    window.addEventListener('resize', this.changeBreakpoint)
  },
  beforeDestroy () {
    this.arcsiEpisodes = null
    window.removeEventListener('resize', this.changeBreakpoint)
  },
  methods: {
    changeBreakpoint (event) {
      console.log(event)
    },
    previousBlock () {
      if (this.positionStart !== 0 && this.positionStart - this.positionEnd > 0) {
        this.positionStart = this.positionStart - this.positionEnd
        this.positionEnd = this.positionEnd / 2
      }
      console.log('Previous')
    },
    nextBlock () {
      if (this.positionEnd < this.numberOfEpisodes) {
        this.positionStart = this.positionStart + this.positionEnd
        this.positionEnd = this.positionEnd * 2
      }
      console.log('Next')
    }

  }
}
</script>

<style lang="scss" scoped>

.arcsi-episodes {
  @apply grid gap-8 lg:grid-cols-3 md:grid-cols-2;
}

/* .latest-container {
  max-height: 75vh;
} */

</style>
