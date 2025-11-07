<template>
  <div>
    <section class="grid-cols-2 mb-16 md:grid home-top">
      <div class="bg-white">
        <!-- News loading / error / content states -->
        <div v-if="newsPending" class="p-8 text-center text-gray-500">Loading news...</div>
        <div v-else-if="newsError" class="p-8 text-center text-red-500">Failed to load news</div>
        <NewsHome
          v-else-if="sortedNews.length > 0"
          :news="sortedNews[newsStart]"
          @changenews="changeIt($event)"
        />
        <div v-else class="p-8 text-center text-gray-500">No news available</div>
      </div>
      <div>
        <client-only>
          <div v-if="!fullSchedule || fullSchedule.length === 0" class="p-8 text-center text-gray-500">Loading schedule...</div>
          <ScheduleHome v-else :shows="sortShowsForSchedule" />
        </client-only>
      </div>
    </section>
    <article>
      <ArcsiLatest />
    </article>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAsyncData, useNuxtApp } from '#app'
import { newsURL } from '~/constants'
import { useArcsiStore } from '~/stores/arcsi'

// Pinia store
const arcsi = useArcsiStore()

// pagination state
const newsLimit = 9
const newsStart = ref(0)

// Fetch news using Nuxt 3 useAsyncData + axios plugin
const { $axios, error: nuxtError } = useNuxtApp()
const { data: newsList, pending: newsPending, error: newsError } = await useAsyncData('news-list', async () => {
  try {
    const res = await $axios.get(newsURL)
    return res.data || []
  } catch (e) {
    // propagate so newsError is set
    throw e
  }
})

// Derived slices & sorts
const limitedNews = computed(() => {
  const list = Array.isArray(newsList.value) ? newsList.value : []
  return newsLimit ? list.slice(0, newsLimit) : list
})

const sortedNews = computed(() => {
  const list = limitedNews.value
  return [...list]
    .filter(n => n && n.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Schedule related computed
const fullSchedule = computed(() => arcsi.returnArcsiShows)
const sortShowsForSchedule = computed(() => {
  const shows = Array.isArray(fullSchedule.value) ? fullSchedule.value : []
  return [...shows]
    .filter(s => s && s.day != null && s.start)
    .sort((a, b) => Number(a.day) - Number(b.day))
    .sort((a, b) => parseInt(String(a.start).replace(':', ''), 10) - parseInt(String(b.start).replace(':', ''), 10))
})

function changeIt (direction) {
  if (newsStart.value === 0 && direction === 'previous') {
    newsStart.value = newsLimit - 1
  } else if (direction === 'next' && newsStart.value === newsLimit - 1) {
    newsStart.value = 0
  } else if (direction === 'previous') {
    newsStart.value--
  } else if (direction === 'next') {
    newsStart.value++
  }
}
</script>

<style lang="scss" scoped>
.home-top {
  margin-bottom: 0;
}
h3 {
  margin-bottom: 1rem;
}
</style>
