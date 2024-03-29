<template>
  <div v-if="news" class="w-full news-home-container">
    <div class="relative newsimage-slider">
      <div class="absolute top-0 right-0 news-badge">
        <nuxt-link to="/news">
          <h3>News</h3>
        </nuxt-link>
      </div>
      <div class="absolute z-10 flex items-center justify-between w-full h-full px-4 my-4">
        <div class="cursor-pointer" @click="$emit('changenews', 'previous')">
          <img src="@/assets/img/arrow-left.svg" alt="">
        </div>
        <div class="cursor-pointer" @click="$emit('changenews', 'next')">
          <img src="@/assets/img/arrow-right.svg" alt="">
        </div>
      </div>
      <nuxt-link :to="'/news/' + news.slug">
        <div class="news-image">
          <img
            :src="newsImage"
            :srcset="`${newsImageSmall} 480w`"
            sizes="(max-width: 640px) 480px,
            800px"
            :alt="news.title.rendered"
            class=""
          >
        </div>
      </nuxt-link>
    </div>
    <div class="news-infos">
      <div class="p-8 news-info-details">
        <h1 class="pb-2 text-2xl font-bold">
          <nuxt-link :to="'/news/' + news.slug">
            {{ htmlDecoder(news.title.rendered) }}
          </nuxt-link>
        </h1>
        <div v-sanitize="[ sanitizeOptions, truncatedNews ]" />
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
      newsImageSmall: require('@/assets/img/lahmacun-logo-dummy.png'),
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
      if (!this.news && !this.news?.excerpt?.rendered) {
        return false
      }
      const filterEllipsis = this.news?.excerpt.rendered.replace('<span class="moresign"> ... </span>', '')
      return this.truncate(filterEllipsis, 300)
    }
  },
  watch: {
    news: {
      handler () {
        this.loadNewsImages(this.news?.featured_media)
      }
    }
  },
  mounted () {
    this.loadNewsImages(this.news?.featured_media)
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
.news-badge {
  background: $lahma-pink;
  transform: rotate(20deg);
  border-radius: 50%;
  margin: 1rem;
  z-index: 15;
  h3 {
    margin: 0;
    padding: 1rem;
    text-transform: uppercase;
  }
}
.news-home-container {
  .news-image {
    width: 100%;
    max-height: 20rem;
    overflow: hidden;
    display: flex;
    align-content: center;
    justify-content: center;
    img {
      min-height: 300px;
      min-width: 300px;
      width: 100%;
      object-fit: cover;
      /*
      filter: grayscale(100%);
       */
      transition: 1s;
    }
  }
  &:hover .news-image img {
      filter: none;
  }
  .news-infos {
      background: white;
      grid-template-columns: 130px 1fr;
      .news-date {
          text-align: center;
          background: $black-color;
          > div {
              padding: 1rem 0;
          }
          .newsgeneral {
              background: $lahma-pink;
              max-height: 5rem;
          }
          .newsdate {
              color: white;
              font-size: 2rem;
          }
      }
  }
}

</style>
