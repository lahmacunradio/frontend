<template>
  <div class="container">
    <h1>Photos</h1>
    <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-8">
      <img src="/img/preloader.svg" class="h-8 mb-2">
      <p>Loading...</p>
    </div>
    <div v-else class="relative gap-4 py-8 md:grid-cols-2 lg:grid-cols-3 md:grid galleries-container">
      <div v-for="(gallery, i) in photoGalleries" :key="i" class="gallery">
        <GalleryListItem :gallery="gallery" />
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
      photoGalleries: null
    }
  },
  async fetch () {
    this.photoGalleries = await this.$axios.get(`${lahmaGaleriesURL}`)
      .then(res => res.data)
      .catch((error) => {
        console.error('Error:', error)
      })
  }
}
</script>

<style>

</style>
