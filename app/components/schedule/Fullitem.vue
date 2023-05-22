<template>
  <div v-if="show" class="dayblock" :class="showAirCheck(show.name) ? 'onair' : ''">
    <div class="container mx-auto sm:flex show-basic-infos">
      <div class="mr-4 timing-infos">
        <div class="mb-2 time-block sm:mb-0">
          {{ removeSeconds(show.start) }}
          <img src="@/assets/img/arrow-schedule.svg" alt="" class="inline-block w-8 pb-1">
          {{ removeSeconds(show.end) }}
        </div>
        <div class="onairshow">
          <span class="text-red-600">●</span>
          On Air
        </div>
      </div>
      <div class="flex justify-between w-full schedule-infos">
        <div v-if="showAirCheck(show.name)" class="xsm:flex">
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
               <div v-sanitize="[ sanitizeOptions, onAirDescription ]" class="description-text" />
            </div>
          </div>
        </div>
        <div v-else-if="opened" class="xsm:flex">
          <div class="mr-4 onair-image">
            <NuxtLink :to="'/shows/' + show.archive_lahmastore_base_url" class="block mb-2">
              <img :src="show.cover_image_url" :alt="show.name">
            </NuxtLink>
          </div>
          <div class="onair-infos">
            <NuxtLink :to="'/shows/' + show.archive_lahmastore_base_url" class="block mb-2">
              <b>{{ show.name }} </b>
            </NuxtLink>
            <div class="text-sm description">
              <div v-sanitize="[ sanitizeOptions, show.description ]" class="description-text" />
              <p v-if="latestEpisodeData" class="mt-2">
                Episode highlight:
                <NuxtLink :to="latestEpisodeLink">
                  <b>{{ latestEpisodeTitle }}</b>
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <NuxtLink :to="'/shows/' + show.archive_lahmastore_base_url" class="block">
            <b>{{ show.name }}</b>
          </NuxtLink>
        </div>
        <div v-if="!showAirCheck(show.name)">
          <a href="#" @click.prevent="openShowDetails">
            <i v-if="opened" class="fa fa-chevron-up" aria-hidden="true" />
            <i v-else class="fa fa-chevron-down" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { arcsiBaseURL, config } from '~/constants'

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
      latestEpisodeData: null,
      sanitizeOptions: {
        allowedTags: ['b', 'i', 'em', 'strong', 'br', 'a', 'sup', 'sub'],
        allowedAttributes: {
          a: ['*']
        }
      }
    }
  },
  computed: {
    ...mapGetters({   
      streamShowTitle: 'player/getStreamShowTitle',
      streamEpisodeTitle: 'player/getStreamEpisodeTitle',
      onAirImage: 'player/getStreamEpisodeImageURL'
    }),
    isTouchEnabled () {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
    },
    onAirDescription () {
      const descriptionFromArcsi = this.latestEpisodeData?.description
      return descriptionFromArcsi || this.show.description
    },
    latestEpisodeTitle () {
      if (!this.latestEpisodeData) {
        return this.show.name
      }
      const episodeTitleFromArcsi = this.latestEpisodeData?.name
      return episodeTitleFromArcsi ? `${episodeTitleFromArcsi}` : this.show.name
    },
    latestEpisodeLink () {
      const baseLink = '/shows/' + this.show.archive_lahmastore_base_url
      if (!this.latestEpisodeData) {
        return baseLink
      }
      const episodeIdFromArcsi = this.latestEpisodeData?.name_slug
      return episodeIdFromArcsi ? `/shows/${this.show.archive_lahmastore_base_url}/${episodeIdFromArcsi}` : baseLink
    }
  },
  mounted () {
    this.getShowInfos()
  },
  methods: {
    showAirCheck (showname) {
      if (this.streamShowTitle && this.slugify(this.streamShowTitle) === this.slugify(showname)) {
        return true
      }
    },
    openShowDetails () {
      this.opened = !this.opened
      if (this.opened && !this.showAirCheck(this.show.name)) {
        this.getShowInfos()
      }
    },
    getShowInfos () {
      this.$axios.get(arcsiBaseURL + '/show/' + this.show.id, config)
        .then((res) => {
          this.latestEpisodeData = this.getLatestEpisode(res.data)
        })
        .catch((error) => {
          console.log(error)
          this.$nuxt.error({ statusCode: 404, message: 'Show archive not found' })
        })
    },
    // Note: we currently show future and unarchived episodes too (see "Episode highlight" wording in HTML render part above)
    getLatestEpisode (currentShow) {
      const sortedItems = currentShow.items
        .sort((a, b) => b.id - a.id)
      return sortedItems[0]
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
            min-width: 9rem;
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
        @media (min-width: $small-width) and (max-width: $mobile-width) {
            width: 100px;
        }
        @media (max-width: $small-width) {
            margin: 1rem 0;
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
