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
