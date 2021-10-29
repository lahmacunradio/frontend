<template>
  <div class="container">
    <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-8">
      <img src="/img/preloader.svg" class="h-8 mb-2">
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
          <GalleryPictureItem :photo="photo" />
        </div>
      </div>
    </div>
    <div v-if="$fetchState.error" class="py-32 text-center">
      Error happened
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
        console.error('Error:', error)
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
