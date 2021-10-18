<template>
  <div class="p-4 bg-white rounded-lg">
    <h3>{{ gallery.title.rendered }}</h3>
    <p>{{ gallery.excerpt.rendered }}</p>
    <img :src="previewImage" alt="">
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
      return this.gallery.acf.gallery[0].full_image_url
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
