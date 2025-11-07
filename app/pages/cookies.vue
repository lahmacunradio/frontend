<template>
  <div>
    <SubTitle title="Website cookies" :maintitle="true" />
    <div class="container my-8">
      <div v-if="pending" class="center">Loading...</div>
      <article id="cookies-page" ref="cookies">
        <div v-if="cookiesContent">
          <h2>{{ cookiesContent.title.rendered }}</h2>
          <span v-dompurify-html.nothing="cookiesContentResults" />
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAsyncData, useNuxtApp } from '#app'
import { cookiesPageURL } from '~/constants'

const { $axios, $sentry } = useNuxtApp()
const { data: cookiesContent, pending, error } = await useAsyncData('cookies-content', async () => {
  try {
    const res = await $axios.get(cookiesPageURL)
    return res?.data
  } catch (e) {
    $sentry?.captureException(new Error('Cookies page info not available', { cause: e }))
    throw e
  }
})

const cookiesContentResults = computed(() => {
  const html = cookiesContent.value?.content?.rendered
  if (!html) return 'No content'
  return html.replace(/target="_top"/g, 'target="_blank"')
})

useHead(() => ({
  title: 'Lahmacun radio - Cookies',
  meta: [
    { hid: 'description', name: 'description', content: 'Lahmacun radio - Cookie policy' },
    { hid: 'og:title', property: 'og:title', content: 'Lahmacun radio - Cookies' },
    { hid: 'og:description', name: 'og:description', content: 'Lahmacun radio - Cookie policy' }
  ]
}))
</script>

<style lang="scss">
p, div.CookieDeclarationType {
    margin-bottom: 30px;
}
thead th {
    background-color: rgba(88, 88, 88, 0.2);
    text-transform: uppercase;
}
th {
    text-align: left;
}
td {
    border-bottom: 1px solid black;
    width: auto;
}
</style>
