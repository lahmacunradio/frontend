<template>
  <div v-if="show" class="dayblock" :class="{opened: opened}">
    <div class="w-full show-basic-infos">
      <a href="#" class="flex justify-between timing-infos w-full" @click.prevent="openShow">
        <div class="mb-2 time-block sm:mb-0">
          {{ removeSeconds(show.start) }}-{{ removeSeconds(show.end) }} <br class="sm:hidden block">
          <b>{{ show.name }}</b>
        </div>
        <div>
          <i v-if="opened" class="fa fa-chevron-up" aria-hidden="true" />
          <i v-else class="fa fa-chevron-down" aria-hidden="true" />
        </div>
      </a>
      <div class="w-full schedule-infos">
        <div v-if="opened" class="md:flex">
          <div class="onair-image">
            <NuxtLink :to="latestEpisodeLink" class="block mb-2">
              <img :src="latestEpisodeImage" :alt="show.name">
            </NuxtLink>
          </div>
          <div class="onair-infos">
            <NuxtLink :to="latestEpisodeLink" class="block mb-2">
              <b>{{ latestEpisodeTitle }} </b>
            </NuxtLink>
            <div class="mb-2 text-sm onair-meta">
              {{ showFrequency(show.frequency, show.week) }} |
              Language: <span v-sanitize.nothing="getLanguageGraph(show.language)" class="language" />
            </div>
            <div class="text-sm description">
              {{ latestEpisodeDescription }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* rework to fetch show items on open */
import { mediaServerURL } from '~/constants'

export default {
  props: {
    show: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      opened: false,
      loadedShow: null
    }
  },
  computed: {
    isTouchEnabled () {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
    },
    latestEpisodeImage () {
      if (!this.show.items) {
        return false
      }
      const episodeImageFromArcsi = this.loadedShow?.[0]?.image_url
      return episodeImageFromArcsi ? `${mediaServerURL}/${this.show.archive_lahmastore_base_url}/${episodeImageFromArcsi}` : this.show.cover_image_url
    },
    latestEpisodeDescription () {
      if (!this.show.items) {
        return false
      }
      const descriptionFromArcsi = this.loadedShow?.[0]?.description
      return descriptionFromArcsi || this.show.description
    },
    latestEpisodeTitle () {
      if (!this.show.items) {
        return this.show.name
      }
      const episodeTitleFromArcsi = this.loadedShow?.[0]?.name
      return episodeTitleFromArcsi ? `${episodeTitleFromArcsi}` : this.show.name
    },
    latestEpisodeLink () {
      const baseLink = '/shows/' + this.show.archive_lahmastore_base_url
      if (!this.show.items) {
        return baseLink
      }
      const episodeIdFromArcsi = this.loadedShow?.[0]?.id
      return episodeIdFromArcsi ? `/shows/${this.show.archive_lahmastore_base_url}/${episodeIdFromArcsi}` : baseLink
    }
  },
  mounted () {
  },
  methods: {
    sortItems () {
      // obsolete
      const showItems = [...this.show.items]
      this.loadedShow = showItems.sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
    },
    openShow () {
      this.opened = !this.opened
      /* fetch and get latest js.(find) */
    }
  }
}
</script>

<style lang="scss" scoped>
.dayblock {
  @apply flex flex-row p-4 border-b border-black;
  .show-basic-infos {
    position: relative;
    .timing-infos {
      min-width: 9rem;
    }
  }
  &:hover:not(.opened) {
    @media (min-width: $tablet-width) {
      @apply text-white;
    }
  }
  &.opened {
    @apply p-0;
    .timing-infos {
      background: rgba(255, 255, 255, 0.5);
      @apply p-4;
    }
    .schedule-infos {
      @apply pb-4 px-4;
      background: rgba(255, 255, 255, 0.5);
    }
  }
  .onairtext {
    text-transform: uppercase;
  }
  .onair-image {
    max-width: 200px;
    @media (min-width: $notebook-width) {
      max-width: 300px;
    }
    @apply mb-4 md:mb-0 md:mr-4;
  }
  .onair-infos {
    overflow: auto;
  }
}

.onairshow {
  opacity: 0;
  text-transform: uppercase;
  font-weight: bold;
  white-space: nowrap;
  display: none;
}

.language {
  display: inline-block;
  vertical-align: middle;
}
</style>
