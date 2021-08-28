<template>
  <div class="bottomarcsiplayer">
    <div v-if="playEpisode" class="relative playerblock">
      <div class="container">
        <ArcsiPlayer :sources="arcsiAudio" :html5="true" :episode="arcsiEpisode" :autoplay="true" />
      </div>
      <div class="close">
        <a href="#" class="p-4" @click.prevent="closeArcsi">
          X
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mediaServerURL } from '~/constants'

export default {
  data () {
    return {
    }
  },
  computed: {
    playEpisode () {
      if (!this.$store.state.player.isArcsiPlaying) {
        return false
      }
      return this.$store.state.player.isArcsiPlaying
    },
    arcsiEpisode () {
      return this.$store.state.player.arcsiEpisode
    },
    arcsiList () {
      return [...this.$store.state.arcsiShows]
    },
    arcsiAudio () {
      if (!this.arcsiEpisode || !this.arcsiList) {
        return false
      }
      const showID = this.arcsiEpisode?.shows?.[0].id
      const showObject = this.arcsiList?.find(show => show.id === showID)
      return [`${mediaServerURL}${showObject?.archive_lahmastore_base_url}/${this.arcsiEpisode?.archive_lahmastore_canonical_url}`]
    }
  },
  methods: {
    closeArcsi () {
      this.$store.commit('player/isArcsiPlaying', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "/assets/css/variables";
.bottomarcsiplayer {
    background: white;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
.close {
    position: absolute;
    top: 0;
    right: 0;
}
</style>
