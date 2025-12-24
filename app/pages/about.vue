<template>
  <div>
    <SubTitle title="About Lahmacun" />
    <div id="about-page-content" class="container mt-8">
      <div v-if="pending" class="py-8 center w-100">Loading...</div>
      <div v-if="error" class="py-8 center w-100">Some error happened...</div>
      <div v-if="aboutUs">
        <div v-dompurify-html="{ html: aboutUsResults, options: sanitizeOptions }" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAsyncData, useNuxtApp } from '#app'
import { aboutUsURL } from '~/constants'

const sanitizeOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'img', 'figcaption', 'p'],
  allowedAttributes: { img: ['*'], div: ['style', 'class', 'id'], a: ['*'] }
}

const { $axios, $sentry } = useNuxtApp()
const { data: aboutUs, pending, error } = await useAsyncData('about-us', async () => {
  try {
    const res = await $axios.get(aboutUsURL)
    return res.data
  } catch (e) {
    $sentry?.captureException(new Error('About page not available', { cause: e }))
    throw e
  }
})

const aboutUsResults = computed(() => aboutUs.value?.content?.rendered || '')

useHead(() => ({
  title: 'About Lahmacun',
  meta: [
    { hid: 'description', name: 'description', content: 'Read about Lahmacun ' },
    { hid: 'og:title', property: 'og:title', content: 'About Lahmacun' },
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
