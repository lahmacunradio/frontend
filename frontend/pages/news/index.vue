<template>
  <div class="container">
    <h1>News</h1>
    <article class="grid grid-cols-3 gap-4">
      <div v-for="news in sortNews" :key="news.id">
        <NewsBlock :news="news" />
      </div>
    </article>
  </div>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    newsList () {
      return this.$store.state.newsList
    },
    sortNews () {
      return [...this.newsList].sort((a, b) => a.date - b.date)
    }
  }
}
</script>
