<template>
  <div>
    <SubTitle title="Lahmacun Impressum" :maintitle="true" />
    <div id="about-page-content" class="container mt-8">
      <div v-if="pending" class="py-8 center w-100">Loading...</div>
      <div v-if="error" class="py-8 center w-100">Some error happened...</div>
      <div v-if="impressum" class="md:flex">
        <div v-if="impressumFeaturedImage" class="mb-4 md:mr-8 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
          <img :src="impressumFeaturedImage.source_url" alt="Lahmacun Impressum" />
        </div>
        <div v-dompurify-html="{ html: impressumResults, options: sanitizeOptions }" class="text-content" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAsyncData, useNuxtApp } from '#app'
import { computed } from 'vue'
import { impressumURL, mediaURL } from '~/constants'

const sanitizeOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'img', 'figcaption', 'p', 'br', 'a'],
  allowedAttributes: { img: ['*'], a: ['*'] }
}

const { $axios, $sentry } = useNuxtApp()

const { data: impressum, pending, error } = await useAsyncData('impressum', async () => {
  try {
    const res = await $axios.get(impressumURL)
    return res.data
  } catch (e) {
    $sentry?.captureException(new Error('About page not available', { cause: e }))
    throw e
  }
})

const { data: impressumFeaturedImage } = await useAsyncData(
  'impressum-featured-image',
  async () => {
    if (!impressum.value || impressum.value.featured_media === 0) return null
    try {
      const res = await $axios.get(`${mediaURL}/${impressum.value.featured_media}`)
      return res.data
    } catch (e) {
      $sentry?.captureException(new Error('Impressum Image not available', { cause: e }))
      return null
    }
  }
)

const impressumResults = computed(() => impressum.value?.content?.rendered || '')

useHead(() => ({
  title: 'Lahmacun Impressum',
  meta: [
    { hid: 'description', name: 'description', content: 'Read about Lahmacun ' },
    { hid: 'og:title', property: 'og:title', content: 'Lahmacun Impressum' },
    { hid: 'og:description', name: 'og:description', content: 'Read about Lahmacun' }
  ]
}))
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
