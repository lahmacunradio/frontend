<template>
  <div>
    <SubTitle title="Lahmacun Archive" :maintitle="true" />
    <div class="container mt-8">
      <!-- no search for now, is buggy
      <div v-if="defaultEpisodes" class="flex justify-between">
        <AutoCompleteSearch
          :default-items="defaultEpisodes"
          suggestion-attribute="name"
          :search-fields="searchFields"
          place-holder="Search"
          @update="onUpdate"
        />
      </div>
      -->
      <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-4">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
        <p>Loading...</p>
      </div>
      <div v-if="$fetchState.error" class="py-8 text-center">
        Error happened
      </div>
      <article class="grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <div v-for="(episode, i) in arcsiEpisodesListSortedLatest" :key="episode + i">
          <ArcsiEpisodeBlock :episode="episode" :arcsilist="arcsiList" />
        </div>
      </article>
      <div id="loadmore" class="p-4 text-center">
        <a href="#" @click.prevent="loadMoreEpisodes">
          <b>Load {{ startNumberofEpisodes }} more episodes</b>
          <br>
          (showing {{ numberOfEpisodes }} episodes)
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { arcsiItemBaseURL } from '~/constants'

export default {
  data () {
    return {
      startIndex: 1,
      preloadImages: false,
      numberOfEpisodes: 12,
      startNumberofEpisodes: 12,
      arcsiEpisodes: null,
      defaultEpisodes: null,
      searchFields: ['name', 'description']
    }
  },
  async fetch () {
    this.defaultEpisodes = await this.$axios.get(`${arcsiItemBaseURL}/latest?size=${this.startNumberofEpisodes}&page=${this.startIndex}`)
      .then(res => res.data)
      .catch((error) => {
        this.$sentry.captureException(new Error('Arcsi is not available at the moment ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Arcsi is not available at the moment' })
      })
    this.arcsiEpisodes = this.defaultEpisodes
  },
  head () {
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
      return [...this.$store.getters.returnArcsiShows]
    }
  },
  beforeDestroy () {
    this.defaultEpisodes = null
    this.arcsiEpisodes = null
  },
  methods: {
    async loadMoreEpisodes () {
      this.startIndex++
      const newEpisodes = await this.$axios.get(`${arcsiItemBaseURL}/latest?size=${this.startNumberofEpisodes}&page=${this.startIndex}`)
        .then(res => res.data)
        .catch((error) => {
          this.$sentry.captureException(new Error('Arcsi is not available at the moment ', error))
          this.$nuxt.error({ statusCode: 404, message: 'Arcsi is not available at the moment' })
        })
      this.arcsiEpisodes = this.arcsiEpisodes.concat(newEpisodes)
      this.numberOfEpisodes = this.numberOfEpisodes * 2
    },
    onUpdate (result) {
      this.arcsiEpisodes = result
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
