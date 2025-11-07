<template>
  <div>
    <SubTitle title="Lahmacun Photos" url="/photos/" />
    <div class="container my-8">
      <div v-if="pending" class="flex flex-col items-center justify-center py-8">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload" />
        <p>Loading...</p>
      </div>
      <div v-else>
        <NuxtLink :to="`/photos/`">
          <div class="pb-4">
            <i class="fa fa-toggle-left" aria-hidden="true" /> Back to Photos
          </div>
        </NuxtLink>
        <h1 class="mb-4">{{ htmlDecoder(photoGallery?.title?.rendered) }}</h1>
        <div v-dompurify-html="photoGallery?.content?.rendered" />
        <div class="gap-8 my-8 md:grid-cols-2 lg:grid-cols-4 md:grid gallery-items">
          <div v-for="(photo, i) in photoGallery?.acf?.gallery" :key="i">
            <GalleryPictureItem :photo="photo" :gallery="photoGallery?.acf?.gallery" :gallery-position="i" />
          </div>
        </div>
      </div>
      <div v-if="error" class="py-32 text-center">Error happened</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAsyncData, useNuxtApp, useRoute } from '#app'
import { lahmaGaleriesURL } from '~/constants'
import { htmlDecoder, stripHTMLTags } from '~/plugins/mixinCommonMethods.js'

const route = useRoute()
const { $axios, $sentry } = useNuxtApp()

const { data: photoGallery, pending, error } = await useAsyncData(
  () => `photo-gallery-${route.params.slug}`,
  async () => {
    try {
      const res = await $axios.get(`${lahmaGaleriesURL}?slug=${route.params.slug}&per_page=100`)
      return res.data?.[0]
    } catch (e) {
      $sentry?.captureException(new Error('Photos not found', { cause: e }))
      throw e
    }
  }
)

const metaTitle = computed(() => (photoGallery.value ? htmlDecoder(photoGallery.value.title?.rendered) : ''))
const metaDescription = computed(() => {
  if (!photoGallery.value) return ''
  const content = photoGallery.value.content?.rendered
  return (content && stripHTMLTags(content)) || `${htmlDecoder(photoGallery.value.title?.rendered)} photos`
})
const metaImage = computed(() => photoGallery.value?.acf?.gallery?.[0]?.thumbnail_image_url)

useHead(() => ({
  title: metaTitle.value,
  meta: [
    { hid: 'description', name: 'description', content: metaDescription.value },
    { hid: 'og:title', property: 'og:title', content: metaTitle.value },
    { hid: 'og:description', name: 'og:description', content: metaDescription.value },
    { hid: 'og:image', property: 'og:image', content: metaImage.value }
  ]
}))
</script>

<style lang="scss" scoped>

</style>
