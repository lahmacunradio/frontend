<template>
  <div>
    <SubTitle :title="donateContent?.acf?.page_title ?? 'Lahmacun Donate'" :maintitle="true" />
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
                    {{ donateContent?.acf?.options_choose_label }}
                  </strong>
                </p>

                <div class="flex gap-4 mt-4 mb-6 radios">
                  <div class="flex items-center gap-2">
                    <RadioButton id="one-time" inputId="one-time" name="is_recurring" value="no"
                      v-model="is_recurring" />
                    <label for="one-time">{{ donateContent?.acf?.one_time }}</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioButton id="recurring" inputId="recurring" name="is_recurring" value="yes"
                      v-model="is_recurring" />
                    <label for="recurring">{{ donateContent?.acf?.recurring }}</label>
                  </div>
                </div>

                <div class="flex gap-4 my-4 radios">
                  <div class="flex items-center gap-2">
                    <RadioButton id="eur" inputId="eur" name="currency" value="eur"
                      v-model="currency" />
                    <label for="eur">{{ donateContent?.acf?.currency_main }}</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioButton id="huf" inputId="huf" name="currency" value="huf"
                      v-model="currency" />
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

<script>
import { donateStripeURL } from '~/constants'

export default {
  data() {
    return {
      is_recurring: "no",
      currency: "eur",
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
      title: this.donateContent?.acf?.page_title ?? 'Lahmacun Donate',
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
