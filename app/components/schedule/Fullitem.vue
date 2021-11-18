<template>
  <div v-if="show && nowPlaying" class="dayblock" :class="showAirCheck(show.name) ? 'onair' : ''">
    <div class="container mx-auto sm:flex show-basic-infos">
      <div class="mr-4 timing-infos">
        <div class="mb-2 time-block sm:mb-0">
          {{ removeSeconds(show.start) }}
          <img src="@/assets/img/arrow-schedule.svg" alt="" class="inline-block w-10">
          {{ removeSeconds(show.end) }}
        </div>
        <div class="onairshow">
          <span class="text-red-600">●</span>
          On Air
        </div>
      </div>
      <div class="flex justify-between w-full schedule-infos">
        <div v-if="showAirCheck(show.name)" class="flex">
          <div class="mr-4 onair-image">
            <img :src="onAirImage" :alt="show.name">
          </div>
          <div class="onair-infos">
            <NuxtLink :to="'/shows/' + show.archive_lahmastore_base_url" class="block mb-2">
              <b>{{ show.name }} {{ showAirCheck(show.name) && ' | ' + streamEpisodeTitle }} </b>
            </NuxtLink>
            <div class="mb-2 text-sm onair-meta">
              {{ showFrequency(show.frequency, show.week) }} |
              Language: <span v-sanitize.nothing="getLanguageGraph(show.language)" class="language" />
            </div>
            <div class="text-sm description">
              {{ onAirDescription }}
            </div>
          </div>
        </div>
        <div v-else-if="opened" class="flex">
          <div class="mr-4 onair-image">
            <NuxtLink :to="latestEpisodeLink" class="block mb-2">
              <img :src="latestEpisodeImage" :alt="show.name">
            </NuxtLink>
          </div>
          <div class="onair-infos">
            <NuxtLink :to="latestEpisodeLink" class="block mb-2">
              <b>{{ latestEpisodeTitle }} </b>
            </NuxtLink>
            <div class="text-sm description">
              {{ onAirDescription }}
            </div>
          </div>
        </div>
        <div v-else>
          <NuxtLink :to="'/shows/' + show.archive_lahmastore_base_url" class="block">
            <b>{{ show.name }}</b>
          </NuxtLink>
        </div>
        <div v-if="!showAirCheck(show.name)">
          <a href="#" @click.prevent="opened = !opened">
            <i v-if="opened" class="fa fa-chevron-up" aria-hidden="true" />
            <i v-else class="fa fa-chevron-down" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mediaServerURL } from '~/constants'

export default {
  props: {
    show: {
      type: Object,
      required: true
    },
    nowPlaying: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      opened: false
    }
  },
  computed: {
    isTouchEnabled () {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
    },
    streamShowTitle () {
      if (!this.nowPlaying.now_playing) {
        return false
      } else if (this.nowPlaying?.live?.is_live) {
        return this.nowPlaying?.live?.streamer_name
      } else {
        return this.nowPlaying?.now_playing?.song.artist
      }
    },
    streamEpisodeTitle () {
      if (!this.nowPlaying.now_playing) {
        return false
      } else if (this.nowPlaying?.live?.is_live) {
        return this.nowPlaying?.live?.song?.title
      } else {
        return this.nowPlaying?.now_playing?.song?.title
      }
    },
    onAirImage () {
      if (!this.nowPlaying.now_playing) {
        return false
      }
      const streamImage = this.nowPlaying.now_playing?.song?.art
      return this.showAirCheck(this.show.name) ? streamImage : this.show.cover_image_url
    },
    latestEpisodeImage () {
      if (!this.show.items) {
        return false
      }
      const getLastIndex = this.show.items.length - 1
      const episodeImageFromArcsi = this.show.items?.[getLastIndex]?.image_url
      return episodeImageFromArcsi ? `${mediaServerURL}/${this.show.archive_lahmastore_base_url}/${episodeImageFromArcsi}` : this.show.cover_image_url
    },
    onAirDescription () {
      if (!this.nowPlaying.now_playing && this.show.items) {
        return false
      }
      const getLastIndex = this.show.items.length - 1
      const descriptionFromArcsi = this.show.items?.[getLastIndex]?.description
      return descriptionFromArcsi || this.show.description
    },
    latestEpisodeTitle () {
      if (!this.show.items) {
        return this.show.name
      }
      const getLastIndex = this.show.items.length - 1
      const episodeTitleFromArcsi = this.show.items?.[getLastIndex]?.name
      return episodeTitleFromArcsi ? `${this.show.name} - ${episodeTitleFromArcsi}` : this.show.name
    },
    latestEpisodeLink () {
      const baseLink = '/shows/' + this.show.archive_lahmastore_base_url
      if (!this.show.items) {
        return baseLink
      }
      const getLastIndex = this.show.items.length - 1
      const episodeIdFromArcsi = this.show.items?.[getLastIndex]?.id
      return episodeIdFromArcsi ? `/shows/${this.show.archive_lahmastore_base_url}/${episodeIdFromArcsi}` : baseLink
    }
  },
  methods: {
    showAirCheck (showname) {
      if (this.streamShowTitle && this.slugify(this.streamShowTitle) === this.slugify(showname)) {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dayblock {
    @apply flex flex-row py-4;
    .show-basic-infos {
        position: relative;
        @media (min-width: $tablet-width) {
            max-width: $tablet-width;
        }
        .timing-infos {
            min-width: 130px;
        }
        .time-block {
            white-space: nowrap;
        }
    }
    &:hover {
      @media (min-width: $tablet-width) {
        background: rgba(255, 255, 255, 0.5);
      }
    }
    .onairtext {
        text-transform: uppercase;
    }
    .onair-image {
        width: 150px;
        flex-shrink: 0;
        @media (max-width: $mobile-width) {
            width: 100px;
        }
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

.onair {
    @apply bg-white py-8;
    .onairshow {
        display: block;
        opacity: 1;
        animation: pulse 5s infinite;
    }
    &:hover {
        @apply bg-white;
    }
}

@keyframes pulse {
  0% { opacity: 0.3; }
  30% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0.3; }
}

.language {
  display: inline-block;
  vertical-align: middle;
}
</style>
