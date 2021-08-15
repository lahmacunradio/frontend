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
  },
  methods: {
    playArcsi () {
      this.togglePlayback()
      this.$store.commit('player/currentlyPlayingArcsi', this.episode)
    },
    stopArcsi () {
      this.stop()
      const arcsiSeekObject = {
        episode: this.episode.id,
        value: '0'
      }
      this.currentProgress = '0'
      this.$store.commit('player/setArcsiProgress', arcsiSeekObject)
    },
    volumeBar (value) {
      this.setVolume(parseFloat(value))
      this.$store.commit('player/setArcsiVolume', value)
    },
    seekBar (value) {
      this.setProgress(parseFloat(value))
      const arcsiSeekObject = {
        episode: this.episode.id,
        value
      }
      this.$store.commit('player/setArcsiProgress', arcsiSeekObject)
    },
    findIfArcsiSeek () {
      if (!this.$store.state.player.arcsiPlayPositions) { return false }
      const arcsiSeekPosition = this.$store.state.player.arcsiPlayPositions.find(x => x.episodeID === this.episode.id)
      if (arcsiSeekPosition && arcsiSeekPosition.value !== '0') {
        setTimeout(() => {
          this.setProgress(parseFloat(arcsiSeekPosition.value))
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
