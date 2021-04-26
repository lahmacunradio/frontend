<template>
  <div class="mb-2">
    <h2>{{ htmlDecoder(news.title.rendered) }}</h2>
    <p class="news-time mb-4">
      {{ format(new Date(news.date), 'yyyy. MMMM dd.') }}
    </p>
    <div class="grid grid-cols-2 gap-4">
      <img :src="newsImage" :alt="news.title.rendered" class="mb-4 rounded-md">
      <div v-html="news.content.rendered" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
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
  mounted () {
    this.loadNewsImages(this.news.featured_media)
  },
  methods: {
    async loadNewsImages (newsId) {
      const adress = `${contentApiURL}/media/${newsId}`
      const responseNews = await axios.get(adress)
      // console.log(responseNews.data.media_details.sizes.medium.source_url)
      this.newsImage = responseNews.data.media_details.sizes.large.source_url
    }
  }
}

</script>
