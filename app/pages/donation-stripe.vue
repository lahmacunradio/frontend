<template>
  <div>
    <SubTitle title="Lahmacun donation" :maintitle="true" />
    <div class="container my-8">
      <div v-if="$fetchState.pending" class="center">
        Loading...
      </div>

      <div v-if="donationContent" class="max-w-4xl mx-auto">
        <div class="mb-4">
          <h2>{{ donationContent.title.rendered }}</h2>
        </div>
        <div class="grid md:grid-cols-2 md:gap-8 gap-4">
          <div>
            <div v-sanitize="[sanitizeOptions, donationContent.content.rendered]" />
          </div>

          <div>
            <form action="https://cms.lahmacun.hu/wp-json/stripe/return_checkout_session_recurring_membership"
              method="GET">
              <div>
                <p>
                  <strong>
                    You can choose from the following options:
                  </strong>
                </p>
                <div>
                  <input type="radio" id="name-your-price" name="options" value="name-your-price" checked />
                  <label for="name-your-price">{{ donationContent?.acf?.name_your_price }}</label>
                </div>
                <div>
                  <input type="radio" id="subscribe" name="options" value="subscribe" />
                  <label for="subscribe">{{ donationContent?.acf?.subscribe }}</label>
                </div>
              </div>
              <button type="submit" id="checkout-button">Continue for payment</button>
            </form>
            <p>Cancel your subscription
              <NuxtLink to="/donate-cancel">
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
import { donateStripeURL } from '~/constants'

export default {
  data() {
    return {
      show_name: "",
      donationContent: null,
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
    this.donationContent = await this.$axios.get(`${donateStripeURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Donation not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Donation not available' })
      })
  },

  mounted() {
    let stripeScript = document.createElement('script')
    stripeScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.head.appendChild(stripeScript)
  },
  head() {
    return {
      title: 'Lahmacun Donation',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Donation'
        },
      ]
    }
  },
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
