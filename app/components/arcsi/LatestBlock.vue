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
    <div v-if="episodeTags?.length" class="flex items-center mt-6 tags flex-wrap">
      <div v-for="(tag, index) in episodeTags" :key="index + tag.id + tag.clean_name" class="inline-block">
        <div v-if="tag.clean_name.length > 0" class="tag-block">
          <NuxtLink :to="`/tag/${tag.clean_name}`">
            {{ tag.display_name }}
          </NuxtLink>
        </div>
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
  data() {
    return {
      showslug: ''
    }
  },
  computed: {
    episodeImage() {
      return this.episode.image_url.length > 0 ? this.episode.image_url : this.arcsilist.find(item => item.id === this.episode.shows[0].id).cover_image_url
    },
    episodeLink() {
      if (!this.episode.name_slug) {
        return false
      }
      return this.episode.name_slug
    },
    episodeTags() {
      if (!this.episode.tags) {
        return false
      }
      return this.episode.tags.filter(tag => tag.display_name.length > 0).slice(0,5).sort((a, b) => a?.clean_name.localeCompare(b?.clean_name))
    }
  },
  created() {
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
