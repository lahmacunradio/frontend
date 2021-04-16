<template>
  <div class="container">
    <div class="m-4 text-center title">
      <h1>Lahmacun Radio Home</h1>
    </div>
    <section class="grid grid-cols-2 gap-8">
      <div>
        <h3>News</h3>
        <div v-for="news in sortNews" :key="news.id">
          <div class="mb-2">
            <h5>{{ news.title.rendered }}</h5>
            <div v-html="news.excerpt.rendered" />
          </div>
        </div>
      </div>
      <div>
        <h3>Schedule</h3>
        <div v-for="show in sortShowsForSchedule" :key="show.id">
          <div>
            {{ show.name }} - {{ show.start }}
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
    sortShowsForSchedule () {
      return [...this.arcsishows].sort((a, b) => parseInt(a.start) - parseInt(b.start)).sort((a, b) => a.day - b.day)
    },
    arcsishows () {
      return this.$store.state.arcsiShows
    },
    sortNews () {
      return [...this.newsListState].sort((a, b) => a.date - b.date)
    },
    newsListState () {
      return this.newsLimit ? this.$store.state.newsList.slice(0, this.newsLimit) : this.$store.state.newsList
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
