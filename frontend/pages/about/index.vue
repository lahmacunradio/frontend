<template>
  <div class="container">
    <h1>{{ aboutUs.title.rendered }}</h1>
    <span v-html="aboutUs.content.rendered">
    </span>
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
    aboutUs () {
      return this.$store.state.aboutUs
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  margin-bottom: 1rem;
  line-height: 3;

  span {
    font-size: .875rem;
  }
}
</style>

