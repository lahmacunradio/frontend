<template>
  <div>
    <SubTitle title="About Lahmacun" />
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
          img: ['*'],
          div: ['style', 'class', 'id'],
          a: ['*']
        }
      }
    }
  },
  async fetch () {
    this.aboutUs = await this.$axios.get(`${aboutUsURL}`)
      .then(res => res.data)
      .catch((error) => {
        this.$sentry.captureException(new Error('About page not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'About page not available' })
      })
  },
  head () {
    return {
      title: 'About Lahmacun',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Read about Lahmacun '
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'About Lahmacun'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Read about Lahmacun'
        }
      ]
    }
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
