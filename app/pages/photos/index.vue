<template>
  <div>
    <SubTitle title="Lahmacun Photos" :maintitle="true" />
    <div class="container mb-8">
      <div v-if="pending" class="flex flex-col items-center justify-center py-8">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload" />
        <p>Loading...</p>
      </div>
      <div v-else class="relative grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 galleries-container">
        <div v-for="(gallery, i) in photoGalleries" :key="i" class="gallery">
          <GalleryListItem :gallery="gallery" />
        </div>
      </div>
      <div v-if="error" class="py-32 text-center">
        Error happened
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAsyncData, useNuxtApp } from '#app'
import { computed } from 'vue'
import { lahmaGaleriesURL } from '~/constants'

const { $axios, $sentry } = useNuxtApp()

const { data: photoGalleries, pending, error } = await useAsyncData('photo-galleries', async () => {
  try {
    const res = await $axios.get(`${lahmaGaleriesURL}?per_page=100`)
    return res.data || []
  } catch (e) {
    $sentry?.captureException(new Error('Photo Galleries not found', { cause: e }))
    throw e
  }
})

const metaImage = computed(() => photoGalleries.value?.[0]?.acf?.gallery?.[0]?.thumbnail_image_url)

useHead(() => ({
  title: 'Lahmacun Photos',
  meta: [
    { hid: 'description', name: 'description', content: 'Photos from Lahmacun everydays' },
    { hid: 'og:title', property: 'og:title', content: 'Lahmacun Photos' },
    { hid: 'og:description', name: 'og:description', content: 'Photos from Lahmacun everydays' },
    { hid: 'og:image', property: 'og:image', content: metaImage.value }
  ]
}))
</script>

<style></style>
