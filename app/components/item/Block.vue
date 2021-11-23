<template>
  <div class="mb-2">
<!--    <NuxtLink :to="'/news/' + news.slug">-->
      <div class="item-image">
        <img
          :src="itemsImage"
          :srcset="`${itemsImageSmall} 480w`"
          sizes="(max-width: 640px) 480px,
            800px"
          :alt="item.title.rendered"
          class="mb-4"
        >
      </div>
      <h5 class="py-4">
        {{ htmlDecoder(item.title.rendered) }}
      </h5>
<!--    </NuxtLink>-->
    <div class="item-text">
      <div v-sanitize="truncatedItem" />
    </div>
  </div>
</template>

<script>
import { contentApiURL } from '~/constants'

export default {
  components: {
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      itemImage: require('@/assets/img/lahmacun-logo-dummy.png'),
      itemImageSmall: require('@/assets/img/lahmacun-logo-dummy.png')
    }
  },
  computed: {
    truncatedNews () {
      return this.truncate(this.item.excerpt.rendered, 150)
    }
  },
  mounted () {
    this.loadNewsImages(this.item.featured_media)
  },
  methods: {
    async loadNewsImages (newsId) {
      console.log('DDDDDDD', this.item)
      debugger
      // const adress = `${contentApiURL}/media/${newsId}`
      // const responseNews = await this.$axios.get(adress)
      // this.newsImage = responseNews.data?.media_details?.sizes?.large?.source_url || responseNews.data?.source_url || this.newsImage
      // this.newsImageSmall = responseNews.data?.media_details?.sizes?.medium_large?.source_url || responseNews.data?.source_url || this.newsImage
    }
  }
}

</script>

<style lang="scss" scoped>
.item-image {
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
.item-text {
  overflow: auto;
  max-width: calc(100vw - 3rem);
}

</style>
