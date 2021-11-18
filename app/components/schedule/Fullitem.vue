<template>
  <div :class="showAirCheck(0, show.name) ? 'dayblock onair' : 'dayblock'">
    <div class="onairshow">
      <span class="text-red-600">●</span>
      On Air
    </div>
    <div class="show-basic-infos">
      {{ removeSeconds(show.start) }}
      <img src="@/assets/img/arrow-schedule.svg" alt="" class="inline-block w-10">
      {{ removeSeconds(show.end) }}
      <span class="hidden md:inline-block"> - </span>
      <nuxt-link :to="'/shows/' + show.archive_lahmastore_base_url" class="block md:inline-block">
        <b>{{ show.name }}</b>
      </nuxt-link>
      {{ showAirCheck(0, show.name) && ' | ' + streamEpisodeTitle }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      interval: null,
      nowPlaying: {}
    }
  },
  computed: {
    isTouchEnabled () {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
    },
    streamShowTitle () {
      if (!this.nowPlaying) {
        return false
      } else if (this.nowPlaying?.live?.is_live) {
        return this.nowPlaying?.live?.streamer_name
      } else {
        return this.nowPlaying?.now_playing?.song.artist
      }
    },
    streamEpisodeTitle () {
      if (!this.nowPlaying) {
        return false
      } else if (this.nowPlaying?.live?.is_live) {
        return this.nowPlaying?.live?.song?.title
      } else {
        return this.nowPlaying?.now_playing?.song?.title
      }
    }
  },
  beforeDestroy () {
    // prevent memory leak
    clearInterval(this.interval)
  },
  created () {
    // update the time every minute
    this.interval = setInterval(() => {
      this.checkNowPlaying()
    }, 60 * 1000)
  },
  methods: {
    showAirCheck (index, showname) {
      if (index === 0 && this.streamShowTitle && this.slugify(this.streamShowTitle) === this.slugify(showname)) {
        return true
      }
    },
    checkNowPlaying () {
      this.$axios.get(this.streamServer).then((response) => {
        this.nowPlaying = response.data
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dayblock {
    @apply flex flex-row md:px-8 py-3 px-3;
    .show-basic-infos {
        position: relative;
        width: 100%;
    }
    &:hover {
      @media (min-width: $tablet-width) {
        background: rgba(255, 255, 255, 0.5);
      }
    }
    .onairtext {
    text-transform: uppercase;
    }
}
.onairshow {
    opacity: 0;
    padding-right: 1rem;
    white-space: nowrap;
    @media (max-width: $mobile-width) {
      display: none;
    }
}
.onair {
    @apply bg-white;
    .onairshow {
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
</style>
