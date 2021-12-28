<template>
  <div>
    <SubTitle title="Lahmacun News" />
    <FilterInput @search="onChange" />
    <ItemList
      :items="newsFilteredList"
    />
    <Pagination
      :itemsCount="newsFilteredList.length"
      :totalCount="totalCount"
      :isLoading="isLoading"
      @click="fetchNews"
    />
  </div>
</template>

<script>
import { contentApiURL, newsBaseURL, tagsURL } from '~/constants'

export default {
  data () {
    return {
      newsFilteredList: [],
      numberOfItems: 9,
      totalCount: 0,
      searchText: '',
      isLoading: false,
      page: 1,
    }
  },
  head () {
    return {
      title: 'Lahmacun News',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Lahmacun News posts'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun News'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Lahmacun News posts'
        }
      ]
    }
  },
  computed: {
    newsUrl () {
      return `${newsBaseURL}&per_page=${this.numberOfItems}&page=${this.page}${this.searchText ? `&search=${this.searchText}` : ''}`
    }
  },
  async mounted () {
    await this.fetchNews()
  },
  beforeDestroy () {
    this.newsFilteredList = null
    this.totalCount = null
  },
  methods: {
    async useFetch(url) {
      try {
        const response = await this.$axios.get(`${url}`)
        return response
      } catch (error) {
        this.$sentry.captureException(new Error('News is not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'News is not available' })
      }
    },
    async getImage(idNews) {
      const { data } = await this.useFetch(`${contentApiURL}/media/${idNews}`)
      return data?.media_details?.sizes?.large?.source_url || data?.source_url
    },
    async getTags(idNews) {
      const { data } = await this.useFetch(`${tagsURL}?include=${idNews}`)
      return data.map(tag => ({ ...tag, link: `/news/tags/${tag.slug}` }))
    },
    async parseData(news) {
      return await Promise.all(news.map(async n => ({
        title: this.htmlDecoder(n.title.rendered),
        url: `/news/${n.slug}`,
        image: await this.getImage(n.featured_media),
        description: this.truncate(n.excerpt.rendered, 150),
        tags: n.tags.length ? await this.getTags(n.tags) : null
      })))
    },
    async fetchNews () {
      this.isLoading = true
      const response = await this.useFetch(this.newsUrl)
      this.newsFilteredList = [...this.newsFilteredList, ...(await this.parseData(response.data))]
      this.totalCount = parseInt(response.headers['x-wp-total'])
      this.page++
      this.isLoading = false
    },
    async onChange (e) {
      this.searchText = e
      if (this.searchText.length > 2 || !this.searchText) {
        this.newsFilteredList = []
        this.totalCount = 0
        this.page = 1
        await this.fetchNews()
      }
    }
  }
}
</script>
