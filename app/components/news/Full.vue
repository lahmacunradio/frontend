<template>
  <div class="py-4">
    <div class="grid-cols-2 gap-8 sm:grid">
      <img
        :src="newsImage"
        :srcset="`${newsImageSmall} 480w`"
        sizes="(max-width: 640px) 480px,
            800px"
        :alt="news.title.rendered"
        class="mb-4"
      >
      <div>
        <h2 class="mt-0 font-bold">{{ htmlDecoder(news.title.rendered) }}</h2>
        <p class="mb-4 news-time">
          {{ $moment(news.date).format('yyyy. MMMM Do.') }}
        </p>
        <div v-sanitize="news.content.rendered" class="text-content news-text" />
      </div>
    </div>
  </div>
</template>

<script>
import { contentApiURL } from '~/constants'

export default {
  components: {
  },
  props: {
    news: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      newsImage: require('@/assets/img/lahmacun-logo-dummy.png'),
      newsImageSmall: require('@/assets/img/lahmacun-logo-dummy.png')
    }
  },
  mounted () {
    this.loadNewsImages(this.news.featured_media)
  },
  methods: {
    async loadNewsImages (newsId) {
      const adress = `${contentApiURL}/media/${newsId}`
      const responseNews = await this.$axios.get(adress)
      this.newsImage = responseNews.data?.media_details?.sizes?.large?.source_url || responseNews.data?.source_url || this.newsImage
      this.newsImageSmall = responseNews.data?.media_details?.sizes?.medium_large?.source_url || responseNews.data?.source_url || this.newsImage
      this.$emit('getimage', this.newsImageSmall)
    }
  }
}

</script>
