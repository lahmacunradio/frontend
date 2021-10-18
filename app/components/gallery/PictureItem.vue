<template>
  <a href="#" @click.prevent="shadowbox = !shadowbox">
    <div class="photo">
      <img :src="photo.full_image_url" :alt="photo.title">
    </div>
    <div class="description">
      {{ photo.title }}
    </div>
    <Modal :media="photo.full_image_url" :title="photo.title" :visibility="shadowbox" />
  </a>
</template>

<script>
export default {
  props: {
    photo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      shadowbox: false
    }
  }
}
</script>

<style lang="scss" scoped>
.photo {
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
.description {
    background: $black-color;
    color: white;
    padding: 1rem;
    width: 100%;
    overflow: hidden;
    text-align: center;
}
</style>
