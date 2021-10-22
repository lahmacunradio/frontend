<template>
  <div class="aspect-ratio-1/1">
    <NuxtLink :to="gallery.slug" class="relative gallery-preview preload-block">
      <img :src="previewImage.full_image_url" :srcset="previewImage.medium_srcset" :alt="htmlDecoder(gallery.title.rendered)">
      <div class="absolute bottom-0 flex flex-col justify-end w-full text-center text-white gallery-title">
        <h3 class="text-lg">{{ htmlDecoder(gallery.title.rendered) }}</h3>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    gallery: {
      type: Object,
      required: true
    }
  },
  computed: {
    previewImage () {
    /* TODO -- check if featured image, if not fallback to first image */
      if (!this.gallery) {
        return false
      }
      return this.gallery.acf.gallery[0]
    }
  }
}
</script>

<style lang="scss" scoped>
.gallery-preview {
    width: 100%;
    max-height: 450px;
    overflow: hidden;
    display: flex;
    align-content: center;
    img {
      object-fit: cover;
      min-width: 450px;
      min-height: 450px;
    }
    .gallery-title {
      background: rgb(0,0,0);
      background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
      height: 5rem;
    }
}
</style>
