<template>
  <NuxtLink :to="item.url">
    <div class="item-container">
      <div class="item-image">
        <img
          :src="image"
          sizes="(max-width: 640px) 480px,
            800px"
          :alt="item.title"
        >
      </div>
      <h5 v-if="item.title" class="mt-2">
        {{ item.title }}
      </h5>
      <h5 v-if="item.subTitle" class="mt-2 text-white">
        {{ item.subTitle }}
      </h5>
      <div v-if="item.description" class="mt-2 item-text">
        <div v-sanitize="item.description" />
      </div>
      <TagList v-if="item.tags" :tags="item.tags" class="mt-2" />
    </div>
  </NuxtLink>
</template>

<script>

export default {
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
      this.image = this.item.image || this.image
      this.smallImage = this.item.image || this.smallImage
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
  pagging-bottom: 0.5rem 0;
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

.item-container {
  padding: 1rem;
  border: $lahma-pink 4px solid;
}

.item-container:hover {
  border-color: #FFFFFF;
}

</style>
