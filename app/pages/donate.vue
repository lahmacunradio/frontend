<template>
  <div>
    <SubTitle :title="donateContent?.acf?.page_title ?? 'Lahmacun Donate'" :maintitle="true" />
    <div class="container my-8">
      <div v-if="pending" class="center">Loading...</div>

      <div v-if="donateContent" class="mx-auto">
        <div class="mb-4">
          <h2>{{ donateContent.title.rendered }}</h2>
        </div>
        <div class="grid md:grid-cols-2 md:gap-16 gap-4">
          <div>
            <div v-dompurify-html="{ html: donateContent.content.rendered, options: sanitizeOptions }" />
          </div>

          <div>
            <form :action="$config.donateStripeFormUrl" method="GET">
              <div>
                <p class="mb-2">
                  <strong>
                    {{ donateContent?.acf?.options_choose_label }}
                  </strong>
                </p>

                <div class="flex gap-4 mt-4 mb-6 radios">
                  <div class="flex items-center gap-2">
                    <RadioButton id="one-time" name="is_recurring" option="no" v-model="is_recurring" />
                    <label for="one-time">{{ donateContent?.acf?.one_time }}</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioButton id="recurring" name="is_recurring" option="yes" v-model="is_recurring" />
                    <label for="recurring">{{ donateContent?.acf?.recurring }}</label>
                  </div>
                </div>

                <div class="flex gap-4 my-4 radios">
                  <div class="flex items-center gap-2">
                    <RadioButton id="eur" name="currency" option="eur" v-model="currency" />
                    <label for="eur">{{ donateContent?.acf?.currency_main }}</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioButton id="huf" name="currency" option="huf" v-model="currency" />
                    <label for="huf">{{ donateContent?.acf?.currency_huf }}</label>
                  </div>
                </div>

              </div>

              <button type="submit" id="checkout-button">{{ donateContent?.acf?.checkout }}</button>
            </form>
            <p>{{ donateContent?.acf?.cancel_text }}
              <NuxtLink to="/donate-cancel">
                {{ donateContent?.acf?.cancel_button }}
              </NuxtLink>
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAsyncData, useNuxtApp } from '#app'
import { computed, onMounted } from 'vue'
import { donateStripeURL } from '~/constants'
import RadioButton from '~/components/RadioButton.vue'
const is_recurring = ref('no')
const currency = ref('eur')
const sanitizeOptions = {
  allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br', 'a'],
  allowedAttributes: { a: ['*'], img: ['*'], div: ['style', 'class', 'id'], form: ['*'], input: ['*'] }
}

const { $axios, $sentry, $config } = useNuxtApp()
const { data: donateContent, pending, error } = await useAsyncData('donate-content', async () => {
  try {
    const res = await $axios.get(donateStripeURL)
    return res?.data
  } catch (e) {
    $sentry?.captureException(new Error('Donate not available', { cause: e }))
    throw e
  }
})

onMounted(() => {
  const stripeScript = document.createElement('script')
  stripeScript.setAttribute('src', 'https://js.stripe.com/v3/')
  document.head.appendChild(stripeScript)
})

useHead(() => ({
  title: donateContent.value?.acf?.page_title ?? 'Lahmacun Donate',
  meta: [
    { hid: 'og:title', property: 'og:title', content: 'Lahmacun Donate' }
  ]
}))
</script>

<style scoped lang="scss">
/* Replaced Tailwind @apply with explicit CSS to avoid build errors */
#checkout-button {
  background-color: #000; /* bg-black */
  color: #fff; /* text-white */
  font-weight: 700; /* font-bold */
  padding: 0.5rem 1rem; /* py-2 px-4 */
  border-radius: 0.125rem; /* rounded-sm */
  margin: 1rem 0; /* my-4 */
}
#checkout-button:hover {
  background-color: #1f2937; /* hover:bg-gray-800 */
}
#checkout-button[disabled] {
  cursor: not-allowed; /* cursor-not-allowed */
  background-color: #1f2937; /* bg-gray-800 */
  color: #9ca3af; /* text-gray-400 */
}
p a {
  text-decoration: underline; /* underline */
}
</style>
