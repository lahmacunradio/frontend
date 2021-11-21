<template>
  <div>
    <h3 class="title-block">
      <NuxtLink :to="`/photos/`">
        Lahmacun Photos
      </NuxtLink>
    </h3>
    <div class="container my-8">
      <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-8">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2">
        <p>Loading...</p>
      </div>
      <div v-else>
        <NuxtLink :to="`/photos/`">
          <div class="pb-4">
            <i class="fa fa-toggle-left" aria-hidden="true" /> Back to Photos
          </div>
        </NuxtLink>
        <h1 class="mb-4">
          {{ htmlDecoder(photoGallery.title.rendered) }}
        </h1>
        <div v-sanitize="photoGallery.content.rendered" />
        <div class="gap-8 my-8 md:grid-cols-2 lg:grid-cols-4 md:grid gallery-items">
          <div v-for="(photo, i) in photoGallery.acf.gallery" :key="i">
            <GalleryPictureItem :photo="photo" :gallery="photoGallery.acf.gallery" :gallery-position="i" />
          </div>
        </div>
      </div>
      <div v-if="$fetchState.error" class="py-32 text-center">
        Error happened
      </div>
    </div>
  </div>
</template>

<script>
import { lahmaGaleriesURL } from '~/constants'

export default {
  data () {
    return {
      photoGallery: null
    }
  },
  async fetch () {
    this.photoGallery = await this.$axios.get(`${lahmaGaleriesURL}?slug=${this.$route.params.slug}`)
      .then(res => res.data[0])
      .catch((error) => {
        console.log(error)
        this.$sentry.captureException(new Error('Photos not found ', error))
        this.$nuxt.error({ statusCode: 500, message: 'Photos not available' })
      })
  },
  head () {
    return {
      title: this.metaTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.metaDescription
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.metaTitle
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.metaDescription
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.metaImage
        }
      ]
    }
  },
  computed: {
    metaTitle () {
      if (!this.photoGallery) {
        return false
      }
      return this.htmlDecoder(this.photoGallery.title.rendered)
    },
    metaDescription () {
      if (!this.photoGallery) {
        return false
      }
      return (this.photoGallery.content.rendered && this.stripHTMLTags(this.photoGallery.content.rendered)) || this.htmlDecoder(this.photoGallery.title.rendered) + ' photos'
    },
    metaImage () {
      if (!this.photoGallery) {
        return false
      }
      return this.photoGallery.acf.gallery?.[0].thumbnail_image_url
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
