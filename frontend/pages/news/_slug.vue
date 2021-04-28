<template>
  <div class="container">
    <NewsFull :news="selectedNews" />
  </div>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      slug: this.$route.params.slug
    }
  },
  head() {
    return {
      title: this.htmlDecoder(this.selectedNews.title.rendered)
    }
  },
  computed: {
    selectedNews() {
      return this.$store.state.newsList.filter(news => news.slug === this.slug).shift()
    }
  }
}
</script>
