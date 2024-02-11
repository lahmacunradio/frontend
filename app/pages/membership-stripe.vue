<template>
  <div>
    <SubTitle title="Lahmacun membership" :maintitle="true" />
    <div class="container my-8">
      <div v-if="$fetchState.pending" class="center">
        Loading...
      </div>

      <div v-if="membershipContent" class="max-w-4xl mx-auto">
        <div class="mb-4">
          <h2>{{ membershipContent.title.rendered }}</h2>
        </div>
        <div class="grid md:grid-cols-2 md:gap-8 gap-4">
          <div>
            <div v-sanitize="[sanitizeOptions, membershipContent.content.rendered]" />
          </div>

          <div>
            <form :action="$config.membershipStripeFormUrl" method="GET">
              <div class="selector">

                <v-app>
                  <v-container>
                    <v-select label="Select your show" name="show_name" v-model="show_name"
                      :items="arcsiShowsList"></v-select>
                  </v-container>
                </v-app>

              </div>
              <button type="submit" id="checkout-button" :disabled="show_name.length === 0">Continue for payment</button>
            </form>
            <p>Cancel your subscription
              <NuxtLink to="/membership-cancel">
                here
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
      membershipContent: null,
      sanitizeOptions: {
        allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br'],
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
      title: 'Lahmacun Membership',
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
