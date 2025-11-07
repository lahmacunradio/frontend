<template>
  <div>
    <SubTitle title="Lahmacun Archive" url="/archive" />
    <div class="container mt-8">
      <div v-if="arcsiEpisode">
        <NuxtLink :to="`/shows/${slug}`" class="block">
          <div class="pb-6">
            <i class="fa fa-toggle-left" aria-hidden="true" /> Back to <b>{{ showTitle }}</b>
          </div>
        </NuxtLink>
        <div class="flex-row sm:flex">
          <div class="mb-4 sm:w-128 xsm:mr-8 show-image">
            <a class="cursor-pointer" @click="arcsiItemShadowbox = !arcsiItemShadowbox">
              <img :src="episodeImage" :alt="arcsiEpisode.name">
              <Modal :media="episodeImage" :title="arcsiEpisode.name" :description="arcsiEpisode.description"
                :visibility="arcsiItemShadowbox" />
            </a>
            <div v-if="episodeTags?.length" class="flex items-center mt-6 tags flex-wrap">
              <div v-for="(tag, index) in episodeTags" :key="index + tag.id + tag.clean_name" class="inline-block">
                <div v-if="tag.clean_name.length > 0" class="tag-block">
                  <NuxtLink :to="`/tag/${tag.clean_name}`">
                    {{ tag.display_name }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-4 show-description">
            <h1 class="h3">
              {{ fullEpisodeTitle || arcsiEpisode.name }}
            </h1>
            <div class="episode-infos">
              <p v-if="arcsiEpisode.play_date">
                Episode Nr. {{ arcsiEpisode.number }},
                Original air date:
                {{ airDate }}
                Language: <span v-dompurify-html.nothing="getLanguageGraph(arcsiEpisode.language)" class="language" />
              </p>
            </div>

            <div v-if="arcsiShow" class="show-infos">
              <p>
                {{ arcsiShow.active ? 'Show is active.' : 'Show is not active.' }}
                Airing time: {{ dayNames[arcsiShow.day - 1] }} {{
                  removeSeconds(arcsiShow.start)
                }}–{{ removeSeconds(arcsiShow.end) }}, {{ showFrequency(arcsiShow.frequency, arcsiShow.week) }}.
              </p>
            </div>

            <div v-dompurify-html="{ html: arcsiEpisode.description, options: sanitizeOptions }" />

            <div v-if="arcsiEpisode.play_file_name" class="py-4">
              <client-only>
                <div v-if="arcsiCurrentEpisode.id === arcsiEpisode.id">
                  <i>Episode is now in the Arcsi player...</i>
                </div>
                <div v-else>
                  <a v-if="fullEpisodeTitle" href="#" class="cursor-pointer" @click.prevent="playArcsi()">
                    <i class="fa fa-play" aria-hidden="true" /> Play {{ fullEpisodeTitle }}
                  </a>
                </div>
              </client-only>
            </div>
          </div>
        </div>
      </div>
      <div v-if="arcsiShow && arcsiEpisodesList && arcsiEpisodesList.length" class="py-8">
        <h4 class="pb-1 mb-4 text-center border-b border-current">
          Other Episodes from {{ arcsiShow.name }}
        </h4>
        <div class="pt-4 pb-6 text-center change-order xsm:text-right">
          <a id="bydate" ref="bydate" href="#" :class="['mr-2', 'change-order-button', sortingType === 'air' ? 'selected' : '']" @click.prevent="sortAirtime">
            <i v-if="airtimeAsc" class="fa fa-sort-numeric-desc" aria-hidden="true" />
            <i v-else class="fa fa-sort-numeric-asc" aria-hidden="true" />
            Order by Air time
          </a>
          <a id="alphabetical" ref="alphabetical" :class="['change-order-button', sortingType === 'abc' ? 'selected' : '']" href="#" @click.prevent="sortAlphabeticaly">
            <i v-if="alphabeticAsc" class="fa fa-sort-alpha-asc" aria-hidden="true" />
            <i v-else class="fa fa-sort-alpha-desc" aria-hidden="true" />
            Order by Title
          </a>
        </div>
        <div class="grid gap-8 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="arcsi in arcsiEpisodesList" :key="arcsi.id">
            <div>
              <NuxtLink class="block overflow-hidden aspect-ratio-1/1"
                :to="{ path: `/shows/${slug}/${arcsi.name_slug}` }">
                <img :src="mediaServerURL + slug + '/' + arcsi.image_url" alt="" class="my-2 image-fit">
              </NuxtLink>
              <NuxtLink :to="{ path: `/shows/${slug}/${arcsi.name_slug}` }">
                <h5 class="mt-4">
                  {{ arcsi.name }}
                </h5>
              </NuxtLink>
              <small>Play date: {{ $date(arcsi.play_date).format('yyyy. MMMM Do.') }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAsyncData, useHead, useRoute, useNuxtApp } from '#app'
import { arcsiBaseURL, mediaServerURL, config } from '~/constants'
import { usePlayerStore } from '~/stores/player'
import { useArcsiSorting } from '@/composables/useArcsiSorting'

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const arcsiItemShadowbox = ref(false)
const route = useRoute()
const slug = computed(() => route.params.slug)
const id = computed(() => route.params.id)
const player = usePlayerStore()
const { $axios, $sentry, $date } = useNuxtApp()

const sanitizeOptions = {
  allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'b', 'i', 'em', 'strong', 'img', 'figure', 'hr', 'br', 'a', 'sup', 'sub', 'iframe'],
  allowedAttributes: { img: ['*'], iframe: ['*'], a: ['*'] }
}

