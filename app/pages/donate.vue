<template>
  <div>
    <SubTitle title="Lahmacun donate" :maintitle="true" />
    <div class="container my-8">
      <div v-if="$fetchState.pending" class="center">
        Loading...
      </div>

      <div v-if="donateContent" class="mx-auto">
        <div class="mb-4">
          <h2>{{ donateContent.title.rendered }}</h2>
        </div>
        <div class="grid md:grid-cols-2 md:gap-16 gap-4">
          <div>
            <div v-sanitize="[sanitizeOptions, donateContent.content.rendered]" />
          </div>

          <div>
            <form :action="$config.donateStripeFormUrl" method="GET">
              <div>
                <p class="mb-2">
                  <strong>
                    You can choose from the following options:
                  </strong>
                </p>

                <div class="flex flex-col gap-2 my-4">
                  <div class="flex items-center gap-2">
                    <RadioButton id="one-time" inputId="one-time" name="donate" value="no" v-model="is_recurring" />
                    <label for="one-time">{{ donateContent?.acf?.one_time }}</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioButton id="recurring" inputId="recurring" name="donate" value="yes" v-model="is_recurring" />
                    <label for="recurring">{{ donateContent?.acf?.recurring }}</label>
                  </div>

                </div>
                <input type="hidden" name="is_recurring" :value="is_recurring">

              </div>

              <button type="submit" id="checkout-button">{{ donateContent?.acf?.checkout }}</button>
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
      is_recurring: "no",
      donateContent: null,
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
    this.donateContent = await this.$axios.get(`${donateStripeURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Donate not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Donate not available' })
      })
  },

  mounted() {
    let stripeScript = document.createElement('script')
    stripeScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.head.appendChild(stripeScript)
  },
  head() {
    return {
      title: 'Lahmacun Donate',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Donate'
        },
      ]
    }
  },
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
