<template>
  <div v-if="episode" class="latest-arcsi-blokk">
    <NuxtLink :to="`/shows/${showslug}/${episode.id}`">
      <div class="mb-4 arcsi-img">
        <img class="block" :src="episodeImage">
      </div>
    </NuxtLink>
    <NuxtLink :to="`/shows/${showslug}/${episode.id}`">
      <h5>{{ episode.name }}</h5>
    </NuxtLink>
    <NuxtLink :to="`/shows/${showslug}`">
      <h5 class="text-white">
        {{ episode.shows[0].name }}
      </h5>
    </NuxtLink>
    <div class="flex items-center mt-6 tags">
      <div class="tag">
        dub
      </div>
      <div class="tag">
        psychedelic
      </div>
      <div class="tag">
        experimental
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    episode: {
      type: Object,
      required: true
    },
    arcsilist: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      showslug: ''
    }
  },
  computed: {
    episodeImage () {
      return this.episode.image_url.length > 0 ? this.episode.image_url : this.arcsilist.find(item => item.id === this.episode.shows[0].id).cover_image_url
    }
  },
  created () {
    this.showslug = this.arcsilist.find(item => item.id === this.episode.shows[0].id).archive_lahmastore_base_url
  }
}
</script>

<style lang="scss" scoped>
.latest-arcsi-blokk {
  .arcsi-img {
    height: 400px;
    width: 100%;
    overflow: hidden;
    img {
      object-fit: cover;
      min-height: 100%;
      min-width: 100%;
    }
  }
}
.tag {
  padding: 0.2rem 0.5rem;
  margin-right: 0.5rem;
  @apply bg-white;
}

</style>
