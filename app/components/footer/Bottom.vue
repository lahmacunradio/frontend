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
          <div v-dompurify-html="{ html: footerLogos?.supporters_block_content, options: sanitizeOptions }"
            class="supporters-content"></div>
        </div>
        <div class="">
          <h5 class="mb-4">{{ footerLogos?.membership_block_title }}</h5>
          <div v-dompurify-html="{ html: footerLogos?.membership_block_content, options: sanitizeOptions }"
            class="supporters-content"></div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { footerLogosUrl } from '~/constants'
import { useAsyncData, useNuxtApp } from '#imports'

const sanitizeOptions = {
  allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br', 'a', 'sup', 'sub'],
  allowedAttributes: {
    img: ['*'],
    div: ['style', 'class', 'id'],
    a: ['*']
  }
}

const { $axios, $sentry } = useNuxtApp()
const { data } = await useAsyncData('footer-logos', async () => {
  try {
    const res = await $axios.get(`${footerLogosUrl}`)
    return res.data?.acf
  } catch (e) {
    $sentry?.captureException(new Error('Supporters content not available ', { cause: e }))
    return null
  }
})

const footerLogos = computed(() => data.value || null)
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
  color: white;
  display: flex;
  flex-direction: column;
  gap: 0 3rem;
}

@media (min-width: 768px) {
  .lahma-footer .supporters {
    flex-direction: row;
  }
}

.lahma-footer .supporters .supporters-content {
  margin-top: 0.5rem;
}

.lahma-footer .supporters .supporters-content p {
  display: flex;
  align-items: center;
  row-gap: 1.5rem;
  column-gap: 1rem;
  margin: 0.5rem 0;
  flex-wrap: wrap;
}
</style>
