<template>
  <div>
    <SubTitle title="Lahmacun donate" :maintitle="true" />
    <div class="container my-8">
      <div v-if="$fetchState.pending" class="center">
        Loading...
      </div>

      <div v-if="donateContent" class="max-w-4xl mx-auto">
        <div class="mb-4">
          <h2>{{ donateContent.title.rendered }}</h2>
        </div>
        <div v-sanitize="[sanitizeOptions, donateContent.content.rendered]" />
        <div class="mt-4">
          <p>Cancel your subscription
            <NuxtLink to="/donate-cancel">
              here
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { donateStripeThanksURL } from '~/constants'

export default {
  data() {
    return {
      donateContent: null,
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
    this.donateContent = await this.$axios.get(`${donateStripeThanksURL}`)
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
  head() {
    return {
      title: 'Thank you for Lahmacun Donate',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Thank you for Lahmacun Donate'
        },
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
p a {
  @apply underline;
}
</style>
