<template>
  <div>
    <div v-if="!isRemembered">
      <div class="lahma-banner">
        <div class="flex flex-nowrap whitespace-nowrap px-4 py-2 items-center gap-2">
          <div class="w-4 h-4">
            <IconCookie />
          </div>
          <div v-sanitize="[sanitizeOptions, bannerText_computed]" />
          <button @click="dismiss_remember">OK</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { bannerTextURL } from '~/constants'

export default {
  name: 'Banner',
  methods: {
    dismiss_remember: function (event) {
      // `this` inside methods points to the Vue instance
      window.localStorage.lahma_cookie_info_banner_dismiss_date = new Date();
      this.isRemembered = true
    }
  },
  data() {
    return {
      //Note: as window object is not available in early phases in the instance creation, we need to update the value when the component is mounted
      //Initial value can be assumed to be true so that nothing is displayed when rendering
      isRemembered: false,
      //banner text from CMS
      bannertext_fetched: null,
      sanitizeOptions: {
        allowedTags: ['div', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br', 'a'],
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
    this.bannertext_fetched = await this.$axios.get(`${bannerTextURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Banner text not available from CMS ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Banner text not available from CMS' })
      })
  },

  mounted() {
    var dismissalAge = (new Date() - new Date(window.localStorage.lahma_cookie_info_banner_dismiss_date)) / 1000 / 60 / 60 / 24; //convert from ms to days
    this.isRemembered = (dismissalAge < 30) ? true : false; //show banner again after 30 days of last dismissal
  },
  computed: {
    bannerText_computed() {
      if (!this.bannertext_fetched?.content?.rendered) {
        return 'No banner text content'
      }
      return this.bannertext_fetched?.content?.rendered
    }
  }
};
</script>

<style lang="scss">
.lahma-banner {
  position: fixed;
  bottom: 50px;
  opacity: 0.9;
  z-index: 11;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px !important;
  background-color: #ffeb3b !important;
  border-color: #ffeb3b !important;

  a {
    color: #1976d2;
  }
  button {
    color: #1976d2;
    height: 2rem;
    min-width: 3rem;
    padding: 0 0.75rem;
    font-size: .875rem;
    transition: all .2s cubic-bezier(.4, 0, .2, 1);
    background-color: #00000000;
    &:hover {
      background-color: #00000012;
    }
  }
}
</style>
