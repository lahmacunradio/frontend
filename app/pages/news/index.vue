<template>
  <div class="container">
<!--    <AutoCompleteSearch-->
<!--      :defaultItems="defaultArcsiShows"-->
<!--      suggestionAttribute="name"-->
<!--      :searchFields="searchFields"-->
<!--      @update="onUpdate"-->
<!--      placeHolder="Search"-->
<!--    />-->
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
    <footer class="flex flex-row justify-center py-4 align-middle news-pagination">
      <div :class="{disabled: startOffset === 0}">
        <a href="#" @click.prevent="fetchNewsPaginationFirst">
          <i class="fa fa-angle-double-left" aria-hidden="true" /> First
        </a>
        <span class="mx-2">|</span>
      </div>
      <div :class="{disabled: startOffset === 0}">
        <a href="#" @click.prevent="fetchNewsPaginationPrevious">
          <i class="fa fa-angle-left" aria-hidden="true" /> Previous
        </a>
        <span class="mx-2">|</span>
      </div>
      <div :class="{disabled: startOffset === lastPage}">
        <a href="#" @click.prevent="fetchNewsPaginationNext">
          Next <i class="fa fa-angle-right" aria-hidden="true" />
        </a>
      </div>
      <div :class="{disabled: startOffset === lastPage}">
        <span class="mx-2">|</span>
        <a href="#" @click.prevent="fetchNewsPaginationLast">
          Last <i class="fa fa-angle-double-right" aria-hidden="true" />
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
import { newsBaseURL, contentApiURL } from '~/constants'

export default {
  components: {},
  data () {
    return {
      newsFilteredList: null,
      numberOfItems: 12,
      numberOfTotal: 0,
      startOffset: 0,
      initialCallback: res => res.json()
    }
  },
  head () {
    return {
      title: 'Lahmacun News'
    }
  },
  computed: {
    lastPage () {
      return Math.round(this.numberOfTotal / this.numberOfItems - 1)
    }
  },
  async mounted () {
    // this.newsFilteredList = await this.useFetch()
    // this.numberOfTotal = await this.useFetch({callback: res => parseInt(res.headers.get('x-wp-total'))})
    this.newsFilteredList = await this.$axios.get(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=0`)
      .then(res => res.data)
    this.numberOfTotal = await this.$axios.get(`${newsBaseURL}&per_page=${this.numberOfItems}`)
      .then(res => parseInt(res.headers['x-wp-total']))
  },
  methods: {
    async useFetch({ callback=this.initialCallback, offset=0, search='' }) {
      { callback=this.initialCallback, offset=0, search='' }
      return await fetch(
        `${newsBaseURL}&per_page=${this.numberOfItems}&offset=${offset}&search=${search}`)
        .then(res => callback(res))
    },
    async fetchNewsPaginationFirst () {
      if (this.startOffset === 0) {
        return false
      }
      this.newsFilteredList = await this.$axios.get(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=0`)
        .then(res => res.data)
      this.startOffset = 0
      await this.useFetch()
    },
    async fetchNewsPaginationPrevious () {
      if (this.startOffset === 0) {
        return false
      }
      this.newsFilteredList = await this.$axios.get(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=${this.numberOfItems * (this.startOffset - 1)}`)
        .then(res => res.data)
      this.startOffset = this.startOffset - 1
      await this.useFetch()
    },
    async fetchNewsPaginationNext () {
      this.newsFilteredList = await this.$axios.get(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=${this.numberOfItems * (this.startOffset + 1)}`)
        .then(res => res.data)
      this.startOffset = this.startOffset + 1
      await this.useFetch()
    },
    async fetchNewsPaginationLast () {
      this.newsFilteredList = await this.$axios.get(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=${this.numberOfItems * this.lastPage}`)
        .then(res => res.data)
      this.startOffset = this.lastPage
      await this.useFetch()
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
