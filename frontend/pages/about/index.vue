<template>
  <div class="container">
    <h1>Anyád</h1>
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
