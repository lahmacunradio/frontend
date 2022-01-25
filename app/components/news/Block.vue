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
          class="mb-4"
        >
      </div>
    </NuxtLink>
    <div class="news-infos pt-4">
      <NuxtLink :to="'/news/' + news.slug">
        <h5 class="mb-2">
          {{ htmlDecoder(news.title.rendered) }}
        </h5>
      </NuxtLink>
      <div class="news-text">
        <div v-sanitize="[ sanitizeOptions, truncatedNews ]" />
      </div>
    </div>
    <div v-if="newsTags" class="tags mt-2">
      <div v-for="(tag, index) in newsTags" :key="index + tag.id + tag.slug" class="inline-block">
        <NuxtLink :to="`/news/tags/${tag.slug}`" class="tag-block">
          {{ tag.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import { contentApiURL, tagsURL } from '~/constants'

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
      newsImageSmall: require('@/assets/img/lahmacun-logo-dummy.png'),
      newsTags: null,
      sanitizeOptions: {
        allowedTags: ['b', 'i', 'em', 'strong', 'br', 'a', 'sup', 'sub'],
        allowedAttributes: {
          a: ['*']
        }
      }
    }
  },
  computed: {
    truncatedNews () {
      return this.truncate(this.news.excerpt.rendered, 150)
    }
  },
  mounted () {
    this.loadNewsImages(this.news.featured_media)
    if (this.news.tags.length) {
      this.loadNewsTags(this.news.tags)
    }
  },
  methods: {
    async loadNewsImages (newsId) {
      const address = `${contentApiURL}/media/${newsId}`
      const responseNews = await this.$axios.get(address)
      this.newsImage = responseNews.data?.media_details?.sizes?.large?.source_url || responseNews.data?.source_url || this.newsImage
      this.newsImageSmall = responseNews.data?.media_details?.sizes?.medium_large?.source_url || responseNews.data?.source_url || this.newsImage
    },
    async loadNewsTags (tagIDs) {
      const address = `${tagsURL}?include=${tagIDs}`
      this.newsTags = await this.$axios.get(address)
        .then(res => res.data)
        .catch((error) => {
          this.$sentry.captureException(new Error('Tag server not available ', error))
        })
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
h5 {
  line-height: 1.2em;
}
.news-text {
  overflow: auto;
  max-width: calc(100vw - 3rem);
}

</style>
