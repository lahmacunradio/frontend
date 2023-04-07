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
    <div v-if="duration && duration === 0" class="arcsi-player-preload flex items-center py-4 preload">
      <img src="@/assets/img/preloader.svg" class="h-4 mr-4" alt="preload">
      <p>Preloading...</p>
    </div>
    <div v-else class="arcsi-player-container flex flex-col items-start justify-between w-full md:items-center sm:flex-col md:flex-row">

      <div class="arcsi-player-container-info flex items-center py-2 md:py-4 md:w-1/4">
        <div v-if="arcsiShow" class="arcsi-show-info">
          <h4 class="arcsi-player-container-info-name my-1">
          <NuxtLink :to="`/shows/${arcsiShow.archive_lahmastore_base_url}`">
            {{ episode.shows[0].name }}
          </NuxtLink>
          </h4>
          <h5 class="arcsi-player-container-info-title">
          <NuxtLink :to="`/shows/${arcsiShow.archive_lahmastore_base_url}/${episode.name_slug}`">
            {{ episode.name }}
          </NuxtLink>
          </h5>
        </div>
        <div v-else class="arcsi-nonshow-info">
          {{ episode.shows[0].name + ' - ' + episode.name }}
        </div>
      </div>
      
      <div class="arcsi-player-container-control flex items-center py-2 w-full md:w-4/6 min-w-1/2 2xl:min-w-0" :class="{'mb-2': isTouchEnabled}">
        <!-- <button class="arcsi-player-container-play w-10 h-10 mx-1 text-left cursor-pointer" @click="toggleArcsi">
          <span v-if="arcsiIsPlaying && seek === 0 && !isSafari">
            <i class="arcsi-player-btn-spinner fa fa-spinner fa-pulse fa-fw" aria-hidden="true" />
          </span>
          <span v-else-if="arcsiIsPlaying">
            <i class="arcsi-player-btn-pause fa fa-pause" aria-hidden="true" />
          </span>
          <span v-else>
            <i class="arcsi-player-btn-play fa fa-play" aria-hidden="true" />
          </span>
        </button> -->
         <button class="arcsi-player-container-play text-left cursor-pointer w-8 h-8 mr-2" @click="toggleArcsi">
          <span v-if="arcsiIsPlaying && seek === 0 && !isSafari">
            <i class="arcsi-player-btn-spinner fa fa-spinner fa-pulse fa-fw" aria-hidden="true" />
          </span>
          <span v-else-if="arcsiIsPlaying">
            <img src="@/assets/img/pause-gomb.svg" alt="Pause Lahmacun radio" class="arcsi-player-btn-pause  w-8 h-8 pr-2 text-left cursor-pointer" />
          </span>
          <span v-else>
            <img src="@/assets/img/play_gomb.svg" alt="Play Lahmacun radio" class="arcsi-player-btn-play  w-8 h-8 pr-2 text-left cursor-pointer"  />
          </span>
        </button>
        <!-- <a class="bigplay-button" href="#" @click.prevent="toggle()">
            <img v-if="is_playing" src="@/assets/img/pause-gomb.svg" alt="Pause Lahmacun radio" class="pause-button">
            <img v-else src="@/assets/img/play_gomb.svg" alt="Play Lahmacun radio" class="play-button">
        </a> -->

        <a href="#" class="ml-1 mr-1 my-2" @click.prevent="seekBackward(10)" @dblclick.prevent="seekBackward(20)">
          <i class="arcsi-player-btn-back fa  fa-undo" aria-hidden="true" />
        </a>

        <div id="myProgress" class="mx-2 my-2">
          <div id="myBar" :style="{width: (progress * 100).toFixed(2) + '%'}" />
          <input
            id="progressingRange"
            :value="progress"
            type="range"
            min="0"
            max="1"
            step="0.01"
            @change="seekBar($event.target.value)"
          >
        </div>
        <a href="#" class="ml-1 mr-1 my-2" @click.prevent="seekForward(10)" @dblclick.prevent="seekForward(20)">
          <i class="arcsi-player-btn-fwd fa fa-repeat" aria-hidden="true" />
        </a>
      </div>

      <div class="episode-time flex flex-row items-center ml-1 mr-1 w-1/5">
        <div class="seek-time 2xl:text-base xl:text-sm lg:text-sm md:text-xs sm:text-xs">
          <span> {{ seek && seek > 1 ? currentSeek : '0:00:00' }} </span>
        </div>
        <div class="total-duration 2xl:text-base xl:text-sm lg:text-sm md:text-xs sm:text-xs">
          <span> / {{ currentDuration }}</span>
        </div>
      </div>
      
      <div v-if="!isTouchEnabled" id="myVolume" class="flex justify-end w-1/6 my-2 whitespace-nowrap">
        <div class="arcsi-player-btn-vol inline-block w-4 align-middle ">
          <i v-if="currentVolume === '0'" class="arcsi-player-btn-mute fa fa-microphone-slash" />
          <i v-else-if="currentVolume < '0.3'" class="arcsi-player-btn-low fa fa-volume-off" />
          <i v-else-if="currentVolume < '0.7'" class="arcsi-player-btn-mid fa fa-volume-down" />
          <i v-else class="arcsi-player-btn-high fa fa-volume-up" />
        </div>
        <input
          id="volumeRange"
          v-model="currentVolume"
          class="align-middle w-4/6"
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
import { mapGetters } from 'vuex'

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
      pageTitle: document?.title || '',
      audio: null,
      currentVolume: '1',
      currentProgress: '0',
      duration: 0,
      seek: 0,
      timeOutHelper: null,
      docTitleSetter: null
    }
  },
  computed: {
    ...mapGetters('player', {
      arcsiIsPlaying: 'getArcsiPlayState',
      isStreamPlaying: 'getStreamPlayState',
      arcsiVolume: 'getArcsiVolume',
      arcsiPlayHistory: 'getArcsiPlayHistory'
    }),
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
      return [...this.$store.getters.returnArcsiShows]
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
    isSafari () {
      return (navigator.vendor.match(/apple/i) || '').length > 0
    }
  },
  watch: {
    '$store.state.player.isStreamPlaying': {
      handler () {
        if (this.isStreamPlaying) {
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
    if (this.currentVolume !== this.arcsiVolume) {
      this.currentVolume = this.arcsiVolume
      this.setVolume(parseFloat(this.arcsiVolume))
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
    clearInterval(this.docTitleSetter)
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

      document.title = `🔈 ${this.episode.shows[0].name} - ${this.episode.name}`
      this.docTitleSetter = setInterval(() => {
        if (this.arcsiIsPlaying) {
          document.title = `🔈 ${this.episode.shows[0].name} - ${this.episode.name}`
        } else {
          clearInterval(this.docTitleSetter)
          const currentPageTitle = document.querySelector("meta[property='og:title']").getAttribute('content')
          currentPageTitle ? document.title = currentPageTitle : document.title = 'Lahmacun Radio'
        }
      }, 3000)

      // Google Analytics 3 play event
      // eslint-disable-next-line no-undef
      gtag('event', 'Arcsi play', {
        event_category: this.episode.shows[0].name,
        event_label: this.episode.name,
        value: 1
      })
    },
    pauseArcsi () {
      if (this.arcsiIsPlaying) {
        this.audio?.pause()
      }
      this.setPauseState()
      this.setMetaData()

      clearInterval(this.docTitleSetter)
      const ogTitle = document.querySelector("meta[property='og:title']")
      document.title = ogTitle ? ogTitle.getAttribute('content') : 'Lahmacun radio'
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
      const arcsiPlayerSeek = await this.arcsiPlayHistory[this.episode.id]
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
h4 {
  line-height: 1rem;
  font-size: 0.87rem;
  a {
    color: $black-color;
    &:hover {
      text-decoration: underline;
    }
  }
  @media (max-width: $mobile-width) {
    font-size: 0.75rem;
  }
}
h5 {
  line-height: 1rem;
  font-size: 0.8rem;
  a {
    color: $lahma-pink;
    &:hover {
      text-decoration: underline;
    }
  }
  @media (max-width: $mobile-width) {
    font-size: 0.7rem;
  }
}

.arcsi-player-container {
  @media (max-width: $mobile-width) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.episode-time {
  div {
    line-height: 1.275rem;
    font-size: 0.8rem;
  }
  // div {
  //   @media (min-width: $extralarge-width) {
  //     font-size: 1.2rem;
  //   }
  //   @media (max-width: $extralarge-width ) $largescreen-width) {
  //     font-size: 1rem;
  //   }
  //   @media ( $notebook-width) {
  //     font-size: 0.82rem;
  //   }
  //   @media ( $tablet-width) {
  //     font-size: 0.6rem;
  //   }
  //   @media ( $mobile-width) {
  //     font-size: 0.4rem;
  //   }
  // }
}

#myProgress {
  width: 66%;
  background-color: white;
  border: solid black;
  border-width: 0.16rem;
  @media (max-width: $mobile-width) {
    border-width: 0.08rem;
  }
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
  height: 1.2rem;
  background-color: $lahma-pink;
}

#progressingRange {
  width: 100%;
  height: 0.4rem;
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

#volumeRange {
  background-color: $black-color;
}

.total-duration {
    @media (max-width: $mobile-width) {
      display: none;
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
