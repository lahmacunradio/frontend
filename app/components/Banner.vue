<template>
  <div>
    <div v-if="!isRemembered">
      <div class="lahma-banner">
        <div class="flex flex-nowrap whitespace-nowrap px-4 py-2 items-center gap-2">
          <div class="w-4 h-4">
            <IconCookie />
          </div>
          <div class="h-6" v-dompurify-html="{ html: bannerText_computed, options: sanitizeOptions }" />
          <button @click="dismiss_remember">OK</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAsyncData, useNuxtApp } from '#app'
import { bannerTextURL } from '~/constants'

const sanitizeOptions = {
  allowedTags: ['div', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br', 'a'],
  allowedAttributes: { a: ['*'], img: ['*'], div: ['style', 'class', 'id'], form: ['*'], input: ['*'] }
}

const isRemembered = ref(false)
const { $axios, $sentry } = useNuxtApp()
const { data: bannertext_fetched, pending, error } = await useAsyncData('banner-text', async () => {
  try {
    const res = await $axios.get(bannerTextURL)
    return res?.data
  } catch (e) {
    $sentry?.captureException(new Error('Banner text not available from CMS', { cause: e }))
    throw e
  }
})

const bannerText_computed = computed(() => {
  if (error.value) return 'Banner temporarily unavailable'
  if (!bannertext_fetched.value?.content?.rendered) return 'No banner text content'
  return bannertext_fetched.value.content.rendered
})

function dismiss_remember() {
  if (typeof window !== 'undefined') {
    window.localStorage.lahma_cookie_info_banner_dismiss_date = new Date()
  }
  isRemembered.value = true
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const dismissalAge = (new Date() - new Date(window.localStorage.lahma_cookie_info_banner_dismiss_date)) / 86400000
    isRemembered.value = dismissalAge < 30
  }
})
</script>

<style lang="scss">
.lahma-banner {
  position: fixed;
  bottom: 50px;
  opacity: 0.9;
  z-index: 11;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px !important;
  background-color: #ffeb3b !important;
  border-color: #ffeb3b !important;

  a {
    color: #1976d2;
  }
  button {
    color: #1976d2;
    height: 2rem;
    min-width: 3rem;
    padding: 0 0.75rem;
    font-size: .875rem;
    transition: all .2s cubic-bezier(.4, 0, .2, 1);
  }
}
</style>
