<template>
  <div class="container">
    <h1 class="mb-8">News</h1>
    <article class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      <div v-for="news in sortNews" :key="news.id">
        <NewsBlock :news="news" />
      </div>
    </article>
  </div>
</template>

<script>

export default {
  components: {},
  data() {
    return {}
  },
  head() {
    return {
      title: 'Lahmacun News'
    }
  },
  computed: {
    newsList() {
      return this.$store.state.newsList
    },
    sortNews() {
      return [...this.newsList].sort((a, b) => a.date - b.date)
    }
  }
}
</script>