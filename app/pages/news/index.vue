<template>
  <div>
    <h2 class="title-block">
      Lahmacun News
    </h2>
    <div class="container">
      <header class="flex flex-row items-center justify-between">
        <input
          v-model="search"
          class="input"
          type="search"
          :placeholder="placeholder"
          @input="onChange"
        >
      </header>
      <article class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <div v-for="news in newsFilteredList" :key="news.id" class="news-block">
          <NewsBlock :news="news" />
        </div>
      </article>
      <div v-if="numberOfTotal > newsFilteredList.length && !isLoading" id="loadmore" class="p-4 text-center">
        <a href="#" @click.prevent="fetchNews">
          <b>Load {{ numberOfItems }} more episodes</b>
          <br>
          (showing {{ newsFilteredList.length }} episodes)
        </a>
      </div>
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-4">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { newsBaseURL } from '~/constants'

export default {
  components: {},
  data () {
    return {
      newsFilteredList: [],
      numberOfItems: 12,
      numberOfTotal: 0,
      search: '',
      callBacks: {
        totalNumber: res => parseInt(res.headers['x-wp-total']),
        fetchNews: res => res.data
      },
      placeholder: 'search',
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
    this.numberOfTotal = await this.useFetch({ type: 'totalNumber' })
  },
  beforeDestroy () {
    this.newsFilteredList = null
    this.numberOfTotal = null
  },
  methods: {
    async useFetch ({
      type = 'fetchNews'
    } = {}) {
      const callback = this.callBacks[type]
      try {
        this.isLoading = true
        const response = await this.$axios.get(
          `${newsBaseURL}${
            type === 'fetchNews'
              ? `&per_page=${this.fetchCount}`
              : ''
          }${
            this.search.length > 2
              ? `&search=${this.search}`
              : ''
          }`)
        this.isLoading = false
        return callback(response)
      } catch (error) {
        console.log(error)
        this.$nuxt.error({ statusCode: 500, message: 'News is not available' })
      }
    },
    async fetchNews () {
      this.newsFilteredList = await this.useFetch()
    },
    async onChange () {
      if (this.search.length > 2 || !this.search) {
        this.newsFilteredList = []
        this.numberOfTotal = 0
        await this.fetchNews()
        this.numberOfTotal = await this.useFetch({ type: 'totalNumber' })
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
