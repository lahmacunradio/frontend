<template>
  <div class="container">
    <input
      v-model="search"
      class="input"
      type="search"
      @input="onChange"
      :placeholder="placeholder"
    >
    <header class="flex flex-row items-center justify-between">
      <h1 class="mb-8">
        News
      </h1>
    </header>
    <article class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      <div v-for="news in newsFilteredList" :key="news.id" class="news-block">
        <NewsBlock :news="news" />
      </div>
    </article>
    <div v-if="numberOfTotal > newsFilteredList.length" id="loadmore" class="p-4 text-center">
      <a href="#" @click.prevent="fetchNews">
        <b>Load {{ numberOfItems }} more episodes</b>
        <br>
        (showing {{ newsFilteredList.length }} episodes)
      </a>
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
        totalNumber: res => parseInt(res.headers.get('x-wp-total')),
        fetchNews: res => res.json()
      },
      placeholder: 'search'
    }
  },
  head () {
    return {
      title: 'Lahmacun News'
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
  methods: {
    async useFetch({
      type = 'fetchNews',
    } = {}) {
      const callback = this.callBacks[type]
      console.log(this.fetchCount, this.numberOfTotal, this.newsFilteredList)
      return await fetch(
        `${newsBaseURL}${
          type === 'fetchNews'
            ? `&per_page=${this.fetchCount}`
            : ''
        }${
          this.search.length > 2
            ? `&search=${this.search}`
            : ''
        }`)
        .then(res => callback(res))
        .catch(e => console.log(e))
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
.disabled a {
  pointer-events: none;
  opacity: 0.5;
  cursor: default;
}
.news-block {
  max-width: 100%;
}
</style>
