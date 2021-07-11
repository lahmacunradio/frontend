<template>
  <div>
    <section class="grid-cols-2 mb-16 md:grid">
      <div>
        <NewsHome :news="sortNews[newsStart]" @changenews="changenews" />
      </div>
      <div>
        <ScheduleHome :shows="sortShowsForSchedule" />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'home',
  data () {
    return {
      newsLimit: 9,
      newsStart: 0
    }
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
    changenews () {
      if (this.newsStart === this.newsLimit - 1) {
        this.newsStart = 0
      } else {
        this.newsStart++
      }
    }
  }

}
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: 1rem;
}
</style>
