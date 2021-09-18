<template>
  <div class="container">
    <header class="flex flex-row items-center justify-between">
      <h1 class="mb-8">
        News
      </h1>
      <div>
        <select id="year" name="">
          <option disabled selected value>
            Year
          </option>
          <option value="2021" name="2021">
            2021
          </option>
          <option value="2020" name="2020">
            2020
          </option>
        </select>
        <select id="Tag" name="">
          <option disabled selected value>
            Tag
          </option>
          <option value="music" name="music">
            Music
          </option>
          <option value="event" name="event">
            Event
          </option>
          <option value="merch" name="merch">
            Merch
          </option>
        </select>
      </div>
    </header>
    <article v-if="newsFilteredList.length" class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      <div v-for="news in newsFilteredList" :key="news.id">
        <NewsBlock :news="news" />
      </div>
    </article>
    <article v-else class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      <div v-for="news in sortNews" :key="news.id">
        <NewsBlock :news="news" />
      </div>
    </article>
    <footer class="flex flex-row justify-center py-4 align-middle news-pagination">
      <a href="#" @click.prevent="fetchNewsPaginationFirst">First</a>
      |
      <a href="#" @click.prevent="fetchNewsPaginationPrevious">Previous</a>
      |
      <a href="#" @click.prevent="fetchNewsPaginationNext">Next</a>
      |
      <div> Last</div>
    </footer>
  </div>
</template>

<script>
import { newsBaseURL } from '~/constants'

export default {
  components: {},
  data () {
    return {
      newsFilteredList: {},
      numberOfItems: 12,
      startOffset: 0
    }
  },
  head () {
    return {
      title: 'Lahmacun News'
    }
  },
  computed: {
    newsList () {
      return this.$store.state.newsList
    },
    sortNews () {
      return [...this.newsList].sort((a, b) => a.date - b.date)
    }
  },
  methods: {
    async fetchNewsPaginationFirst () {
      if (this.startOffset === 0) {
        return false
      }
      this.newsFilteredList = await fetch(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=0`)
        .then(res => res.json())
      this.startOffset = 0
    },
    async fetchNewsPaginationPrevious () {
      if (this.startOffset === 0) {
        return false
      }
      this.newsFilteredList = await fetch(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=${this.numberOfItems * (this.startOffset - 1)}`)
        .then(res => res.json())
      this.startOffset = this.startOffset - 1
    },
    async fetchNewsPaginationNext () {
      this.newsFilteredList = await fetch(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=${this.numberOfItems * (this.startOffset + 1)}`)
        .then(res => res.json())
      this.startOffset = this.startOffset + 1
    },
    async fetchNewsYear (year) {
      this.newsFilteredList = await fetch(`${newsBaseURL}&tags=${year}`)
        .then(res => res.json())
    }
  }
}
</script>
