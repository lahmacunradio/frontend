<template>
  <div class="mb-2">
    <NuxtLink :to="'/news/' + news.slug">
      <div class="news-image">
        <img
          :src="newsImage"
          :srcset="`${newsImageSmall} 480w`"
          sizes="(max-width: 640px) 480px,
            800px"
          :alt="news.title.rendered"
          class="mb-4 rounded-md"
        >
      </div>
      <h5 class="py-4">
        {{ htmlDecoder(news.title.rendered) }}
      </h5>
    </NuxtLink>
    <div class="news-text">
      <div v-sanitize="truncatedNews" />
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
      newsImage: '/img/lahmacun-logo-dummy.png',
      newsImageSmall: '/img/lahmacun-logo-dummy.png'
    }
  },
  computed: {
    truncatedNews () {
      return this.truncate(this.news.excerpt.rendered, 150)
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
    }
  }
}

</script>

<style lang="scss" scoped>
.news-image {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  align-content: center;
  img {
    min-height: 300px;
    min-width: 300px;
    object-fit: cover;
  }
}
.news-text {
  overflow: auto;
  max-width: calc(100vw - 3rem);
}

</style>
