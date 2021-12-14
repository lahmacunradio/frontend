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
    </div>
  </div>
</template>

<script>
import { arcsiItemBaseURL } from '~/constants'

export default {
  data () {
    return {
      startIndex: 0,
      numberOfEpisodes: 9,
      arcsiEpisodes: [],
      displayedEpisodes: [],
      searchFields: ['title', 'subTitle'],
      isLoading: false,
    }
  },
  async mounted () {
    const allEpisodes = await this.useFetch(`${arcsiItemBaseURL}/all`)
    const parsedEpisodes = await this.parseEpisodes(allEpisodes)
    this.arcsiEpisodes = parsedEpisodes.filter(item => item.date < this.getToday && item.archived === true)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    this.displayedEpisodes = this.getDisplayedEpisodes()
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
      this.displayedEpisodes = [...this.displayedEpisodes, ...this.getDisplayedEpisodes()]
      this.isLoading = false
    },
  },
  computed: {
    getToday () {
      const d = new Date()
      const year = d.getFullYear()
      const month = (d.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
      const day = d.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })
      return `${year}-${month}-${day}`
    },
    arcsiList () {
      return this.$store.state.arcsiShows
    }
  },
  beforeDestroy () {
    this.arcsiEpisodes = null
  },
  methods: {
    getDisplayedEpisodes () {
      return this.arcsiEpisodes.slice(this.startIndex, this.startIndex + this.numberOfEpisodes)
    },
    async useFetch (url) {
      try {
        this.isLoading = true
        const response = await this.$axios.get(url)
        this.isLoading = false
        return response.data
      } catch (e) {
        this.$nuxt.error({ statusCode: 500, message: 'Arcsi is not available at the moment' })
      }
    },
    getUrl (episode) {
      return `/shows/${this.arcsiList.find(item => item.id === episode.shows[0].id).archive_lahmastore_base_url}/${episode.id}`
    },
    async parseEpisodes (episodes) {
      console.log(this.arcsiList, episodes)
      return episodes.map(episode => ({
        title: episode.name,
        url: this.getUrl(episode),
        subTitle: episode.shows[0].name,
        image: Boolean(episode.image_url)
            ? episode.image_url
            : this.arcsiList.find(item => item.id === episode.shows[0].id).cover_image_url,
        date: episode.play_date,
        archived: episode.archived
      }))
    },
    loadMoreEpisodes () {
      this.isLoading = true
      this.startIndex = this.startIndex + this.numberOfEpisodes
      this.isLoading = false
    },
    onUpdate (result) {
      console.log(result)
      this.isLoading = true
      this.displayedEpisodes = this.arcsiEpisodes.filter(episode => {
        return this.searchFields.some(field => episode[field].toLowerCase().includes(result.toLowerCase()))
      })
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
