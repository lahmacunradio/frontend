<template>
  <div>
    <h3 class="title-block">
      News
    </h3>
    <div class="container mt-8">
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
  </div>
</template>

<script>
import { newsBaseURL } from '~/constants'

export default {
  components: {},
  data () {
    return {
      newsFilteredList: null,
      numberOfItems: 12,
      numberOfTotal: 0,
      startOffset: 0
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
    this.newsFilteredList = await this.$axios.get(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=0`)
      .then(res => res.data)
    this.numberOfTotal = await this.$axios.get(`${newsBaseURL}&per_page=${this.numberOfItems}`)
      .then(res => parseInt(res.headers['x-wp-total']))
  },
  methods: {
    async fetchNewsPaginationFirst () {
      if (this.startOffset === 0) {
        return false
      }
      this.newsFilteredList = await this.$axios.get(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=0`)
        .then(res => res.data)
      this.startOffset = 0
    },
    async fetchNewsPaginationPrevious () {
      if (this.startOffset === 0) {
        return false
      }
      this.newsFilteredList = await this.$axios.get(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=${this.numberOfItems * (this.startOffset - 1)}`)
        .then(res => res.data)
      this.startOffset = this.startOffset - 1
    },
    async fetchNewsPaginationNext () {
      this.newsFilteredList = await this.$axios.get(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=${this.numberOfItems * (this.startOffset + 1)}`)
        .then(res => res.data)
      this.startOffset = this.startOffset + 1
    },
    async fetchNewsPaginationLast () {
      this.newsFilteredList = await this.$axios.get(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=${this.numberOfItems * this.lastPage}`)
        .then(res => res.data)
      this.startOffset = this.lastPage
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
