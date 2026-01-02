<template>
  <div class="bottomarcsiplayer">
    <div class="relative playerblock">
      <div class="px-4" :class="isArcsiVisible ? 'h-auto' : 'h-0'">
        <div v-if="hasArcsiEpisode && arcsiAudio">
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
        <a href="#" class="block bg-white rounded-t-lg control-ear"
          @click.prevent="togglePlayerVisibility(!isArcsiVisible)">
          <div v-if="isArcsiVisible">
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { mediaServerURL } from '~/constants'
import { usePlayerStore } from '~/stores/player'
import ArcsiPlayer from '~/components/arcsi/Player.vue'

const player = usePlayerStore()
const { arcsiEpisode, isArcsiVisible, isArcsiPlaying } = storeToRefs(player)

const hasArcsiEpisode = computed(() => {
  return arcsiEpisode.value && Object.keys(arcsiEpisode.value).length > 0
})

const arcsiAudio = computed(() => {
  if (!arcsiEpisode.value?.play_file_name) {
    return false
  }
  // Guard against missing shows array or missing first show
  const showSlug = arcsiEpisode.value?.shows?.[0]?.archive_lahmastore_base_url || arcsiEpisode.value?.shows?.[0]?.archive_lahmastore || ''
  const episodeNumber = arcsiEpisode.value.number
  const fileName = arcsiEpisode.value.play_file_name
  return `${mediaServerURL}${showSlug}/${episodeNumber}/${fileName}`
})

const togglePlayerVisibility = (state) => {
  player.setIsArcsiVisible(state)
}

</script>

<style lang="scss" scoped>
.close {
  position: absolute;
  top: -2rem;
  right: 1rem;
}

.bottomarcsiplayer {
  bottom: 0;
  left: 0;
  width: 100%;
  @apply z-50 bg-white fixed;
}

.control-ear {
  width: 2rem;
  text-align: center;

  >div {
    padding: 0.3rem 0;
    height: 2rem;
  }
}

.arcsi-logo {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.rotate-element {
  animation: rotation 7s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}
</style>
