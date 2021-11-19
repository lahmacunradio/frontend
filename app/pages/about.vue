<template>
  <div>
    <h3 class="title-block">
      About us
    </h3>
    <div id="about-page-content" class="container mt-8">
      <div v-if="$fetchState.pending" class="py-8 center w-100">
        Loading...
      </div>
      <div v-if="$fetchState.error" class="py-8 center w-100">
        Some error happened...
      </div>
      <div v-if="aboutUs">
        <div v-sanitize="[ sanitizeOptions, aboutUsResults]" />
      </div>
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
        allowedTags: ['b', 'i', 'em', 'strong', 'img', 'figcaption', 'p'],
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
        console.log(error)
        this.$nuxt.error({ statusCode: 500, message: 'About page not available' })
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
  p {
    margin: 0 0 1rem;
    line-height: 1.6em;
  }
  img {
    width: 100%;
  }
}
</style>
