<template>
  <div v-if="episode" class="latest-arcsi-blokk">
    <NuxtLink :to="`/shows/${showslug}/${episodeLink}`">
      <div class="mb-4 arcsi-img aspect-ratio-1/1">
        <img class="block" :src="episodeImage">
      </div>
    </NuxtLink>
    <NuxtLink :to="`/shows/${showslug}/${episodeLink}`">
      <h5>{{ episode.name }}</h5>
    </NuxtLink>
    <NuxtLink :to="`/shows/${showslug}`">
      <h5 class="text-white">
        {{ episode.shows[0].name }}
      </h5>
    </NuxtLink>
    <div v-if="false" class="flex items-center mt-6 tags">
      <!-- tags are not needed for now -->
      <div class="tag-block">
        dub
      </div>
      <div class="tag-block">
        psychedelic
      </div>
      <div class="tag-block">
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
    },
    episodeLink () {
      if (!this.episode.play_file_name) {
        return false
      }
      return this.episode.play_file_name.replace('.mp3', '')
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
    height: auto;
    width: 100%;
    overflow: hidden;
    img {
      object-fit: cover;
      height: 100%;
      width: 100%;
      object-position: center;
    }
  }
}
</style>
