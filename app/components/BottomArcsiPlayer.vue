<template>
  <div class="bottomarcsiplayer">
    <div class="relative playerblock">
      <div class="px-4" :class="arcsiVisible ? 'h-auto' : 'h-0'">
        <div v-if="arcsiEpisode">
          <ArcsiPlayer :sources="arcsiAudio" :html5="true" :episode="arcsiEpisode" :autoplay="false" />
        </div>
        <div v-else>
          <div class="py-8">
            No arcsi episode selected
          </div>
        </div>
      </div>
      <div class="close">
        <a href="#" class="block px-4 py-1 bg-white rounded-t-lg" @click.prevent="togglePlayerVisibility(!arcsiVisible)">
          <span v-if="arcsiVisible">
            X
          </span>
          <div v-else class="text-xl">
            <b class="block -mt-1" :class="isArcsiPlaying && 'rotate-element'">
              A
            </b>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mediaServerURL } from '~/constants'

export default {
  validate ({ params, store }) {
    // Check if arcsiShows exists
    return store.state.arcsiShows.length
  },
  data () {
    return {
    }
  },
  computed: {
    arcsiVisible () {
      return this.$store.state.player.isArcsiVisible
    },
    isArcsiPlaying () {
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
    stopArcsi () {
      this.$store.commit('player/isArcsiPlaying', false)
    },
    togglePlayerVisibility (state) {
      this.$store.commit('player/isArcsiVisible', state)
    }
  }

}
</script>

<style lang="scss" scoped>
@import "/assets/css/variables";
.bottomarcsiplayer {
    bottom: 0;
    left: 0;
    width: 100%;
    @apply z-50 bg-white fixed;
}
.close {
    position: absolute;
    top: -1.75rem;
    right: 1rem;
}
</style>
