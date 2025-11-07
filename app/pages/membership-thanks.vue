<template>
  <div>
    <SubTitle title="Lahmacun membership" :maintitle="true" />
    <div class="container my-8">
      <div v-if="pending" class="center">Loading...</div>

      <div v-if="membershipContent" class="max-w-4xl">
        <div class="mb-4">
          <h2>{{ membershipContent.title.rendered }}</h2>
        </div>
        <div v-dompurify-html="{ html: membershipContent.content.rendered, options: sanitizeOptions }" />
        <div class="mt-4">
          <p>Cancel your subscription <NuxtLink to="/membership-cancel">
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
import { membershipStripeThanksURL } from '~/constants'

const sanitizeOptions = {
  allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br', 'a'],
  allowedAttributes: { a: ['*'], img: ['*'], div: ['style', 'class', 'id'], form: ['*'], input: ['*'] }
}

const { $axios, $sentry } = useNuxtApp()
const { data: membershipContent, pending, error } = await useAsyncData('membership-thanks', async () => {
  try {
    const res = await $axios.get(membershipStripeThanksURL)
    return res?.data
  } catch (e) {
    $sentry?.captureException(new Error('Membership not available', { cause: e }))
    throw e
  }
})

useHead(() => ({
  title: 'Thank you for Lahmacun Membership',
  meta: [
    { hid: 'og:title', property: 'og:title', content: 'Thank you for Lahmacun Membership' }
  ]
}))
</script>

<style lang="scss" scoped>
p a { text-decoration: underline; }
</style>
