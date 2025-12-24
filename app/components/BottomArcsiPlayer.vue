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
import { mediaServerURL } from '~/constants'
import { usePlayerStore } from '~/stores/player'

export default {
  validate ({ params, store }) {
    // Validation moved to Pinia; keep route valid and rely on store population
    return true
  },
  data () {
    return {
    }
  },
  computed: {
    arcsiEpisode () { return this.player ? this.player.getArcsiEpisode : null },
    arcsiVisible () { return this.player ? this.player.getArcsiVisibility : false },
    isArcsiPlaying () { return this.player ? this.player.getArcsiPlayState : false },
    arcsiAudio () {
      if (!this.arcsiEpisode?.play_file_name) {
        return false
      }
      // Guard against missing shows array or missing first show
      const showSlug = this.arcsiEpisode?.shows?.[0]?.archive_lahmastore_base_url || this.arcsiEpisode?.shows?.[0]?.archive_lahmastore || ''
      const episodeNumber = this.arcsiEpisode.number
      const fileName = this.arcsiEpisode.play_file_name
      return `${mediaServerURL}${showSlug}/${episodeNumber}/${fileName}`
    }
  },
  methods: {
    stopArcsi () {
      if (this.player) this.player.setIsArcsiPlaying(false)
    },
    togglePlayerVisibility (state) {
      if (this.player) this.player.setIsArcsiVisible(state)
    }
  }

  ,created () {
    this.player = usePlayerStore()
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
