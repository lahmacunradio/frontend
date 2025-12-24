<template>
  <div>
    <SubTitle title="Lahmacun News" url="/news/" />
    <div class="container mt-8">
      <div v-if="pending" class="flex flex-col items-center justify-center py-4">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload" />
        <p>Loading...</p>
      </div>
      <div v-if="error" class="py-8 text-center">Error happened</div>
      <NewsFull v-if="selectedNews" :news="selectedNews" @getimage="getImage" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAsyncData, useNuxtApp, useRoute } from '#app'
import { contentApiURL } from '~/constants'
import { htmlDecoder, stripHTMLTags, truncate } from '~/plugins/mixinCommonMethods.js'

const route = useRoute()
const { $axios, $sentry } = useNuxtApp()

const { data: selectedNews, pending, error } = await useAsyncData(
  () => `news-${route.params.slug}`,
  async () => {
    try {
      const res = await $axios.get(`${contentApiURL}/posts?slug=${route.params.slug}`)
      return res.data?.[0]
    } catch (e) {
      $sentry?.captureException(new Error('News not found', { cause: e }))
      throw e
    }
  }
)

const metaImage = ref('@/assets/lahmacun-logo-dummy.png')

const metaDescription = computed(() => {
  if (!selectedNews.value) return ''
  const shortenMeta = stripHTMLTags(selectedNews.value?.excerpt?.rendered)
  return truncate(shortenMeta, 150)
})

const metaOgImage = computed(() => {
  if (!selectedNews.value) return metaImage.value
  return selectedNews.value?.acf?.ogimage || metaImage.value
})

function getImage(image) {
  metaImage.value = image
}

useHead(() => ({
  title: htmlDecoder(selectedNews.value?.title?.rendered || ''),
  meta: [
    { hid: 'description', name: 'description', content: metaDescription.value },
    { hid: 'og:title', property: 'og:title', content: htmlDecoder(selectedNews.value?.title?.rendered || '') },
    { hid: 'og:description', name: 'og:description', content: metaDescription.value },
    { hid: 'og:image', property: 'og:image', content: metaOgImage.value }
  ]
}))
</script>
