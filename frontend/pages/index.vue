<template>
  <div class="container">
    <div class="m-4 text-center title">
      <h1>Lahmacun Radio Home</h1>
    </div>
    <section class="grid grid-cols-2 gap-8">
      <div>
        <h3>News</h3>
        <div v-for="news in sortNews" :key="news.id">
          <news-block :news="news" />
        </div>
      </div>
      <div>
        <h3>Schedule</h3>
        <div v-for="show in sortShowsForSchedule" :key="show.id">
          <div>
            <nuxt-link :to="'shows/' + show.archive_lahmastore_base_url">
              {{ show.name }}
            </nuxt-link>
            - {{ show.start }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import NewsBlock from '../components/NewsBlock.vue'
import { contentApiURL } from '~/constants'

export default {
  components: {
    NewsBlock
  },
  data () {
    return {
      newsLimit: 3
    }
  },
  apollo: {
  },
  computed: {
    arcsishows () {
      return this.$store.state.arcsiShows
    },
    sortShowsForSchedule () {
      return [...this.arcsishows].sort((a, b) => parseInt(a.start) - parseInt(b.start)).sort((a, b) => a.day - b.day)
    },
    news () {
      return this.$store.state.newsList
    },
    newsListState () {
      return this.newsLimit ? this.news.slice(0, this.newsLimit) : this.news
    },
    sortNews () {
      return [...this.newsListState].sort((a, b) => a.date - b.date)
    }
  }

}
</script>

<style>
</style>
