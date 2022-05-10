<template>
  <div class="py-4">
    <div class="grid-cols-2 gap-8 md:grid">
      <div class="img-tags">
        <a class="cursor-pointer" @click="newsImageShadowbox = !newsImageShadowbox">
          <img
            :src="newsImage"
            :srcset="`${newsImageSmall} 480w`"
            sizes="(max-width: 640px) 480px,
              800px"
            :alt="news.title.rendered"
            class="mb-4"
          >
          <Modal
            :media="newsImage"
            :description="htmlDecoder(news.title.rendered)"
            :visibility="newsImageShadowbox"
          />
        </a>
        <div v-if="postTagsArray.length" class="mb-8 tags">
          <div v-for="(tag, index) in postTagsArray" :key="index + tag.id" class="inline-block">
            <NuxtLink :to="`/news/tags/${tag.slug}`" class="tag-block">
              {{ tag.name }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div id="news-content">
        <h1 class="mt-0 font-bold h2">
          {{ htmlDecoder(news.title.rendered) }}
        </h1>
        <p class="mb-4 news-time">
          {{ $moment(news.date).format('yyyy. MMMM Do.') }}
        </p>
        <div v-sanitize="[ sanitizeOptions, news.content.rendered ]" class="text-content news-text" />
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
      newsImageShadowbox: false,
      newsImage: require('@/assets/img/lahmacun-logo-dummy.png'),
      newsImageSmall: require('@/assets/img/lahmacun-logo-dummy.png'),
      postTagsArray: [],
      sanitizeOptions: {
        allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'figure', 'hr', 'br', 'a', 'sup', 'sub', 'iframe'],
        allowedAttributes: {
          img: ['*'],
          iframe: ['*'],
          div: ['style', 'class', 'id'],
          a: ['*']
        }
      }
    }
  },
  computed: {},
  mounted () {
    this.loadNewsImages(this.news.featured_media)
    this.postTags(this.news.id)
  },
  methods: {
    async loadNewsImages (newsId) {
      const adress = `${contentApiURL}/media/${newsId}`
      const responseNews = await this.$axios.get(adress)
      this.newsImage = responseNews.data?.media_details?.sizes?.large?.source_url || responseNews.data?.source_url || this.newsImage
      this.newsImageSmall = responseNews.data?.media_details?.sizes?.medium_large?.source_url || responseNews.data?.source_url || this.newsImage
      this.$emit('getimage', this.newsImageSmall)
    },
    async postTags (newsId) {
      const adress = `${tagsURL}?post=${newsId}`
      const responseTags = await this.$axios.get(adress)
      if (responseTags.status === 200) {
        this.postTagsArray = responseTags.data
      }
    }
  }
}

</script>
