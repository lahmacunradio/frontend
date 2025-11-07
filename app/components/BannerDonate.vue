<template>
  <div v-if="donateContent && donateContent.enabled && donateIsVisible">
    <div class="donate-banner">
      <div v-dompurify-html="{ html: donateContent.banner_text, options: sanitizeOptions }" />
      <button v-if="donateContent.button.show_button" class="donate-banner-button">
        <a :href="donateContent.button.button_link">
          {{ donateContent.button.button_text }}
        </a>
      </button>
      <div class="absolute top-0 right-0 pr-4 text-xl cursor-pointer" @click="closeBanner()">
        x
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAsyncData, useNuxtApp } from '#app'
import { donateBannerURL } from '~/constants'

const sanitizeOptions = {
  allowedTags: ['a', 'p', 'b', 'i', 'em', 'strong', 'img', 'br'],
  allowedAttributes: { a: ['*'], img: ['*'] }
}

const donateIsVisible = ref(true)
const { $axios, $sentry } = useNuxtApp()
const { data: donateContent, pending, error } = await useAsyncData('donate-banner', async () => {
  try {
    const res = await $axios.get(donateBannerURL)
    return res?.data?.acf
  } catch (e) {
    $sentry?.captureException(new Error('Donate banner not available', { cause: e }))
    throw e
  }
})

function closeBanner() { donateIsVisible.value = false }
</script>

<style lang="scss" scoped>

</style>