// Fetch episode with fallback to legacy URL when 404
const { data: episodeData } = await useAsyncData(
  () => `arcsi-episode:${slug.value}:${id.value}`,
  async () => {
    try {
      const res = await $axios.get(`${arcsiBaseURL}/show/${slug.value}/item/${id.value}`, config)
      return res.data
    } catch (error) {
      if (error?.response?.status === 404) {
        const res = await $axios.get(`${arcsiBaseURL}/item/${id.value}`, config)
        return res.data
      }
      if ($sentry) { $sentry.captureException(new Error('Arcsi server not available')) }
      throw error
    }
  }
)

const arcsiEpisode = computed(() => episodeData.value || null)

// Fetch show page
const { data: showData } = await useAsyncData(
  () => `arcsi-show:${slug.value}`,
  async () => {
    const res = await $axios.get(`${arcsiBaseURL}/show/${slug.value}/page?filter=archived`, config)
    return res.data
  }
)
const arcsiShow = computed(() => showData.value || null)

const arcsiCurrentEpisode = computed(() => player ? player.getArcsiEpisode : null)

const showTitle = computed(() => {
  if (!arcsiEpisode.value) return 'Show'
  return arcsiEpisode.value?.shows?.[0].name
})

const fullEpisodeTitle = computed(() => {
  if (!arcsiEpisode.value) return 'Arcsi Episode'
  return `${arcsiEpisode.value?.shows?.[0].name} - ${arcsiEpisode.value?.name}`
})

const airDate = computed(() => {
  if (!arcsiEpisode.value?.play_date) return ''
  return $date(arcsiEpisode.value.play_date).format('yyyy. MMMM Do.')
})

const episodeImage = computed(() => arcsiEpisode.value?.image_url)

const metaDescription = computed(() => {
  if (!arcsiEpisode.value?.description) {
    return `Aired on ${airDate.value}`
  }
  return truncate(arcsiEpisode.value?.description, 150)
})

// Reuse sorting composable and exclude current episode
const { sorted: arcsiEpisodesList, sortingType, alphabeticAsc, airtimeAsc, sortAlphabeticaly, sortAirtime } = useArcsiSorting(
  computed(() => arcsiShow.value?.items || []),
  { excludeId: computed(() => arcsiEpisode.value?.id) }
)

const episodeTags = computed(() => {
  if (!arcsiEpisode.value?.tags) return false
  return arcsiEpisode.value?.tags.filter(tag => tag.display_name.length > 0)
})

function playArcsi () {
  if (player && arcsiEpisode.value) {
    player.setIsArcsiPlaying(true)
    player.setIsArcsiVisible(true)
    player.setCurrentlyPlayingArcsi(arcsiEpisode.value)
  }
}

// handlers provided by composable

useHead({
  title: fullEpisodeTitle,
  meta: [
    { hid: 'description', name: 'description', content: metaDescription },
    { hid: 'og:title', property: 'og:title', content: fullEpisodeTitle },
    { hid: 'og:description', name: 'og:description', content: metaDescription },
    { hid: 'og:image', property: 'og:image', content: episodeImage }
  ]
})
</script>

<style lang="scss" scoped>
.show-image {
  min-width: 300px;
  max-width: 360px;
}

.show-infos {
  margin-bottom: 1rem;
}

.language {
  display: inline-block;
  vertical-align: middle;
}

.change-order-button {
  border: 1px solid #775a8f;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  white-space: nowrap;

  &.selected,
  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }

  @media (max-width: $mobile-width) {
    font-size: 0.875rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
