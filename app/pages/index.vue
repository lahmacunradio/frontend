<template>
  <div>
    <section class="grid-cols-2 mb-16 md:grid home-top">
      <div class="bg-white">
        <NewsHome :news="sortNews[newsStart]" @changenews="changeIt($event)" />
      </div>
      <div>
        <client-only>
          <ScheduleHome :shows="sortShowsForSchedule" />
        </client-only>
      </div>
    </section>
    <article>
      <ArcsiLatest />
    </article>
  </div>
</template>

<script>
export default {
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
      return [...this.arcsishows].sort((a, b) => a.day - b.day).sort((a, b) => parseInt(a.start.replace(':', ''), 10) - parseInt(b.start.replace(':', ''), 10))
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
