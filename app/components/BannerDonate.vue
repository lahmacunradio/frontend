<template>
  <div v-if="donateContent && donateContent.enabled && donateIsVisible">
    <div class="donate-banner">
      <div v-sanitize="[sanitizeOptions, donateContent.banner_text]" />
      <button v-if="donateContent.button.show_button" class="donate-banner-button">
        <a :href="donateContent.button.button_link">
          {{ donateContent.button.button_text }}
        </a>
      </button>
      <div class="absolute top-0 right-0 pr-4 text-xl cursor-pointer" @click="closeBanner()">
        x
      </div>
    </div>
  </div>
</template>

<script>
import { donateBannerURL } from '~/constants'

export default {
  name: 'BannerDonate',
  data() {
    return {
      donateContent: null,
      sanitizeOptions: {
        allowedTags: ['a', 'p', 'b', 'i', 'em', 'strong', 'img', 'br'],
        allowedAttributes: {
          a: ['*'],
          img: ['*'],
        }
      },
      donateIsVisible: true
    }
  },
  async fetch() {
    this.donateContent = await this.$axios.get(`${donateBannerURL}`)
      .then((res) => {
        if (res && res.data.acf) {
          console.log(res.data.acf)
          return res.data.acf
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Donate banner not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Donate banner not available' })
      })
  },
  methods: {
    closeBanner() {
      this.donateIsVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
