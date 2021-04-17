<template>
  <div class="container">
    <div class="m-4 text-center title">
      <h1>Lahmacun Radio Home</h1>
    </div>
    <section class="grid grid-cols-2 gap-8">
      <div>
        <nuxt-link to="news/">
          <h3>News</h3>
        </nuxt-link>
        <div v-for="news in sortNews" :key="news.id">
          <NewsBlock :news="news" />
        </div>
      </div>
      <div>
        <nuxt-link to="/news">
          <h3>Schedule</h3>
        </nuxt-link>
        <div v-for="show in sortShowsForSchedule" :key="show.id">
          <div>
            <nuxt-link :to="'/shows/' + show.archive_lahmastore_base_url">
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
a {
  &:hover {
    font-weight: 500;
  }
}
</style>
