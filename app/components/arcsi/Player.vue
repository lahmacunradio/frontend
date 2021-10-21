<template>
  <div class="arcsiplayer">
    <template>
      <audio
        id="arcsiplayer"
        ref="arcsiplayer"
        preload="metadata"
        loop="false"
        :title="episode.shows[0].name + ' - ' + episode.name"
        :src="source"
      />
    </template>
    <div v-if="duration && duration === 0" class="flex items-center py-4 preload">
      <img src="/img/preloader.svg" class="h-4 mr-4">
      <p>Preloading...</p>
    </div>
    <div v-else class="flex flex-col items-start justify-between w-full md:items-center md:flex-row">
      <div class="flex py-4">
        <button class="mr-4" @click="playArcsi">
          <span v-if="arcsiIsPlaying">
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
      currentProgress: '0'
    }
  },
  computed: {
    seek () {
      if (!this.audio) {
        return false
      }
      return this.audio.currentTime
    },
    progress () {
      if (!this.audio) {
        return false
      }
      return this.audio.currentTime
    },
    duration () {
      if (!this.audio) {
        return false
      }
      return this.audio.duration
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
    volume (volume) {
      if (isNaN(volume)) {
        volume = this.$store.player.arcsiVolume || 50
      }
      this.audio.volume = Math.min((Math.exp(volume / 100) - 1) / (Math.E - 1), 1)
      this.$store.commit('player/setArcsiVolume', volume)
    },
    '$store.state.player.isStreamPlaying': {
      handler () {
        if (this.$store.state.player.isStreamPlaying) {
          this.pauseArcsi()
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
    this.findIfArcsiSeek()
    this.$store.commit('player/currentlyPlayingArcsi', this.episode)
    if ('mediaSession' in navigator) {
      // Allow pausing from the mobile metadata update.
      navigator.mediaSession.setActionHandler('pause', () => {
        this.playArcsi()
      })
    }
  },
  beforeUpdate () {
    if (this.duration === 0) {
      this.findIfArcsiSeek()
    }
    this.audio = document.getElementById('arcsiplayer')
  },
  beforeDestroy () {
    if (this.arcsiIsPlaying) {
      this.$store.commit('player/currentlyPlayingArcsi', this.episode)
      // Allow pausing from the mobile metadata update.
      navigator.mediaSession.setActionHandler('pause', () => null)
      this.stopArcsi()
    }
  },
  methods: {
    playArcsi () {
      const playHistory = {
        episodeID: this.episode.id,
        value: this.progress
      }
      this.$store.commit('player/currentlyPlayingArcsi', this.episode)
      this.$store.commit('player/setArcsiProgressHistory', playHistory)
      if (!this.arcsiIsPlaying) {
        this.audio.play()
        this.$store.commit('player/isArcsiPlaying', true)
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: this.episode.name,
            artist: this.episode.shows[0].name,
            artwork: [
              { src: this.episode.image_url }
            ]
          })
        }
      } else {
        this.audio.pause()
        this.$store.commit('player/isArcsiPlaying', false)
      }
      this.$store.commit('player/isStreamPlaying', false)
    },
    pauseArcsi () {
      this.audio.pause()
      this.$store.commit('player/isArcsiPlaying', false)
    },
    stopArcsi () {
      if (this.audio) {
        this.audio.stop()
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
      this.audio.volume = volume
    },
    volumeBar (value) {
      this.setVolume(parseFloat(value))
      this.$store.commit('player/setArcsiVolume', value)
    },
    seekBar (value) {
      this.audio.currentTime = parseFloat(value)
      const playHistory = {
        episodeID: this.episode.id,
        value: parseFloat(value)
      }
      this.$store.commit('player/setArcsiProgressHistory', playHistory)
    },
    setProgress (progress) {
      this.audio.currentTime = parseFloat(progress)
    },
    async findIfArcsiSeek () {
      const arcsiPlayerSeek = await this.$store.state.player.arcsiPlayHistory[this.episode.id]
      const arcsiPlayPosition = await arcsiPlayerSeek?.playPosition

      if (this.arcsiIsPlaying && arcsiPlayerSeek && arcsiPlayPosition !== 0) {
        setTimeout(() => {
          this.setProgress(arcsiPlayPosition)
          this.playArcsi()
        }, 3000)
      } else if (this.arcsiIsPlaying) {
        setTimeout(() => {
          this.setProgress(0)
          this.playArcsi()
        }, 3000)
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
