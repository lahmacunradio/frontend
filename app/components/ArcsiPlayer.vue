<template>
  <div class="arcsiplayer">
    <div v-if="duration === 0" class="py-2 preload">
      <img src="/img/preloader.svg">
      <p>Preloading...</p>
    </div>
    <div v-else>
      <div>
        <button @click="playArcsi">
          <span v-if="playing">
            <i class="fa fa-pause" aria-hidden="true" />
          </span>
          <span v-else>
            <i class="fa fa-play" aria-hidden="true" />
          </span>
        </button>
        <button @click="stopArcsi">
          <i class="fa fa-stop" aria-hidden="true" />
        </button>
      </div>
      <div id="myProgress" class="my-2">
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
      <div>
        <span>Total duration: {{ currentDuration }}</span>
        <span> - </span>
        <span>playing: {{ currentSeek }}</span>
      </div>
      <div class="my-4">
        <h4>Volume</h4>
        <input
          v-model="currentVolume"
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
import { format, addSeconds } from 'date-fns'

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
      const helperDate = addSeconds(new Date(0), this.duration)
      return format(helperDate, 'mm:ss')
    },
    currentSeek () {
      const helperDate = addSeconds(new Date(0), this.seek)
      return format(helperDate, 'mm:ss')
    },
    playerData () {
      return {
        player: 'arcsi',
        data: this.episode
      }
    }
  },
  mounted () {
    if (this.currentVolume !== this.$store.state.player.arcsiVolume) {
      this.currentVolume = this.$store.state.player.arcsiVolume
      this.setVolume(parseFloat(this.$store.state.player.arcsiVolume))
    }
    this.findIfArcsiSeek()
    this.$store.commit('player/currentlyPlayingArcsi', this.episode)
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
    },
    stopArcsi () {
      this.stop()
      const playHistory = {
        episodeID: this.episode.id,
        value: 0
      }
      this.currentProgress = '0'
      this.$store.commit('player/setArcsiProgressHistory', playHistory)
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
    findIfArcsiSeek () {
      if (!this.$store.state.player.arcsiPlayHistory) { return false }
      const arcsiPlayerSeek = this.$store.state.player.arcsiPlayHistory[this.episode.id]
      if (arcsiPlayerSeek && arcsiPlayerSeek.playPosition !== 0) {
        setTimeout(() => {
          this.setProgress(arcsiPlayerSeek.playPosition)
        }, 100)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "/assets/css/variables";
 #myProgress {
  width: 100%;
  background-color: white;
}

#myBar {
  width: 1%;
  height: 0.5rem;
  background-color: $black-color;
}

#progressingRange {
  width: 100%;
  -webkit-appearance: none !important;
  appearance: none;
  margin-top: -0.9rem;
  float: left;
  background: transparent;
}
</style>
