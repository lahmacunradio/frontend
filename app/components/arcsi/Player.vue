<template>
  <div class="arcsiplayer">
    <div v-if="duration === 0" class="flex items-center py-4 preload">
      <img src="/img/preloader.svg" class="h-4 mr-4">
      <p>Preloading...</p>
    </div>
    <div v-else class="flex flex-col items-start justify-between w-full md:items-center md:flex-row">
      <div class="flex py-4">
        <button class="mr-4" @click="playArcsi">
          <span v-if="playing">
            <i class="fa fa-pause" aria-hidden="true" />
          </span>
          <span v-else>
            <i class="fa fa-play" aria-hidden="true" />
          </span>
        </button>
        <!-- Stop button not needed?
        <button @click="stopArcsi">
          <i class="fa fa-stop" aria-hidden="true" />
        </button>
        -->
        <h5 v-if="arcsiShow">
          <NuxtLink :to="`/shows/${arcsiShow.archive_lahmastore_base_url}`">
            {{ episode.shows[0].name }}
          </NuxtLink>
          <span> - </span>
          <NuxtLink :to="`/shows/${arcsiShow.archive_lahmastore_base_url}/${episode.id}`">
            {{ episode.name }}
          </NuxtLink>
        </h5>
        <h5 v-else>
          {{ episode.shows[0].name + ' - ' + episode.name }}
        </h5>
      </div>
      <div class="flex items-center w-full md:mr-2 md:w-64">
        <div class="text-sm seek-time">
          {{ seek ? currentSeek : '0:00:00' }}
        </div>
        <div id="myProgress" class="mx-2 my-2">
          <div id="myBar" :style="{width: (progress * 100).toFixed(2) + '%'}" />
          <input
            id="progressingRange"
            :value="progress"
            type="range"
            min="0"
            max="1"
            step="0.001"
            @change="seekBar($event.target.value)"
          >
        </div>
        <div class="text-sm">
          {{ currentDuration }}
        </div>
      </div>
      <div v-if="!isTouchEnabled" id="myVolume" class="my-2 whitespace-nowrap">
        <div class="inline-block w-4 align-middle">
          <i v-if="currentVolume === '0'" class="fa fa-microphone-slash" />
          <i v-else-if="currentVolume < '0.3'" class="fa fa-volume-off" />
          <i v-else-if="currentVolume < '0.7'" class="fa fa-volume-down" />
          <i v-else class="fa fa-volume-up" />
        </div>
        <input
          id="volumeRange"
          v-model="currentVolume"
          class="align-text-top"
          type="range"
          min="0"
          max="1"
          step="0.01"
          @change="volumeBar($event.target.value)"
        >
      </div>
    </div>
  </div>
</template>

<script>
import VueHowler from 'vue-howler'

