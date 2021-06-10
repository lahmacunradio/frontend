<template>
  <div class="w-full">
    <nuxt-link :to="'/news/' + news.slug">
      <div class="news-image">
        <img :src="newsImage" :alt="news.title.rendered" class="">
      </div>
    </nuxt-link>
    <div class="grid news-infos">
      <div class="news-date">
        <div class="newsgeneral">
          <nuxt-link to="news/">
            <h3 class="m-0">
              News
            </h3>
          </nuxt-link>
        </div>
        <div class="newsdate">
          <p>{{ format(new Date(news.modified), 'MM') }}</p>
          <p>{{ format(new Date(news.modified), 'dd') }}</p>
        </div>
      </div>
      <div class="px-4 news-info-details">
        <h5 class="py-4">
          <nuxt-link :to="'/news/' + news.slug">
            {{ htmlDecoder(news.title.rendered) }}
          </nuxt-link>
        </h5>
        <div v-html="news.excerpt.rendered" />
        <div class="flex justify-end my-4">
          <div class="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer more-button" @click="$emit('changenews')">
            Previous news <i class="fa fa-long-arrow-right" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
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
      newsImage: '/img/lahmacun-logo.png',
      format
    }
  },
  computed: {
  },
  watch: {
    news: {
      handler () {
        this.loadNewsImages(this.news.featured_media)
      }

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
    }
  }
}

</script>

<style lang="scss" scoped>
@import "/assets/css/variables";
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
</style>
