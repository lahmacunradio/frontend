<template>
  <div>
    <SubTitle title="Lahmacun News" url="/news/" />
    <div class="container mt-8">
      <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-4">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
        <p>Loading...</p>
      </div>
      <div v-if="$fetchState.error" class="py-8 text-center">
        Error happened
      </div>
      <NewsFull v-if="selectedNews" :news="selectedNews" @getimage="getImage" />
    </div>
  </div>
</template>

<script>
import { contentApiURL } from '~/constants'

export default {
  data () {
    return {
      slug: this.$route.params.slug,
      selectedNews: null,
      metaImage: '@/assets/lahmacun-logo-dummy.png'
    }
  },
  async fetch () {
    this.selectedNews = await this.$axios.get(`${contentApiURL}/posts?slug=${this.slug}`)
      .then(res => res.data[0])
      .catch((error) => {
        this.$sentry.captureException(new Error('News not found ', error))
        this.$nuxt.error({ statusCode: 404, message: 'News not found' })
      })
  },
  head () {
    return {
      title: this.htmlDecoder(this.selectedNews?.title?.rendered),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.metaDescription
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.htmlDecoder(this.selectedNews?.title?.rendered)
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.metaDescription
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.metaOgImage
        }
      ]
    }
  },
  computed: {
    metaDescription () {
      if (!this.selectedNews) {
        return false
      }
      const shortenMeta = this.stripHTMLTags(this.selectedNews?.excerpt?.rendered)
      return this.truncate(shortenMeta, 150)
    },
    metaOgImage () {
      if (!this.selectedNews) {
        return this.metaImage
      }
      const metaImageACF = this.selectedNews?.acf?.ogimage
      return metaImageACF || this.metaImage
    }
  },
  methods: {
    getImage (image) {
      this.metaImage = image
    }
  }
}
</script>
