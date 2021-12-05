<template>
  <div>
    <SubTitle title="Lahmacun Archive" />
    <div class="container mt-8">
      <ItemsList
        :items="displayedEpisodes"
        :isLoading="isLoading"
        :totalCount="arcsiEpisodes.length"
        :callback="loadMoreEpisodes"
        @search="onUpdate"
        placeholder="Search"
      />
<!--      <div v-if="defaultEpisodes">-->
<!--        <AutoCompleteSearch-->
<!--          :default-items="defaultEpisodes"-->
<!--          suggestion-attribute="name"-->
<!--          :search-fields="searchFields"-->
<!--          place-holder="Search"-->
<!--          @update="onUpdate"-->
<!--        />-->
<!--      </div>-->
<!--      <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-4">-->
<!--        <img src="@/assets/img/preloader.svg" class="h-8 mb-2">-->
<!--        <p>Loading...</p>-->
<!--      </div>-->
<!--      <div v-if="$fetchState.error" class="py-8 text-center">-->
<!--        Error happened-->
<!--      </div>-->
<!--      <article class="grid gap-4 py-8 md:grid-cols-2 lg:grid-cols-4">-->
<!--        <div v-for="(episode, i) in arcsiEpisodesListSortedLatest" :key="episode + i">-->
<!--          <ArcsiEpisodeBlock :episode="episode" :arcsilist="arcsiList" />-->
<!--        </div>-->
<!--      </article>-->
<!--      <div v-if="arcsiEpisodes && arcsiEpisodes.length > numberOfEpisodes" id="loadmore" class="p-4 text-center">-->
<!--        <a href="#" @click.prevent="loadMoreEpisodes">-->
<!--          <b>Load {{ startNumberofEpisodes }} more episodes</b>-->
<!--          <br>-->
<!--          (showing {{ numberOfEpisodes }} episodes)-->
<!--        </a>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
import { arcsiItemBaseURL } from '~/constants'
import useFetch from '../../backend/.cache/admin/src/containers/HomePage/hooks'

export default {
  data () {
    return {
      startIndex: 0,
      // preloadImages: false,
      numberOfEpisodes: 9,
      arcsiEpisodes: [],
      displayedEpisodes: [],
      searchFields: ['name', 'description'],
      isLoading: false
    }
  },
  async mounted () {
    const allEpisodes = await this.useFetch()
    console.log(allEpisodes)
    this.arcsiEpisodes = allEpisodes.filter(item => item.play_date < this.getToday && item.archived === true)
      .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
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
  watch: {
    startIndex: function () {
        this.isLoading = true
        const episodes = this.parseEpisodes(this.arcsiEpisodes.slice(this.startIndex, this.startIndex + this.numberOfEpisodes))
        this.displayedEpisodes = [...this.displayedEpisodes, episodes]
        this.isLoading = false
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
    // displayedEpisodes () {
    //   this.isLoading = true
    //   const episodes = this.arcsiEpisodes.slice(this.startIndex, this.startIndex + this.numberOfEpisodes)
    //   this.isLoading = false
    //   return episodes
    // },
    arcsiList () {
      return [...this.$store.state.arcsiShows]
    }
  },
  beforeDestroy () {
    this.arcsiEpisodes = null
  },
  methods: {
    async useFetch () {
      this.isLoading = true
      const episodes = await this.$axios.get(arcsiItemBaseURL + '/all')
        .then(res => {
          console.log('jnkhjkhjkhjkhkj', res.data)
          return res.data
    })
        .catch((error) => {
          console.log(error)
          this.$nuxt.error({ statusCode: 500, message: 'Arcsi is not available at the moment' })
        })
      console.log(episodes)
      this.isLoading = false
      return episodes
    },
    getUrl (episode) {
      return `/shows/${this.arcsilist.find(item => item.id === this.episode.shows[0].id).archive_lahmastore_base_url}/${episode.id}`
    },
    async parseEpisodes (episodes) {
      return episodes.map(episode => ({
        show: episode.shows[0].name,
        title: episode.name,
        url: this.getUrl(episode),
        image: {
          large: episode.image_url.length > 0
            ? this.episode.image_url
            : this.arcsilist.find(item => item.id === this.episode.shows[0].id).cover_image_url,
        },
        date: $moment(episode.play_date).format('yyyy. MMMM Do.')
      }))
    },
    loadMoreEpisodes () {
      this.isLoading = true
      this.numberOfEpisodes = this.numberOfEpisodes + this.startNumberofEpisodes
      this.isLoading = false
    },
    onUpdate (result) {
      this.isLoading = true
      this.arcsiEpisodes = this.searchFields.some(field => (
        this.arcsiEpisodes[field].toLowerCase().includes(result.toLowerCase()))
      )
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
