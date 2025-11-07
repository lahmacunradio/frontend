<template>
  <div>
    <SubTitle title="All Lahmacun Tags" />
    <div v-if="pending" class="flex flex-col items-center justify-center py-8">
      <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload" />
      <p>Loading...</p>
    </div>
    <div v-if="error" class="py-8 text-center">Error happened</div>
    <div class="container">
      <div v-if="sortedTags.length" class="flex items-center mt-6 tags flex-wrap">
        <div v-for="(tag, index) in sortedTags" :key="index + tag.id + tag.clean_name" class="inline-block">
          <div v-if="tag.clean_name.length > 0" class="tag-block">
            <NuxtLink :to="`/tag/${tag.clean_name}`">{{ tag.display_name }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAsyncData, useNuxtApp } from '#app'
import { arcsiBaseURL, mediaServerURL, config } from '~/constants'

const { $axios, $sentry } = useNuxtApp()

const { data: tags, pending, error } = await useAsyncData('tags-all', async () => {
  try {
    const res = await $axios.get(arcsiBaseURL + '/tag/all', config)
    return res.data || []
  } catch (e) {
    $sentry?.captureException(new Error('Arcsi server not available', { cause: e }))
    throw e
  }
})

const sortedTags = computed(() => {
  const list = Array.isArray(tags.value) ? tags.value : []
  return [...list].sort((a, b) => a?.clean_name?.localeCompare(b?.clean_name))
})

// expose media server constant if template needs it later
const mediaServer = mediaServerURL
</script>

<style scoped></style>
