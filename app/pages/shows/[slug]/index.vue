<template>
  <div>
    <SubTitle title="Lahmacun Shows" url="/shows/" />
    <div v-if="pending" class="flex flex-col items-center justify-center py-8">
      <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
      <p>Loading...</p>
    </div>
    <div v-else-if="error" class="py-8 text-center">
      Error happened
    </div>
    <div v-else-if="showObject" class="container mt-10">
      <div class="flex-row sm:flex">
        <div class="mb-4 sm:w-128 xsm:mr-8 show-image">
          <a class="cursor-pointer" @click="shadowbox = !shadowbox">
            <img :src="showImage" :alt="showObject.name">
            <Modal :media="showImage" :title="showObject.name" :description="showObject.description"
              :visibility="shadowbox" />
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
          <h1 class="mt-0 font-bold h2">
            {{ showObject.name }}
          </h1>
          <div v-if="showObject.active" class="show-infos">
            <p>
              {{ dayNames[showObject.day - 1] }} {{
                removeSeconds(showObject.start)
              }}–{{ removeSeconds(showObject.end) }}
            </p>
            <p>
              {{ showFrequency(showObject.frequency, showObject.week, showObject.playlist_name) }}
            </p>
            <p>
              Language: <span v-dompurify-html.nothing="getLanguageGraph(showObject.language)" class="language" />
            </p>
            <p v-if="showObject.archive_mixcloud_base_url">
              Elsewhere on web:
              <!-- Quick fix: we (mis)use Mixcloud links (originally meant for another upload platform) as arbitrary external link. -->
              <!-- Note: link needs to be full path and it will be displayed! -->
              <a class="show-external-link" :href="showObject.archive_mixcloud_base_url" target="_blank">
                {{ showObject.archive_mixcloud_base_url }}
              </a>
            </p>
          </div>
          <!-- Inactive shows: currently hard-coded for more flexibility and readability -->
          <div v-else class="show-infos">
            <p>
              <strong>Show is not active</strong>
            </p>
            <p>
              Language: <span v-dompurify-html.nothing="getLanguageGraph(showObject.language)" class="language" />
            </p>
            <p v-if="showObject.archive_mixcloud_base_url">
              Elsewhere on web:
              <!-- Quick fix: we (mis)use Mixcloud links (originally meant for another upload platform) as arbitrary external link. -->
              <!-- Note: link needs to be full path and it will be displayed! -->
              <a class="show-external-link" :href="showObject.archive_mixcloud_base_url" target="_blank">
                {{ showObject.archive_mixcloud_base_url }}
              </a>
            </p>
          </div>
          <div v-dompurify-html="{ html: showObject.description, options: sanitizeOptions }" class="description-text" />
        </div>
      </div>
      <div v-if="arcsiEpisodesList && arcsiEpisodesList.length">
        <h3 class="pb-1 mb-4 text-center border-b border-current">
          Archived Shows
        </h3>
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
                <img :src="getEpisodeImage(arcsi)" alt="" class="my-2 image-fit">
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
import { arcsiBaseURL, config } from '~/constants'
import { useArcsiSorting } from '@/composables/useArcsiSorting'
// Bring in utilities otherwise available only via Options API mixin
import { truncate, stripHTMLTags } from '~/plugins/mixinCommonMethods'

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const shadowbox = ref(false)

const route = useRoute()

const sanitizeOptions = {
  allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'b', 'i', 'em', 'strong', 'img', 'figure', 'hr', 'br', 'a', 'sup', 'sub', 'iframe'],
  allowedAttributes: { img: ['*'], iframe: ['*'], a: ['*'] }
}

const { $axios, $sentry } = useNuxtApp()
const slug = computed(() => route.params.slug || '')

const { data, pending, error } = await useAsyncData(
  `arcsi-show:${slug.value}`,
  async () => {
    try {
      const res = await $axios.get(`${arcsiBaseURL}/show/${slug.value}/page?filter=archived`, config)
      return res.data
    } catch (e) {
      $sentry?.captureException(new Error('Show data not found', { cause: e }))
      return null // Do not throw, let Nuxt handle error state
    }
  }
)

const showObject = computed(() => data.value || null)

// Reuse sorting composable
const { sorted: arcsiEpisodesList, sortingType, alphabeticAsc, airtimeAsc, sortAlphabeticaly, sortAirtime } = useArcsiSorting(computed(() => showObject.value?.items || []))

const showImage = computed(() => {
  return showObject.value?.cover_image_url || ''
})

// Helper to get episode image with fallback to show cover
const getEpisodeImage = (episode) => {
  if (episode?.image_url && episode.image_url.length > 0) {
    return episode.image_url
  }
  return showObject.value?.cover_image_url || ''
}

const metaDescription = computed(() => {
  if (!showObject.value?.description) return ''
  // Strip HTML tags before truncating to avoid broken meta content
  const plain = stripHTMLTags(showObject.value?.description) || ''
  return truncate(plain, 150)
})

const episodeTags = computed(() => {
  if (!showObject.value?.tags) return false
  return showObject.value.tags
    .filter(tag => tag && tag.display_name && tag.display_name.length > 0)
    .sort((a, b) => (a?.clean_name || '').localeCompare(b?.clean_name || ''))
})

// handlers provided by composable

useHead({
  title: computed(() => showObject.value?.name || 'Lahmacun Shows'),
  meta: [
    { hid: 'description', name: 'description', content: metaDescription },
    { hid: 'og:title', property: 'og:title', content: computed(() => showObject.value?.name || '') },
    { hid: 'og:description', name: 'og:description', content: metaDescription },
    { hid: 'og:image', property: 'og:image', content: showImage }
  ]
})
</script>

<style lang="scss" scoped>
.show-external-link {
  text-decoration: underline;
}

.show-image {
  min-width: 300px;
  max-width: 360px;
}

.show-infos {
  margin-bottom: 1rem;
  font-style: italic;
}

.language {
  display: inline-block;
  vertical-align: middle;
}

.change-order-button {
  border: 1px solid #775a8f;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;

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
