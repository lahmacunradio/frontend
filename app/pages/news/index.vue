<template>
  <div class="container">
    <header class="flex flex-row items-center justify-between">
      <h1 class="mb-8">
        News
      </h1>
      <div>
        <select id="year" name="" @change="fetchNewsTag($event)">
          <option disabled selected value>
            Year
          </option>
          <option value="all" name="all">
            All years
          </option>
          <option value="2021" name="2021">
            2021
          </option>
          <option value="2020" name="2020">
            2020
          </option>
        </select>
        <select id="Tag" name="" @change="fetchNewsTag($event)">
          <option disabled selected value>
            Tag
          </option>
          <option value="all" name="all">
            All Tags
          </option>
          <option value="interview" name="interview">
            Interview
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
    <article class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      <div v-for="news in newsFilteredList" :key="news.id">
        <NewsBlock :news="news" />
      </div>
    </article>
    <footer class="flex flex-row justify-center py-4 align-middle news-pagination">
      <a href="#" @click.prevent="fetchNewsPaginationFirst">First</a>
      <span> | </span>
      <a href="#" @click.prevent="fetchNewsPaginationPrevious">Previous</a>
      <span> | </span>
      <a href="#" @click.prevent="fetchNewsPaginationNext">Next</a>
      <span> | </span>
      <a href="#" @click.prevent="fetchNewsPaginationLast">Last</a>
    </footer>
  </div>
</template>

<script>
import { contentApiURL, newsBaseURL } from '~/constants'

export default {
  components: {},
  data () {
    return {
      newsFilteredList: null,
      allTags: null,
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
  },
  async mounted () {
    this.newsFilteredList = await fetch(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=0`)
      .then(res => res.json())
    this.allTags = await fetch(`${contentApiURL}/tags`)
      .then(res => res.json())
    this.numberOfTotal = await fetch(`${newsBaseURL}&per_page=${this.numberOfItems}`)
      .then(res => parseInt(res.headers.get('x-wp-total')))
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
    async fetchNewsPaginationLast () {
      this.newsFilteredList = await fetch(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=${this.numberOfItems * Math.round(this.numberOfTotal / this.numberOfItems - 1)}`)
        .then(res => res.json())
      this.startOffset = Math.round(this.numberOfTotal / this.numberOfItems - 1)
    },
    async fetchNewsTag (tag) {
      const selectedValue = tag.target.value
      if (selectedValue === 'all') {
        this.newsFilteredList = await fetch(`${newsBaseURL}&per_page=${this.numberOfItems}&offset=${this.startOffset * this.numberOfItems}`)
          .then(res => res.json())
        return
      }
      const selectedTag = this.allTags.find(a => a.slug === selectedValue)
      if (selectedTag) {
        this.newsFilteredList = await fetch(`${newsBaseURL}&tags=${selectedTag.id}`)
          .then(res => res.json())
      }
    }
  }
}
</script>