export default {
  mixins: [VueHowler],
  props: {
    episode: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      currentVolume: '1',
      currentProgress: this.progress || '0'
    }
  },
  computed: {
    currentDuration () {
      return this.convertHourMinuteSecond(this.duration)
    },
    currentSeek () {
      return this.convertHourMinuteSecond(this.seek)
    },
    playerData () {
      return {
        player: 'arcsi',
        data: this.episode
      }
    },
    arcsiList () {
      return [...this.$store.state.arcsiShows]
    },
    arcsiShow () {
      if (!this.arcsiList) {
        return false
      }
      const showID = this.episode?.shows?.[0].id
      const showObject = this.arcsiList?.find(show => show.id === showID)
      return showObject
    },
    isTouchEnabled () {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
    },
    arcsiIsPlaying () {
      if (!this.$store.state.player.isArcsiPlaying) {
        return false
      }
      return this.$store.state.player.isArcsiPlaying
    }
  },
  watch: {
    '$store.state.player.isStreamPlaying': {
      handler () {
        if (this.$store.state.player.isStreamPlaying) {
          this.pauseArcsi()
        }
      },
      deep: true
    }
  },
  mounted () {
    if (this.currentVolume !== this.$store.state.player.arcsiVolume) {
      this.currentVolume = this.$store.state.player.arcsiVolume
      this.setVolume(parseFloat(this.$store.state.player.arcsiVolume))
    }
    this.findIfArcsiSeek()
    this.$store.commit('player/currentlyPlayingArcsi', this.episode)
    // Allow pausing from the mobile metadata update.
    navigator.mediaSession.setActionHandler('pause', () => {
      this.togglePlayback()
    })
  },
  beforeUpdate () {
    if (this.duration === 0) {
      this.findIfArcsiSeek()
    }
  },
  beforeDestroy () {
    if (this.playing) {
      this.$store.commit('player/currentlyPlayingArcsi', this.episode)
      // Allow pausing from the mobile metadata update.
      navigator.mediaSession.setActionHandler('pause', () => null)
    }
  },
  methods: {
    playArcsi () {
      this.togglePlayback()
      const playHistory = {
        episodeID: this.episode.id,
        value: this.progress
      }
      this.$store.commit('player/currentlyPlayingArcsi', this.episode)
      this.$store.commit('player/setArcsiProgressHistory', playHistory)
      if (this.playing) {
        this.$store.commit('player/isArcsiPlaying', false)
      } else {
        this.$store.commit('player/isArcsiPlaying', true)
        // Update the browser metadata for browsers that support it (i.e. Mobile Chrome)
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: this.episode.name,
            artist: this.episode.shows[0].name,
            artwork: [
              { src: this.episode.image_url }
            ]
          })
          // Allow pausing from the mobile metadata update.
          navigator.mediaSession.setActionHandler('pause', () => {
            this.togglePlayback()
          })
        }
      }
      this.$store.commit('player/isStreamPlaying', false)
    },
    pauseArcsi () {
      this.pause()
      this.$store.commit('player/isArcsiPlaying', false)
    },
    stopArcsi () {
      this.stop()
      const playHistory = {
        episodeID: this.episode.id,
        value: 0
      }
      this.currentProgress = '0'
      this.$store.commit('player/setArcsiProgressHistory', playHistory)
      this.$store.commit('player/isArcsiPlaying', false)
      navigator.mediaSession.setActionHandler('pause', () => null)
    },
    volumeBar (value) {
      this.setVolume(parseFloat(value))
      this.$store.commit('player/setArcsiVolume', value)
    },
    seekBar (value) {
      this.setProgress(parseFloat(value))
      const playHistory = {
        episodeID: this.episode.id,
        value: parseFloat(value)
      }
      this.$store.commit('player/setArcsiProgressHistory', playHistory)
    },
    async findIfArcsiSeek () {
      const arcsiPlayerSeek = await this.$store.state.player.arcsiPlayHistory[this.episode.id]
      const arcsiPlayPosition = await arcsiPlayerSeek?.playPosition

      if (this.arcsiIsPlaying && arcsiPlayerSeek && arcsiPlayPosition !== 0) {
        setTimeout(() => {
          this.setProgress(arcsiPlayPosition)
          this.playArcsi()
        }, 1000)
      } else if (this.arcsiIsPlaying) {
        setTimeout(() => {
          this.setProgress(0)
          this.playArcsi()
        }, 1000)
      } else {
        this.stopArcsi()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#myProgress {
  width: 100%;
  background-color: $black-color;
    input[type="range" i]::-webkit-slider-thumb {
      opacity: 0;
      transition: opacity 0.2s;
      transform: translateY(5px);
    }
    &:hover {
      input[type="range" i]::-webkit-slider-thumb {
        opacity: 1;
      }
    }
}

#myBar {
  width: 1%;
  height: 0.4rem;
  background-color: $lahma-pink;
}

#progressingRange {
  width: 100%;
  -webkit-appearance: none !important;
  appearance: none;
  margin-top: -1rem;
  float: left;
  background: transparent;
}

.seek-time {
  color: $lahma-pink;
}

#myVolume {
  input[type="range" i]::-webkit-slider-thumb {
    opacity: 0;
    transition: opacity 0.2s;
  }
    &:hover {
      input[type="range" i]::-webkit-slider-thumb {
        opacity: 1;
      }
    }
}

</style>
