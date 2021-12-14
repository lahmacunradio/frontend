<template>
  <NuxtLink :to="item.url">
    <div class="container">
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
      <h5 v-if="item.subTitle" class="text-white mt-2">
        {{ item.subTitle }}
      </h5>
      <div v-if="item.description" class="item-text mt-2">
        <div v-sanitize="item.description" />
      </div>
    </div>
  </NuxtLink>
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

.container {
  padding: 1rem;
}

.container:hover {
  outline: solid #FFFFFF;
}

</style>
