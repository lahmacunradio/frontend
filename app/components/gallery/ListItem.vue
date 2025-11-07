<template>
  <div class="aspect-ratio-1/1">
    <NuxtLink :to="gallery.slug" class="relative gallery-preview preload-block">
      <img :src="previewImageSrc" :srcset="previewImageSrcset" :alt="htmlDecoder(gallery.title.rendered)">
      <div class="absolute bottom-0 flex flex-col justify-end w-full text-center text-white gallery-title">
        <h3 class="text-lg">
          {{ htmlDecoder(gallery.title.rendered) }}
        </h3>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { mediaURL } from '~/constants'
import { computed } from 'vue'
import { useAsyncData, useNuxtApp } from '#imports'

const props = defineProps({
  gallery: {
    type: Object,
    required: true
  }
})

const featuredImageId = computed(() => {
  if (!props.gallery || props.gallery.featured_media === 0) return false
  return props.gallery.featured_media
})

const { $axios, $sentry } = useNuxtApp()

const { data: featuredImage } = await useAsyncData(
  () => featuredImageId.value ? `gallery-featured:${featuredImageId.value}` : `gallery-featured:none:${props.gallery.slug}`,
  async () => {
    if (!featuredImageId.value) return null
    try {
      const res = await $axios.get(`${mediaURL}/${featuredImageId.value}`)
      return res.data
    } catch (e) {
      $sentry?.captureException(new Error('Featured Image not found ', { cause: e }))
      return null
    }
  }
)

const previewImageSrc = computed(() => {
  if (featuredImage.value) return featuredImage.value.source_url
  return props.gallery.acf.gallery[0].full_image_url
})

const previewImageSrcset = computed(() => {
  if (featuredImage.value) {
    return `${featuredImage.value?.media_details?.sizes?.medium?.source_url} 768w, ${featuredImage.value?.media_details?.sizes?.large?.source_url} 1024w, ${featuredImage.value?.media_details?.sizes?.full?.source_url} 1458w`
  }
  return props.gallery.acf.gallery[0].medium_srcset
})
</script>

<style lang="scss" scoped>
.gallery-preview {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-content: center;
    img {
      object-fit: cover;
      min-width: 100%;
      min-height: 100%;
    }
    .gallery-title {
      background: rgb(0,0,0);
      background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
      height: 5rem;
    }
}
</style>
