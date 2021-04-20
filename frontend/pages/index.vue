<template>
  <div class="container">
    <div class="m-4 text-center title">
      <h1>Lahmacun Radio Home</h1>
    </div>
    <section class="grid-cols-2 gap-16 md:grid">
      <div>
        <nuxt-link to="news/">
          <h3>News</h3>
        </nuxt-link>
        <div v-for="news in sortNews" :key="news.id">
          <NewsBlock :news="news" />
        </div>
      </div>
      <div>
        <nuxt-link to="/shows">
          <h3>Schedule</h3>
        </nuxt-link>
        <ScheduleHome :shows="sortShowsForSchedule" />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {
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
    newsList () {
      return this.$store.state.newsList
    },
    newsListState () {
      return this.newsLimit ? this.newsList.slice(0, this.newsLimit) : this.newsList
    },
    sortNews () {
      return [...this.newsListState].sort((a, b) => a.date - b.date)
    }
  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 2rem;
}
h3 {
  margin-bottom: 1rem;
}
</style>
