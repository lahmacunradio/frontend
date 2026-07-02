<template>
  <div v-if="episode" class="latest-arcsi-blokk">
    <NuxtLink :to="`/shows/${showSlug}/${episodeSlug}`" class="episode-block relative block w-full mb-2 bg-white">
      <div class="absolute bottom-0 z-10 w-full p-2 text-center text-white bg-black">
        <b>{{ episode.shows?.[0]?.name || '' }}</b>
      </div>
      <div class="arcsi-img aspect-ratio-1/1">
        <img class="episode-img block" :src="episodeImage" :alt="episode.name">
      </div>
      <div class="episode-desc p-6">
        <div class="episode-description">
          {{ episode.description && truncate(stripHTMLTags(episode.description), 200) }}
        </div>
      </div>

    </NuxtLink>
    <NuxtLink :to="`/shows/${showSlug}/${episodeSlug}`">
      <h5>{{ episode.name }}</h5>
    </NuxtLink>
    <NuxtLink :to="`/shows/${showSlug}`">
      <p class="text-white">
        Date: {{ $moment(episode.play_date).format('yyyy. MMMM Do.') }}
      </p>
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
    showList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showSlug: ''
    }
  },
  computed: {
    episodeImage() {
      return this.episode.image_url.length > 0 ? this.episode.image_url : this.showList.find(show => show.id === this.episode.shows[0].id)?.cover_image_url
    },
    episodeSlug() {
      if (!this.episode.name_slug) {
        return false
      }
      return this.episode.name_slug
    },
    episodeTags() {
      if (!this.episode.tags) {
        return false
      }
      return this.episode.tags.filter(tag => tag.display_name.length > 0).sort((a, b) => a?.clean_name.localeCompare(b?.clean_name))
    }
  },
  created() {
    this.showSlug = this.showList.find(show => show.id === this.episode.shows[0].id)?.archive_lahmastore_base_url
  }
}
</script>

<style lang="scss" scoped>
.latest-arcsi-blokk {
  margin-bottom: 0.5rem;

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

.episode-block {
  overflow: hidden;

  .episode-desc {
    display: none;
    position: absolute;
    top: 0;
    overflow-wrap: break-word;
    max-width: 100%;
  }

  .episode-img {
    opacity: 1;
    transition: opacity 0.3s;
  }

  img {
    min-height: 100%;
    min-width: 100%;
    object-fit: cover;
  }

  &:hover {
    .episode-img {
      opacity: 0;
    }

    .episode-desc {
      display: block;
    }
  }
}

.tag {
  padding: 0.2rem 0.5rem;
  margin-right: 0.5rem;
  @apply bg-white;
}
</style>
