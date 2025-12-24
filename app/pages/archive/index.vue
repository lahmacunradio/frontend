<template>
  <div>
    <SubTitle title="Lahmacun Archive" :maintitle="true" />
    <div class="container mt-8">
      <input v-model="term" class="input" type="search" placeholder="Search">

      <div v-if="pending" class="flex flex-col items-center justify-center py-4">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
        <p>Loading...</p>
      </div>
      <div v-if="error" class="py-8 text-center">
        Error happened
      </div>

      <article class="grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <div v-for="(episode, i) in arcsiEpisodesListSortedLatest" :key="episode.id || i">
          <ArcsiEpisodeBlock :episode="episode" :arcsilist="arcsiList" />
        </div>
      </article>
      <div id="loadmore" class="p-4 text-center">
        <a href="#" @click.prevent="loadMoreEpisodes">
          <b>Load {{ startNumberofEpisodes }} more episodes</b>
          <br>
          (showing {{ arcsiEpisodesListSortedLatest.length }} episodes)
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { arcsiItemBaseURL, config } from '~/constants'
import { useArcsiStore } from '~/stores/arcsi'

const arcsi = useArcsiStore()

const startIndex = ref(1)
const startNumberofEpisodes = 12
const term = ref('')

const { $axios, $sentry } = useNuxtApp()

const arcsiEpisodes = ref([])
const pending = ref(false)
const error = ref(null)

const fetchEpisodes = async () => {
  pending.value = true
  error.value = null
  try {
    const data = await $axios.$get(`${arcsiItemBaseURL}/search?size=${startNumberofEpisodes}&page=${startIndex.value}&param=${term.value}`, config)

    if (Array.isArray(data)) {
      if (startIndex.value === 1) {
        arcsiEpisodes.value = data
      } else {
        arcsiEpisodes.value = [...arcsiEpisodes.value, ...data]
      }
    } else {
      console.warn('Arcsi Archive: Data is not an array', data)
      if (startIndex.value === 1) arcsiEpisodes.value = []
    }
  } catch (e) {
    console.error('Arcsi Archive Error:', e)
    error.value = e
    $sentry?.captureException(new Error('Arcsi is not available at the moment', { cause: e }))
  } finally {
    pending.value = false
  }
}

const getToday = computed(() => {
  const d = new Date()
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
  const day = d.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })
  return `${year}-${month}-${day}`
})

const arcsiEpisodesListSortedLatest = computed(() => {
  const list = Array.isArray(arcsiEpisodes.value) ? [...arcsiEpisodes.value] : []
  // Remove duplicates based on episode id
  const uniqueList = list.filter((item, index, self) =>
    index === self.findIndex(t => t.id === item.id)
  )
  return uniqueList
    .filter(item => item.play_date < getToday.value)
    .filter(item => item.archived === true)
    .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
})

const arcsiList = computed(() => [...(arcsi?.returnArcsiShows || [])])

onMounted(() => {
  fetchEpisodes()
})

watch(term, () => {
  startIndex.value = 1
  fetchEpisodes()
})

async function loadMoreEpisodes() {
  startIndex.value++
  await fetchEpisodes()
}


useHead(() => ({
  title: 'Lahmacun Archive',
  meta: [
    { hid: 'description', name: 'description', content: 'All Lahmacun episodes' },
    { hid: 'og:title', property: 'og:title', content: 'Lahmacun Archive' },
    { hid: 'og:description', name: 'og:description', content: 'All Lahmacun episodes' }
  ]
}))
</script>

<style lang="scss" scoped>
.input {
  position: relative;
  width: 350px;

  @media (max-width: $mobile-width) {
    width: 100%;
  }

  height: 30px;
  border-radius: 0.25rem;
  outline: none;
  padding: 0 10px;
}
</style>
