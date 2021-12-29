<template>
  <div>
    <SubTitle title="Lahmacun Shows" />
    <FilterInput @search="onChange" />
    <div class="mt-8 mb-4 title">
      <h2>Active Shows</h2>
    </div>
    <ItemList
      :items="liveShows"
      :noFoundMessage="'No matching shows found'"
      :isLoading="isLoading"
    />
    <div v-show="isLoading" class="flex flex-col items-center justify-center py-4">
      <img src="@/assets/img/preloader.svg" class="h-8 mb-2">
      Loading...
    </div>
    <div class="mt-8 mb-4 title">
      <h2>Past Shows</h2>
    </div>
    <ItemList
      :items="formerShows"
      :noFoundMessage="'No matching shows found'"
      :isLoading="isLoading"
    />
    <div v-show="isLoading" class="flex flex-col items-center justify-center py-4">
      <img src="@/assets/img/preloader.svg" class="h-8 mb-2">
      Loading...
    </div>
  </div>
</template>

<script>
import { arcsiServerURL } from '~/constants'

export default {
  data () {
    return {
      shows: [],
      liveShows: [],
      formerShows: [],
      searchFields: ['name', 'description'],
      isLoading: false
    }
  },
  head () {
    return {
      title: 'Lahmacun Shows',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'All Lahmacun Shows, active and past'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Shows'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'All Lahmacun Shows, active and past'
        }
      ]
    }
  },
  async mounted () {
    this.isLoading = true
    this.shows = await this.useFetch()
    this.parseShows(this.shows)
    this.isLoading = false
  },
  methods: {
    async useFetch () {
      try {
        const { data } = await this.$axios.get(`${arcsiServerURL}`)
        return data
      } catch (error) {
        this.$sentry.captureException(new Error('Shows is not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Shows is not available' })
      }
    },
    parseShows(shows) {
      shows.forEach(show => {
        if (show.archive_lahmastore_base_url !== 'off-air' && show.active) {
          this.liveShows = [...this.liveShows, this.parseData(show)]
        } else if (!show.active) {
          this.formerShows = [...this.formerShows, this.parseData(show)]
        }
      })
    },
    parseData(show) {
      return {
        title: show.name,
        url: `/shows/${show.archive_lahmastore_base_url}`,
        image: show.cover_image_url,
      }
    },
    onChange (result) {
      this.isLoading = true
      this.liveShows = []
      this.formerShows = []
      const filteredList = this.shows.filter(show => (
        this.searchFields.some(field => show[field].toLowerCase().includes(result.toLowerCase()))
      ))
      this.parseShows(filteredList)
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  padding: 0 calc(1rem + 4px);
}
</style>
