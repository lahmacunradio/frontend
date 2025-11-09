<template>
  <div>
    <SubTitle :title="membershipContent?.acf?.page_title ?? 'Lahmacun Membership'" :maintitle="true" />
    <div class="container my-8">
      <div v-if="pending" class="center">Loading...</div>

      <div v-if="membershipContent" class="mx-auto">
        <div class="mb-4">
          <h2>{{ membershipContent.title.rendered }}</h2>
        </div>
        <div class="grid md:grid-cols-2 md:gap-16 gap-4">
          <div>
            <div v-dompurify-html="{ html: membershipContent.content.rendered, options: sanitizeOptions }" />
          </div>

          <div>
            <form :action="$config.public.membershipStripeFormUrl" method="GET">
              <input type="hidden" name="show_name" :value="show_name">
              <input type="hidden" name="is_recurring" :value="is_recurring">
              <input type="hidden" name="currency" :value="currency">

              <div class="selector mb-6">
                <label class="text-sm mb-1">{{ membershipContent?.acf?.select_show }}</label>
                <Dropdown v-model="show_name" :options="arcsiShowsList"
                  :placeholder="membershipContent?.acf?.choose_select || 'Choose from list'" scrollHeight="300px" />
              </div>

              <div class="flex gap-4 mt-4 mb-6 radios">
                <div class="flex items-center gap-2">
                  <RadioButton id="one-time" name="is_recurring" option="no" v-model="is_recurring" />
                  <label for="one-time">{{ membershipContent?.acf?.one_time }}</label>
                </div>
                <div class="flex items-center gap-2">
                  <RadioButton id="recurring" name="is_recurring" option="yes" v-model="is_recurring" />
                  <label for="recurring">{{ membershipContent?.acf?.recurring }}</label>
                </div>
              </div>

              <div class="flex gap-4 my-4 radios">
                <div class="flex items-center gap-2">
                  <RadioButton id="eur" name="currency" option="eur" v-model="currency" />
                  <label for="eur">{{ membershipContent?.acf?.currency_main }}</label>
                </div>
                <div class="flex items-center gap-2">
                  <RadioButton id="huf" name="currency" option="huf" v-model="currency" />
                  <label for="huf">{{ membershipContent?.acf?.currency_huf }}</label>
                </div>
              </div>

              <button type="submit" id="checkout-button" :disabled="show_name.length === 0">{{
                membershipContent?.acf?.continue_button }}</button>

            </form>
            <p>{{ membershipContent?.acf?.cancel_text }}
              <NuxtLink to="/membership-cancel">
                {{ membershipContent?.acf?.cancel_link }}
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAsyncData, useNuxtApp } from '#app'
import { membershipStripeURL } from '~/constants'
import { useArcsiStore } from '~/stores/arcsi'
import Dropdown from '~/components/Dropdown.vue'
import RadioButton from '~/components/RadioButton.vue'

const arcsi = useArcsiStore()

const show_name = ref('')
const is_recurring = ref('no')
const currency = ref('eur')
const sanitizeOptions = {
  allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br', 'a'],
  allowedAttributes: { a: ['*'], img: ['*'], div: ['style', 'class', 'id'], form: ['*'], input: ['*'] }
}

const { $axios, $sentry, $config } = useNuxtApp()
const { data: membershipContent, pending, error } = await useAsyncData('membership-content', async () => {
  try {
    const res = await $axios.get(membershipStripeURL)
    return res?.data
  } catch (e) {
    $sentry?.captureException(new Error('Membership not available', { cause: e }))
    throw e
  }
})

const allShows = computed(() => (arcsi ? arcsi.returnArcsiShows : []))
const arcsiShowsList = computed(() => {
  const list = Array.isArray(allShows.value) ? allShows.value : []
  return list
    .filter(show => !(show.archive_lahmastore_base_url === 'off-air' || !show.active))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(show => show.name)
})

function selectShow(e) {
  show_name.value = e.target.value
}

useHead(() => ({
  title: membershipContent.value?.acf?.page_title ?? 'Lahmacun Membership',
  meta: [
    { hid: 'og:title', property: 'og:title', content: 'Lahmacun Membership' }
  ]
}))
</script>

<style scoped lang="scss">
/* Replace Tailwind @apply with raw CSS definitions */
#checkout-button {
  background-color: #000;
  color: #fff;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 0.125rem;
  margin: 1rem 0;
}
#checkout-button:hover { background-color: #1f2937; }
#checkout-button[disabled] { cursor: not-allowed; background-color: #1f2937; color: #9ca3af; }
p a { text-decoration: underline; }
</style>
