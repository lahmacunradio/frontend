<template>
  <div>
    <SubTitle :title="membershipContent?.acf?.page_title ?? 'Lahmacun Membership'" :maintitle="true" />
    <div class="container my-8">
      <div v-if="$fetchState.pending" class="center">
        Loading...
      </div>

      <div v-if="membershipContent" class="mx-auto">
        <div class="mb-4">
          <h2>{{ membershipContent.title.rendered }}</h2>
        </div>
        <div class="grid md:grid-cols-2 md:gap-16 gap-4">
          <div>
            <div v-sanitize="[sanitizeOptions, membershipContent.content.rendered]" />
          </div>

          <div>
            <form :action="$config.membershipStripeFormUrl" method="GET">
              <div class="selector mb-6">
                <label class="text-sm mb-1">{{ membershipContent?.acf?.select_show }}</label>
                <Dropdown v-model="show_name" :options="arcsiShowsList"
                  :placeholder="membershipContent?.acf?.choose_select || 'Choose from list'" scrollHeight="300px" />
              </div>
              <input type="hidden" name="show_name" :value="show_name">

              <div class="flex gap-4 mt-4 mb-6 radios">
                <div class="flex items-center gap-2">
                  <RadioButton id="one-time" inputId="one-time" name="is_recurring" value="no" v-model="is_recurring" />
                  <label for="one-time">{{ membershipContent?.acf?.one_time }}</label>
                </div>
                <div class="flex items-center gap-2">
                  <RadioButton id="recurring" inputId="recurring" name="is_recurring" value="yes"
                    v-model="is_recurring" />
                  <label for="recurring">{{ membershipContent?.acf?.recurring }}</label>
                </div>
              </div>

              <div class="flex gap-4 my-4 radios">
                <div class="flex items-center gap-2">
                  <RadioButton id="yes" inputId="yes" name="currency" value="eur" v-model="currency" />
                  <label for="yes">{{ membershipContent?.acf?.currency_main }}</label>
                </div>
                <div class="flex items-center gap-2">
                  <RadioButton id="huf" inputId="huf" name="currency" value="huf" v-model="currency" />
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

<script>
import { membershipStripeURL } from '~/constants'

import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      show_name: "",
      is_recurring: "no",
      currency: "eur",
      membershipContent: null,
      sanitizeOptions: {
        allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br', 'a'],
        allowedAttributes: {
          a: ['*'],
          img: ['*'],
          div: ['style', 'class', 'id'],
          form: ['*'],
          input: ['*']
        }
      }
    }

  },
  async fetch() {
    this.membershipContent = await this.$axios.get(`${membershipStripeURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Membership not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Membership not available' })
      })
  },
  mounted() {
    let stripeScript = document.createElement('script')
    stripeScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.head.appendChild(stripeScript)
  },
  head() {
    return {
      title: this.membershipContent?.acf?.page_title ?? 'Lahmacun Membership',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Membership'
        },
      ]
    }
  },
  computed: {
    ...mapGetters({
      allShows: 'returnArcsiShows'
    }),
    arcsiShowsList() {
      if (this.allShows) {
        return this.allShows.filter(show => (
          !(show.archive_lahmastore_base_url === 'off-air' || !show.active)
        )).sort((a, b) => a.name.localeCompare(b.name)).map(show => show.name)
      }
      return null
    },
  },
  methods: {
    selectShow(showname) {
      this.show_name = showname.target.value
    },
  }

}
</script>

<style scoped lang="scss">
#checkout-button {
  @apply bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-sm my-4;

  &[disabled] {
    @apply cursor-not-allowed bg-gray-800 text-gray-400;
  }
}

p a {
  @apply underline;
}
</style>
