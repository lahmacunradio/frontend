<template>
  <div id="about-page-content" class="container">
    <div v-if="$fetchState.pending" class="py-8 center w-100">
      Loading...
    </div>
    <div v-if="$fetchState.error" class="py-8 center w-100">
      Some error happened...
    </div>
    <div v-if="aboutUs">
      <h1>{{ aboutUs.title.rendered }}</h1>
      <div v-sanitize="[ sanitizeOptions, aboutUsResults]" />
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
      aboutUs: null,
      sanitizeOptions: {
        allowedTags: ['b', 'i', 'em', 'strong', 'img', 'figcaption'],
        allowedAttributes: {
          img: ['src', 'srcset']
        }
      }
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
.container {
  margin-bottom: 1rem;
  line-height: 3;
}
</style>

<style lang="scss">
#about-page-content {
  img {
    width: 100%;
  }
}
</style>
