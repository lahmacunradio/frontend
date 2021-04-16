<template>
  <div class="mb-2">
    <img :src="newsImage" :alt="news.title.rendered" class="mb-4 rounded-md">
    <h5>{{ news.title.rendered }}</h5>
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
      newsImage: ''
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
      console.log(responseNews.data.media_details.sizes.medium.source_url)
      this.newsImage = responseNews.data.media_details.sizes.large.source_url
      // return responseNews.data.media_details.sizes.medium.source_url
    }
  }
}

</script>
