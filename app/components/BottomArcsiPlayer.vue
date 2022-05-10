<template>
  <div class="bottomarcsiplayer">
    <client-only>
      <div class="relative playerblock">
        <div class="px-4" :class="arcsiVisible ? 'h-auto' : 'h-0'">
          <div v-if="arcsiEpisode && arcsiAudio">
            <client-only>
              <ArcsiPlayer :source="arcsiAudio" :episode="arcsiEpisode" />
            </client-only>
          </div>
          <div v-else>
            <div class="py-4">
              No arcsi episode selected. Go to
              <NuxtLink to="/archive" class="font-bold">
                archive page
              </NuxtLink>
              for the full list
            </div>
          </div>
        </div>
        <div class="close">
          <a href="#" class="block bg-white rounded-t-lg control-ear" @click.prevent="togglePlayerVisibility(!arcsiVisible)">
            <div v-if="arcsiVisible">
              X
            </div>
            <div v-else class="arcsi-logo">
              <span class="block" :class="isArcsiPlaying && 'rotate-element'">
                <img src="@/assets/img/arcsi-icon.svg" alt="arcsi player">
              </span>
            </div>
          </a>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    ...mapGetters('player', {
      arcsiEpisode: 'getArcsiEpisode',
      arcsiVisible: 'getArcsiVisibility',
      isArcsiPlaying: 'getArcsiPlayState'

    }),
    arcsiAudio () {
      if (!this.arcsiEpisode?.play_file_name) {
        return false
      }
      const showSlug = this.arcsiEpisode.shows?.[0].archive_lahmastore_base_url
      const episodeNumber = this.arcsiEpisode.number
      const fileName = this.arcsiEpisode.play_file_name
      return `${mediaServerURL}${showSlug}/${episodeNumber}/${fileName}`
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
.bottomarcsiplayer {
    bottom: 0;
    left: 0;
    width: 100%;
    @apply z-50 bg-white fixed;
}
.control-ear {
  width: 2rem;
  text-align: center;
  > div {
    padding: 0.3rem 0;
    height: 2rem;
  }
}
.arcsi-logo {
  width: 1.4rem;
  margin: auto;
}
.close {
    position: absolute;
    top: -2rem;
    right: 1rem;
}
</style>
