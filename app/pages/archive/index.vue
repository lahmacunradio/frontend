<template>
  <div>
    <SubTitle title="Lahmacun Archive" :maintitle="true" />
    <div class="container mt-8">
      <input v-model="term" class="input" type="search" placeholder="Search">
      <div v-if="isFetching" class="flex flex-col items-center justify-center py-4">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
        <p>Loading...</p>
      </div>
      <div v-if="$fetchState.error" class="py-8 text-center">
        Error happened
      </div>
      <article class="grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <div v-for="(episode) in arcsiEpisodes" :key="episode.id">
          <ArcsiEpisodeBlock :episode="episode" :showList="arcsiShowsForTiles" />
        </div>
      </article>
      <div id="loadmore" class="p-4 text-center">
        <a href="#" @click.prevent="loadMoreEpisodes">
          <b>Load {{ startNumberofEpisodes }} more episodes</b>
          <br>
          (showing {{ arcsiEpisodes?.length }} episodes)
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { arcsiItemBaseURL, config } from '~/constants'

export default {
  data() {
    return {
      startIndex: 1,
      preloadImages: false,
      startNumberofEpisodes: 12,
      arcsiEpisodes: null,
      defaultEpisodes: null,
      term: '',
      debouncedFetchEpisodes: null,
      isFetching: false
    }
  },
  created() {
    this.debouncedFetchEpisodes = this.debounceFunction(this.fetchEpisodes, 300)
  },
  async fetch() {
    this.arcsiEpisodes = []
    await this.fetchEpisodes()
    this.defaultEpisodes = [...this.arcsiEpisodes]
  },
  head() {
    return {
      title: 'Lahmacun Archive',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'All Lahmacun episodes'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Archive'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'All Lahmacun episodes'
        }
      ]
    }
  },
  computed: {
    getToday() {
      const d = new Date()
      const year = d.getFullYear()
      const month = (d.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
      const day = d.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })
      return `${year}-${month}-${day}`
    },
    arcsiShowsForTiles() {
      return [...this.$store.getters.returnArcsiShowsForTiles]
    }
  },
  beforeDestroy() {
    this.defaultEpisodes = null
    this.arcsiEpisodes = null
  },
  methods: {
    async fetchEpisodes() {
      this.isFetching = true
      const searchedEpisodes = await this.$axios.get(`${arcsiItemBaseURL}/search?size=${this.startNumberofEpisodes}&page=${this.startIndex}&param=${encodeURIComponent(this.term)}`, config)
        .then(res => res.data)
        .catch((error) => {
          this.$sentry.captureException(new Error('Arcsi Episode Search is not available at the moment ', error))
          this.$nuxt.error({ statusCode: 404, message: 'Arcsi Episode Search is not available at the moment' })
        })
        .finally(() => {
          this.isFetching = false
        })
      this.arcsiEpisodes = this.arcsiEpisodes.concat(searchedEpisodes)
    },
    onUpdate(result) {
      this.arcsiEpisodes = result
    },
    loadMoreEpisodes() {
      this.startIndex += 1
      this.fetchEpisodes()
    }
  },
  watch: {
    term() {
      this.arcsiEpisodes = []
      this.startIndex = 1  // Add this line to reset the page index when the search term changes
      this.debouncedFetchEpisodes()
    }
  }

}
</script>

<style lang="scss" scoped>
.input {
  position: relative;
  width: 350px;

  @media (max-width: $mobile-width) {
    width: 100%;
  }

  height: 30px;
  border-radius: 0.25rem;
  outline: none;
  padding: 0 10px;
}
</style>
