<template>
  <div class="container">
    <div v-if="$fetchState.pending" class="py-8 center w-100">
      Loading...
    </div>
    <div v-if="$fetchState.error" class="py-8 center w-100">
      Some error happened...
    </div>
    <div v-if="aboutUs">
      <h1>{{ aboutUs.title.rendered }}</h1>
      <div v-html="aboutUsResults" />
    </div>
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
    this.aboutUs = await this.$axios.get(`${aboutUsURL}`)
      .then(res => res.data)
      .catch((error) => {
        console.error('Error:', error)
      })
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
