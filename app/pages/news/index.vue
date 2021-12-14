<template>
  <div>
    <SubTitle title="Lahmacun News" />
    <ItemsList
      :items="newsFilteredList"
      :isLoading="isLoading"
      :totalCount="totalCount"
      :callback="fetchNews"
      @search="onChange"
      placeholder="Search"
    />
  </div>
</template>

<script>
import { contentApiURL, newsBaseURL } from '~/constants'

export default {
  data () {
    return {
      newsFilteredList: [],
      numberOfItems: 9,
      totalCount: 0,
      searchText: '',
      callBacks: {
        totalNumber: res => parseInt(res.headers['x-wp-total']),
        fetchNews: async res => await this.parseData(res.data)
      },
      isLoading: false
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
    fetchCount () {
      return this.newsFilteredList.length + this.numberOfItems
    }
  },
  async mounted () {
    this.newsFilteredList = await this.useFetch()
    this.totalCount = await this.useFetch({ type: 'totalNumber' })
  },
  beforeDestroy () {
    this.newsFilteredList = null
    this.totalCount = null
  },
  methods: {
    async useFetch({ type = 'fetchNews' } = {}) {
      const callback = this.callBacks[type]
      try {
        this.isLoading = true
        const response = await this.$axios.get(
          `${newsBaseURL}${
            type === 'fetchNews'
              ? `&per_page=${this.fetchCount}`
              : ''
          }${
            this.searchText.length > 2
              ? `&search=${this.searchText}`
              : ''
          }`)
        const news = await callback(response)
        this.isLoading = false
        return news
      } catch (error) {
        this.$nuxt.error({ statusCode: 500, message: 'News is not available' })
      }
    },
    async getImage(idNews) {
      const { data } = await this.$axios.get(`${contentApiURL}/media/${idNews}`)
      return data?.media_details?.sizes?.large?.source_url || data?.source_url
      // return {
      //   large: data?.media_details?.sizes?.large?.source_url || data?.source_url,
      //   small: data?.media_details?.sizes?.medium_large?.source_url || data?.source_url
      // }
    },
    async parseData(news) {
      return await Promise.all(news.map(async n => ({
        title: this.htmlDecoder(n.title.rendered),
        url: `/news/${n.slug}`,
        image: await this.getImage(n.featured_media),
        description: this.truncate(n.excerpt.rendered, 150)
      })))
    },
    async fetchNews () {
      this.newsFilteredList = await this.useFetch()
    },
    async onChange (e) {
      this.searchText = e
      if (this.searchText.length > 2 || !this.searchText) {
        this.newsFilteredList = []
        this.totalCount = 0
        await this.fetchNews()
        this.totalCount = await this.useFetch({ type: 'totalNumber' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  padding: 2rem 0 2rem 0;
}
.news-block {
  max-width: 100%;
}
.input {
  display: block;
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
