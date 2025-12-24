<template>
  <div>
    <SubTitle title="Lahmacun donate" :maintitle="true" />
    <div class="container my-8">
      <div v-if="pending" class="center">Loading...</div>

      <div v-if="donateContent" class="max-w-4xl">
        <div class="mb-4">
          <h2>{{ donateContent.title.rendered }}</h2>
        </div>
        <div v-dompurify-html="{ html: donateContent.content.rendered, options: sanitizeOptions }" />
        <div class="mt-4">
          <p>Cancel your subscription
            <NuxtLink to="/donate-cancel">
              here
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAsyncData, useNuxtApp } from '#app'
import { donateStripeThanksURL } from '~/constants'

const sanitizeOptions = {
  allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br', 'a'],
  allowedAttributes: { a: ['*'], img: ['*'], div: ['style', 'class', 'id'], form: ['*'], input: ['*'] }
}

const { $axios, $sentry } = useNuxtApp()
const { data: donateContent, pending, error } = await useAsyncData('donate-thanks', async () => {
  try {
    const res = await $axios.get(donateStripeThanksURL)
    return res?.data
  } catch (e) {
    $sentry?.captureException(new Error('Donate not available', { cause: e }))
    throw e
  }
})

useHead(() => ({
  title: 'Thank you for Lahmacun Donate',
  meta: [
    { hid: 'og:title', property: 'og:title', content: 'Thank you for Lahmacun Donate' }
  ]
}))
</script>

<style lang="scss" scoped>
p a { text-decoration: underline; }
</style>
