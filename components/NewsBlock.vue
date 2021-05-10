<template>
  <div class="mb-2">
    <nuxt-link :to="'/news/' + news.slug">
      <div class="news-image">
        <img :src="newsImage" :alt="news.title.rendered" class="mb-4 rounded-md">
      </div>
      <h5 class="py-4">
        {{ htmlDecoder(news.title.rendered) }}
      </h5>
    </nuxt-link>
    <div v-html="news.excerpt.rendered" />
  </div>
</template>

<script>
import axios from 'axios'
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
      newsImage: '/img/lahmacun-logo.png'
    }
  },
  computed: {
  },
  mounted () {
    this.loadNewsImages(this.news.featured_media)
  },
  methods: {
    async loadNewsImages (newsId) {
      const adress = `${contentApiURL}/media/${newsId}`
      const responseNews = await axios.get(adress)
      this.newsImage = responseNews.data.media_details.sizes.large.source_url
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
</style>
