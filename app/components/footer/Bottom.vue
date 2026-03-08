<template>
  <footer class="bg-black lahma-footer">
    <div class="container justify-between py-8 md:flex">
      <div class="infos">
        <div class="mb-4">
          <h5>FOLLOW</h5>
          <ul>
            <li>
              <a href="https://www.facebook.com/lahmacunradio" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <a href="http://instagram.com/lahmacunradio" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://www.mixcloud.com/LahmacunRadio/" target="_blank" rel="noopener noreferrer">
                Mixcloud
              </a>
            </li>
            <li>
              <a href="https://lahmacunradio.bandcamp.com/" target="_blank" rel="noopener noreferrer">
                Bandcamp
              </a>
            </li>
          </ul>
        </div>
        <div class="mb-4">
          <h5>Contact</h5>
          <p>
            <a href="mailto:contact@lahmacun.hu">contact@lahmacun.hu</a>
          </p>
          <h5 class="mt-4">
            <NuxtLink to="/impressum/">
              Impressum
            </NuxtLink>
          </h5>
        </div>
      </div>
      <div class="supporters">
        <div class="mb-4">
          <h5 class="mb-4">{{ footerLogos?.supporters_block_title }}</h5>
          <div v-html="$sanitize(footerLogos?.supporters_block_content, sanitizeOptions)"
            class="supporters-content"></div>
        </div>
        <div class="">
          <h5 class="mb-4">{{ footerLogos?.membership_block_title }}</h5>
          <div v-html="$sanitize(footerLogos?.membership_block_content, sanitizeOptions)"
            class="supporters-content"></div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import {
  footerLogosUrl
} from '~/constants'

export default {
  name: 'Bottom',
  data() {
    return {
      footerLogos: null,
      sanitizeOptions: {
        allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br', 'a', 'sup', 'sub'],
        allowedAttributes: {
          img: ['*'],
          div: ['style', 'class', 'id'],
          a: ['*']
        }
      }
    }
  },
  async fetch() {
    // logos
    this.footerLogos = await this.$axios.get(`${footerLogosUrl}`)
      .then((res) => {
        if (res) {
          return res.data?.acf
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Supporters content not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Supporters not available' })
      })
  }
}

</script>

<style lang="scss" scoped>
.infos {
  color: white;

  >div {
    display: inline-block;
    margin-right: 3rem;
    vertical-align: top;
  }

  a {
    transition: all 0.5s;
    color: white;

    &:hover {
      color: $lahma-pink;
    }
  }
}
</style>

<style lang="scss">
.lahma-footer .supporters {
  @apply text-white flex flex-col md:flex-row gap-x-12;

  .supporters-content {
    margin-top: 0.5rem;

    p {
      display: flex;
      align-items: center;
      row-gap: 1.5rem;
      column-gap: 1rem;
      margin: 0.5rem 0;
      flex-wrap: wrap;
    }
  }
}
</style>
