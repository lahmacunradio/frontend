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
        <div class="block mt-6">
          <a id="checkout-button" :href="$config.public.subscriptionCancelUrl" target="_blank">Yes, cancel my donation</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAsyncData, useNuxtApp } from '#app'
import { donateStripeCancelURL } from '~/constants'

const sanitizeOptions = {
  allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br', 'a'],
  allowedAttributes: { a: ['*'], img: ['*'], div: ['style', 'class', 'id'], form: ['*'], input: ['*'] }
}

const { $axios, $sentry, $config } = useNuxtApp()
const { data: donateContent, pending, error } = await useAsyncData('donate-cancel', async () => {
  try {
    const res = await $axios.get(donateStripeCancelURL)
    return res?.data
  } catch (e) {
    $sentry?.captureException(new Error('Donate not available', { cause: e }))
    throw e
  }
})

useHead(() => ({
  title: 'Cancel Lahmacun Donate',
  meta: [
    { hid: 'og:title', property: 'og:title', content: 'Cancel Lahmacun Donate' }
  ]
}))
</script>

<style lang="scss" scoped>
#checkout-button { background-color: #000; color: #fff; font-weight: 700; padding: 0.5rem 1rem; border-radius: 0.125rem; cursor: pointer; }
#checkout-button:hover { background-color: #1f2937; }
p a { text-decoration: underline; }
</style>
