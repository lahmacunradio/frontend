<template>
  <div>
    <section class="grid-cols-2 mb-16 md:grid home-top">
      <div v-if="sortNews" class="bg-white">
        <NewsHome :news="sortNews[newsStart]" @changenews="changeIt($event)" />
      </div>
      <div>
        <client-only>
          <ScheduleHome />
        </client-only>
      </div>
    </section>
    <article>
      <ArcsiLatest />
    </article>
  </div>
</template>

<script>
import { newsURL } from '~/constants'

export default {
  data () {
    return {
      newsLimit: 9,
      newsStart: 0,
      newsList: null
    }
  },
  async fetch () {
    this.newsList = await this.$axios.get(newsURL)
      .then(res => res.data)
      .catch((error) => {
        this.$nuxt.error({ statusCode: 404, message: error + ' not found' })
      })
  },
  computed: {
    newsListState () {
      if (!this.newsList) {
        return false
      }
      return this.newsLimit ? this.newsList.slice(0, this.newsLimit) : this.newsList
    },
    sortNews () {
      if (!this.newsList) {
        return false
      }
      return [...this.newsListState].sort((a, b) => a.date - b.date)
    }
  },
  methods: {
    changeIt (direction) {
      if (this.newsStart === 0 && direction === 'previous') {
        this.newsStart = this.newsLimit - 1
      } else if (direction === 'next' && this.newsStart === this.newsLimit - 1) {
        this.newsStart = 0
      } else if (direction === 'previous') {
        this.newsStart--
      } else if (direction === 'next') {
        this.newsStart++
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.home-top {
  margin-bottom: 0;
}
h3 {
  margin-bottom: 1rem;
}
</style>
