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
      <div class="grid grid-cols-3 gap-4 my-8 gallery-items">
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
  }
}
</script>

<style lang="scss" scoped>

</style>
