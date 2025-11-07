<template>
  <div>
    <SubTitle title="Lahmacun News" />
    <section class="container mt-8">
      <header class="mb-8">
        <h1>News tags</h1>
      </header>
      <div v-if="pending" class="flex flex-col items-center justify-center py-4">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
        <p>Loading...</p>
      </div>
      <div v-if="error" class="py-8 text-center">
        Error happened
      </div>
      <div v-if="allTagsList.value.length" class="tags mb-8">
        <div v-for="(tag, index) in allTagsList" :key="index + tag.id" class="inline-block">
          <NuxtLink :to="`/news/tags/${tag.slug}`" class="tag-block">
            {{ tag.name }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAsyncData, useNuxtApp } from '#app'
import { newsBaseURL, tagsURL } from '~/constants'

const { $axios, $sentry } = useNuxtApp()

const { data: recentNews, pending, error } = await useAsyncData('recent-news', async () => {
  try {
    const res = await $axios.get(`${newsBaseURL}&per_page=100`)
    return res.data || []
  } catch (e) {
    $sentry?.captureException(new Error('News not found', { cause: e }))
    throw e
  }
})

const allTags = computed(() => {
  const list = Array.isArray(recentNews.value) ? recentNews.value : []
  const hasTags = list.filter(item => Array.isArray(item.tags) && item.tags.length)
  return [...new Set(hasTags.flatMap(item => item.tags))]
})

const allTagsList = ref([])

if (allTags.value?.length) {
  try {
    const res = await $axios.get(`${tagsURL}?include=${allTags.value.toString()}&per_page=100`)
    allTagsList.value = res.data || []
  } catch (e) {
    $sentry?.captureException(new Error('Tags not found', { cause: e }))
  }
}

useHead(() => ({
  title: 'Lahmacun News Tags',
  meta: [
    { hid: 'description', name: 'description', content: 'Post tags for Lahmacun News' },
    { hid: 'og:title', property: 'og:title', content: 'Lahmacun News Tags' },
    { hid: 'og:description', name: 'og:description', content: 'Post tags for Lahmacun News' }
  ]
}))
</script>
