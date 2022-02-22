<template>
  <div>
    <SubTitle title="Lahmacun Impressum" maintitle="true" />
    <div id="about-page-content" class="container mt-8">
      <div v-if="$fetchState.pending" class="py-8 center w-100">
        Loading...
      </div>
      <div v-if="$fetchState.error" class="py-8 center w-100">
        Some error happened...
      </div>
      <div v-if="impressum" class="md:flex">
        <div v-if="impressumFeaturedImage" class="mb-4 md:mr-8 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
          <img :src="impressumFeaturedImage.source_url" alt="Lahmacun Impressum">
        </div>
        <div v-sanitize="[ sanitizeOptions, impressumResults]" class="text-content" />
      </div>
    </div>
  </div>
</template>

<script>
import { impressumURL, mediaURL } from '~/constants'

export default {
  components: {
  },
  data () {
    return {
      impressum: null,
      impressumFeaturedImage: null,
      sanitizeOptions: {
        allowedTags: ['b', 'i', 'em', 'strong', 'img', 'figcaption', 'p', 'br', 'a'],
        allowedAttributes: {
          img: ['*'],
          a: ['*']
        }
      }
    }
  },
  async fetch () {
    this.impressum = await this.$axios.get(`${impressumURL}`)
      .then(res => res.data)
      .catch((error) => {
        this.$sentry.captureException(new Error('About page not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'About page not available' })
      })
    if (this.impressum && this.impressum.featured_media !== 0) {
      this.impressumFeaturedImage = await this.$axios.get(mediaURL + `/${this.impressum.featured_media}`)
        .then(res => res.data)
        .catch((error) => {
          this.$sentry.captureException(new Error('Impressum Image not available ', error))
          this.$nuxt.error({ statusCode: 404, message: 'Impressum Image not available' })
        })
    }
  },
  head () {
    return {
      title: 'Lahmacun Impressum',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Read about Lahmacun '
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Impressum'
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
    impressumResults () {
      if (!this.impressum) {
        return false
      }
      return this.impressum.content.rendered
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
