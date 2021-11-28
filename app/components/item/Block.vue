<template>
  <div class="mb-2">
    <NuxtLink :to="item.url">
      <div class="item-image">
        <img
          :src="image"
          :srcset="`${smallImage} 480w`"
          sizes="(max-width: 640px) 480px,
            800px"
          :alt="item.title"
          class="mb-4"
        >
      </div>
      <h5 class="py-4">
        {{ item.title }}
      </h5>
    </NuxtLink>
    <div class="item-text">
      <div v-sanitize="item.description" />
    </div>
  </div>
</template>

<script>

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
      image: require('@/assets/img/lahmacun-logo-dummy.png'),
      smallImage: require('@/assets/img/lahmacun-logo-dummy.png')
    }
  },
  computed: {
  },
  mounted () {
    this.loadNewsImages()
  },
  methods: {
    async loadNewsImages() {
      this.image = this.item.image.large || this.image
      this.smallImage = this.item.image.small || this.smallImage
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
