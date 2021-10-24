<template>
  <a href="#" @click.prevent="shadowbox = !shadowbox">
    <div class="photo aspect-ratio-1/1">
      <img class="image-fit" :src="photo.full_image_url" :srcset="photo.medium_srcset" :alt="photo.title">
      <div class="description">
        {{ photo.title }}
      </div>
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
    position: relative;
  .description {
      display:none;
      background: rgba($color: #000000, $alpha: 0.3);
      color: white;
      padding: 1rem;
      width: 100%;
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      position: absolute;
      align-items: center;
      justify-content: center;
  }
  &:hover .description {
    display: flex;
  }
}
</style>
