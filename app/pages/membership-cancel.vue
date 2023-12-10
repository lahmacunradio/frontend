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
        <div v-sanitize="[sanitizeOptions, membershipContent.content.rendered]" />
        <div class="block mt-6">
          <a id="checkout-button" :href="$config.subscriptionCancelUrl">Yes, cancel my membership</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { membershipStripeCancelURL } from '~/constants'

export default {
  data() {
    return {
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
    this.membershipContent = await this.$axios.get(`${membershipStripeCancelURL}`)
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
  head() {
    return {
      title: 'Cancel Lahmacun Membership',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Cancel Lahmacun Membership'
        },
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
#checkout-button {
  @apply bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-sm cursor-pointer;
}

p a {
  @apply underline;
}
</style>
