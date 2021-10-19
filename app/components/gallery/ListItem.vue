<template>
  <div class="p-4 bg-white rounded-lg">
    <h3 class="mt-0">
      <NuxtLink :to="gallery.slug">
        {{ htmlDecoder(gallery.title.rendered) }}
      </NuxtLink>
    </h3>
    <div v-sanitize="gallery.excerpt.rendered" />
    <NuxtLink :to="gallery.slug" class="gallery-preview">
      <img :src="previewImage.full_image_url" :srcset="previewImage.medium_srcset" :alt="htmlDecoder(gallery.title.rendered)">
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
    max-height: 300px;
    overflow: hidden;
    display: flex;
    align-content: center;
    img {
      object-fit: cover;
      min-height: 300px;
      min-width: 300px;
    }
}
</style>
