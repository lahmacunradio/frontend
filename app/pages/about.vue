<template>
  <div v-if="aboutUs" class="container">
    <h1>{{ aboutUs.title.rendered }}</h1>
    <div v-html="aboutUsResults"></div>
  </div>
</template>

<script>
import { aboutUsURL } from '~/constants'

export default {
  components: {
  },
  data () {
    return {
      aboutUs: null
    }
  },
  async fetch () {
    this.aboutUs = await fetch(`${aboutUsURL}`)
      .then(res => res.json())
  },
  computed: {
    aboutUsResults () {
      if (!this.aboutUs) {
        return false
      }
      return this.aboutUs.content.rendered
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  margin-bottom: 1rem;
  line-height: 3;
}
</style>
