<template>
  <div>
    <section class="grid-cols-2 mb-16 md:grid home-top">
      <div class="bg-white">
        <div v-if="$fetchState.pending" class="p-8 text-center text-gray-500">
          Loading news...
        </div>
        <div v-else-if="$fetchState.error" class="p-8 text-center text-red-500">
          Failed to load news
        </div>
        <NewsHome v-else-if="sortNews && sortNews.length > 0" :news="sortNews[newsStart]" @changenews="changeIt($event)" />
        <div v-else class="p-8 text-center text-gray-500">
          No news available
        </div>
      </div>
      <div>
        <client-only>
          <div v-if="!fullSchedule || fullSchedule.length === 0" class="p-8 text-center text-gray-500">
            Loading schedule...
          </div>
          <ScheduleHome v-else :shows="sortShowsForSchedule" />
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
import { useArcsiStore } from '~/stores/arcsi'

export default {
  created() {
    // initialize Pinia store
    this.arcsi = useArcsiStore()
  },
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
    fullSchedule() { return this.arcsi.returnArcsiShows },
    rareShows() { return this.arcsi.returnRareShows },
    customSchedule() { return this.arcsi.returnCustomSchedule },
    sortShowsForSchedule () {
      const shows = Array.isArray(this.fullSchedule) ? this.fullSchedule : []
      return [...shows]
        .filter(s => s && s.day != null && s.start)
        .sort((a, b) => Number(a.day) - Number(b.day))
        .sort((a, b) => parseInt(String(a.start).replace(':', ''), 10) - parseInt(String(b.start).replace(':', ''), 10))
    },
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
      const list = Array.isArray(this.newsListState) ? this.newsListState : []
      return [...list]
        .filter(n => n && n.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
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
