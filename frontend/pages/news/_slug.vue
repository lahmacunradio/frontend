<template>
  <div class="container">
    <NewsFull :news="selectedNews" />
  </div>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      slug: this.$route.params.slug
    }
  },
  computed: {
    selectedNews () {
      return this.$store.state.newsList.filter(news => news.slug === this.slug).shift()
    }
  }
}
</script>
