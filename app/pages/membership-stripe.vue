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
            <form action="https://cms.lahmacun.hu/wp-json/stripe/return_checkout_session_recurring_membership"
              method="GET">
              <div>
                <label for="show_name">Select your show</label>
                <div class="relative max-w-md bg-white rounded-sm">
                  <select class="show-select" :class="{ showSelected: show_name.length > 1 }" @change="selectShow">
                    <option disabled selected value="">Please select a show</option>
                    <option v-for="(show) in arcsiShowsList" :value="show.archive_lahmastore_base_url"
                      :key="show.archive_lahmastore_base_url">
                      {{ show.name }}
                    </option>
                  </select>
                  <div class="absolute right-2 top-2 z-0">
                    <i class="fa fa-chevron-down" />
                  </div>
                </div>

              </div>
              <button type="submit" id="checkout-button" :disabled="show_name.length === 0">Continue for payment</button>
            </form>
            <p>Cancel your subscription <a href="/membership">here</a></p>
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
        )).sort((a, b) => a.name.localeCompare(b.name))
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
.show-select {
  @apply block p-2 my-2 border w-full text-gray-500 z-10 relative;
}

.show-select:focus {
  @apply outline-none;
}

.show-select.showSelected {
  @apply text-black;
}

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
