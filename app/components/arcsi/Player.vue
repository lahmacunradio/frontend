<template>
  <div class="arcsiplayer">
    <template>
      <audio
        id="arcsiplayer"
        ref="arcsiplayer"
        preload="metadata"
        :title="episode.shows[0].name + ' - ' + episode.name"
        :src="source"
        :autoplay="isSafari"
        @play="setPlayState()"
        @pause="setPauseState()"
        @loadedmetadata="getDuration()"
        @loadeddata="findIfArcsiSeek()"
        @timeupdate.passive="debounceFunction(getPosition(), 1000)"
        @ended="stopArcsi()"
      />
    </template>
    <div v-if="duration && duration === 0" class="flex items-center py-4 preload">
      <img src="@/assets/img/preloader.svg" class="h-4 mr-4" alt="preload">
      <p>Preloading...</p>
    </div>
    <div v-else class="flex flex-col items-start justify-between w-full md:items-center md:flex-row">
      <div class="flex pt-4 pb-2 md:py-4 md:pr-4">
        <button class="w-4 mr-4 cursor-pointer" @click="toggleArcsi">
          <span v-if="arcsiIsPlaying && seek === 0 && !isSafari">
            <i class="fa fa-spinner fa-pulse fa-fw" aria-hidden="true" />
          </span>
          <span v-else-if="arcsiIsPlaying">
            <i class="fa fa-pause" aria-hidden="true" />
          </span>
          <span v-else>
            <i class="fa fa-play" aria-hidden="true" />
          </span>
        </button>
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
      <div class="flex items-center w-full md:mr-6 md:w-64 min-w-1/4 2xl:min-w-0" :class="{'mb-2': isTouchEnabled}">
        <a href="#" class="mr-2 text-xs" @click.prevent="seekBackward(10)" @dblclick.prevent="seekBackward(20)">
          <i class="fa fa-fast-backward" aria-hidden="true" />
        </a>
        <div class="text-sm seek-time">
          {{ seek && seek > 1 ? currentSeek : '0:00:00' }}
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
        <a href="#" class="ml-2 text-xs" @click.prevent="seekForward(10)" @dblclick.prevent="seekForward(20)">
          <i class="fa fa-fast-forward" aria-hidden="true" />
        </a>
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
          class="align-middle"
          type="range"
          min="0"
          max="1"
          step="0.01"
          @input.passive="volumeBar($event.target.value)"
        >
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
    source: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      audio: null,
      currentVolume: '1',
      currentProgress: '0',
      duration: 0,
      seek: 0,
      timeOutHelper: null
    }
  },
  computed: {
    progress () {
      if (!this.audio) {
        return false
      }
      return (this.seek / this.duration).toFixed(2)
    },
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
      return this.arcsiList?.find(show => show.id === showID)
    },
    isTouchEnabled () {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
    },
    arcsiIsPlaying () {
      if (!this.$store.state.player.isArcsiPlaying) {
        return false
      }
      return this.$store.state.player.isArcsiPlaying
    },
    isSafari () {
      return (navigator.vendor.match(/apple/i) || '').length > 0
    }
  },
  watch: {
    '$store.state.player.isStreamPlaying': {
      handler () {
        if (this.$store.state.player.isStreamPlaying) {
          this.audio?.pause()
        }
      },
      deep: true
    }
  },
  created () {
    this.audio = document.getElementById('arcsiplayer')
  },
  mounted () {
    if (this.currentVolume !== this.$store.state.player.arcsiVolume) {
      this.currentVolume = this.$store.state.player.arcsiVolume
      this.setVolume(parseFloat(this.$store.state.player.arcsiVolume))
    }
    this.setMetaData()
    this.$store.commit('player/currentlyPlayingArcsi', this.episode)
    if (!this.isSafari) {
      this.pauseArcsi()
    }
  },
  beforeUpdate () {
    if (this.duration === 0) {
      this.findIfArcsiSeek()
    }
    this.audio = document.getElementById('arcsiplayer')
  },
  beforeDestroy () {
    clearTimeout(this.timeOutHelper)
    this.timeOutHelper = null
    if (this.arcsiIsPlaying) {
      this.$store.commit('player/currentlyPlayingArcsi', this.episode)
    }
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('pause', () => null)
    }
  },
  destroyed () {
    this.audio = null
  },
  methods: {
    setPlayState () {
      const playHistory = {
        episodeID: this.episode.id,
        value: Math.round(this.seek)
      }
      this.$store.commit('player/currentlyPlayingArcsi', this.episode)
      this.$store.commit('player/setArcsiProgressHistory', playHistory)
      this.$store.commit('player/isArcsiPlaying', true)
      this.$store.commit('player/isStreamPlaying', false)
    },
    setPauseState () {
      const playHistory = {
        episodeID: this.episode.id,
        value: Math.round(this.seek)
      }
      this.$store.commit('player/isArcsiPlaying', false)
      this.$store.commit('player/setArcsiProgressHistory', playHistory)
    },
    setMetaData () {
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
          this.toggleArcsi()
        })
      }
    },
    async playArcsi () {
      await this.audio?.play()
      this.setPlayState()
      this.setMetaData()

      // Google Analytics 4 event
      gtag('event', 'Arcsi play', {
        Show: this.episode.shows[0].name,
        Episode: this.episode.name
      })
    },
    pauseArcsi () {
      if (this.arcsiIsPlaying) {
        this.audio?.pause()
      }
      this.setPauseState()
      this.setMetaData()
    },
    toggleArcsi () {
      const arcsiReady = this.$refs.arcsiplayer?.readyState > 2
      if (!arcsiReady && this.seek === 0) {
        return false
      }
      if (this.arcsiIsPlaying) {
        this.pauseArcsi()
      } else {
        this.playArcsi()
      }
    },
    stopArcsi () {
      if (this.audio) {
        this.$refs.arcsiplayer.currentTime = 0
        this.audio.pause()
      }
      const playHistory = {
        episodeID: this.episode.id,
        value: 0
      }
      this.currentProgress = '0'
      this.$store.commit('player/setArcsiProgressHistory', playHistory)
      this.$store.commit('player/isArcsiPlaying', false)
    },
    setVolume (volume) {
      if (this.audio) {
        this.audio.volume = volume
      }
      this.currentVolume = volume
    },
    volumeBar (value) {
      this.setVolume(parseFloat(value))
      this.$store.commit('player/setArcsiVolume', value)
    },
    seekBar (value) {
      this.$refs.arcsiplayer.currentTime = this.duration * parseFloat(value)
      const playHistory = {
        episodeID: this.episode.id,
        value: Math.round(this.seek)
      }
      this.$store.commit('player/setArcsiProgressHistory', playHistory)
    },
    setSeek (seek) {
      if (!this.$refs.arcsiplayer) {
        return false
      }
      this.$refs.arcsiplayer.currentTime = seek
    },
    getDuration () {
      this.duration = this.$refs.arcsiplayer?.duration
    },
    getPosition () {
      this.seek = this.$refs.arcsiplayer?.currentTime || 0
    },
    async findIfArcsiSeek () {
      if (!this.$refs.arcsiplayer) {
        return false
      }
      const arcsiReady = await this.$refs.arcsiplayer?.readyState > 2
      const arcsiPlayerSeek = await this.$store.state.player.arcsiPlayHistory[this.episode.id]
      const arcsiPlayPosition = await arcsiPlayerSeek?.playPosition

      if (arcsiReady && this.arcsiIsPlaying && arcsiPlayerSeek && arcsiPlayPosition !== 0) {
        this.timeOutHelper = setTimeout(() => {
          this.setSeek(arcsiPlayPosition)
          this.playArcsi()
        }, 3000)
      } else if (arcsiReady && this.arcsiIsPlaying) {
        this.timeOutHelper = setTimeout(() => {
          this.setSeek(0)
          this.playArcsi()
        }, 1000)
      } else {
        this.pauseArcsi()
      }
    },
    seekBackward (time) {
      if (this.seek < time) {
        return false
      }
      this.setSeek(this.seek - time)
    },
    seekForward (time) {
      if (this.seek > this.duration - time) {
        return false
      }
      this.setSeek(this.seek + time)
    }
  }
}
</script>

<style lang="scss" scoped>
h5 {
  line-height: 1.2em;
  a {
    color: $black-color;
    &:hover {
      text-decoration: underline;
    }
  }
  span {
    font-weight: normal;
  }
}
#myProgress {
  width: 100%;
  background-color: $black-color;
    input[type="range" i]::-webkit-slider-thumb {
      opacity: 0;
      transition: opacity 0.2s;
      transform: translateY(3px);
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
  height: 0.8rem;
  -webkit-appearance: none !important;
  appearance: none;
  margin-top: -0.8rem;
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

/* Only for Safari  */
@media not all and (min-resolution:.001dpcm){ @supports (-webkit-appearance:none) {
  #myVolume {
    input[type="range" i]::-webkit-slider-thumb {
      opacity: 1;
    }
  }
  #volumeRange {
    height: 0.4rem;
    border-radius: 1rem;
    -webkit-appearance: none !important;
    appearance: none;
    background-color: $black-color;

  }
}}

</style>
