<template>
  <div>
    <SubTitle title="Lahmacun Photos" :maintitle="true" />
    <div class="container mb-8">
      <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-8">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
        <p>Loading...</p>
      </div>
      <div v-else class="relative grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 galleries-container">
        <div v-for="(gallery, i) in photoGalleries" :key="i" class="gallery">
          <GalleryListItem :gallery="gallery" />
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
      photoGalleries: null
    }
  },
  async fetch () {
    this.photoGalleries = await this.$axios.get(`${lahmaGaleriesURL}?per_page=100`)
      .then(res => res.data)
      .catch((error) => {
        this.$sentry.captureException(new Error('Photo Galleries not found ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Photos not reachable' })
      })
  },
  head () {
    return {
      title: 'Lahmacun Photos',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Photos from Lahmacun everydays'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Photos'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Photos from Lahmacun everydays'
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
    metaImage () {
      return this.photoGalleries?.[0].acf.gallery?.[0].thumbnail_image_url
    }
  }
}
</script>

<style>

</style>
