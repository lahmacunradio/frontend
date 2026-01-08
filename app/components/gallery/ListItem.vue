<template>
  <div class="aspect-ratio-1/1">
    <NuxtLink :to="gallery.slug" class="relative gallery-preview preload-block">
      <img :src="previewImageSrc" :srcset="previewImageSrcset" :alt="htmlDecoder(gallery.title.rendered)">
      <div class="absolute bottom-0 flex flex-col justify-end w-full text-center text-white gallery-title">
        <h3 class="text-lg">
          {{ htmlDecoder(gallery.title.rendered) }}
        </h3>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
import { mediaURL } from '~/constants'

export default {
  props: {
    gallery: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      featuredImage: null
    }
  },
  async fetch () {
    if (!this.featuredImageId) {
      return false
    }
    this.featuredImage = await this.$axios.get(mediaURL + `/${this.featuredImageId}`)
      .then(res => res.data)
      .catch((error) => {
        this.$sentry.captureException(new Error('Featured Image not found ', error))
      })
  },
  computed: {
    featuredImageId () {
      if (!this.gallery && this.gallery.featured_media === 0) {
        return false
      }
      return this.gallery.featured_media
    },
    previewImageSrc () {
      if (this.featuredImage) {
        return this.featuredImage.source_url
      } else {
        return this.gallery.acf.gallery[0].full_image_url
      }
    },
    previewImageSrcset () {
      if (this.featuredImage) {
        const srcsetAssembly = `${this.featuredImage?.media_details?.sizes?.medium?.source_url} 768w, ${this.featuredImage?.media_details?.sizes?.large?.source_url} 1024w, ${this.featuredImage?.media_details?.sizes?.full?.source_url} 1458w`
        return srcsetAssembly
      } else {
        return this.gallery.acf.gallery[0].medium_srcset
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gallery-preview {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-content: center;
    img {
      object-fit: cover;
      min-width: 100%;
      min-height: 100%;
    }
    .gallery-title {
      background: rgb(0,0,0);
      background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
      height: 5rem;
    }
}
</style>
