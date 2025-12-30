<template>
  <div>
    <SubTitle title="Latest From Archives" url="/archive/" />
    <div v-if="pending" class="flex flex-col items-center justify-center py-32">
      <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload" />
      <p>Loading...</p>
    </div>
    <div class="container relative pt-12 latest-container" :class="{ 'opacity-0': pending }">
      <div ref="slider" class="arcsi-slider-wrapper">
        <div ref="episodes" class="relative arcsi-episodes">
          <div v-for="(episode, i) in arcsiEpisodesListSortedLatest" :key="episode + i">
            <div class="episode-wrap" :style="{ width: episodeWidth + 'px' }">
              <ArcsiLatestBlock :episode="episode" :arcsilist="arcsiList" />
            </div>
          </div>
        </div>
      </div>
      <a
        v-show="sliderPosition > 0"
        ref="button-prev"
        href="#"
        class="latest-nav previous"
        :style="{ top: episodeWidth / 2 + 'px' }"
        @click.prevent="previousBlock"
      >
        <img src="@/assets/img/arrow-left.svg" alt="" />
      </a>
      <a
        v-show="sliderPosition < arcsiEpisodesListSortedLatest.length - visibleEpisodes"
        ref="button-next"
        href="#"
        class="latest-nav next"
        :style="{ top: episodeWidth / 2 + 'px' }"
        @click.prevent="nextBlock"
      >
        <img src="@/assets/img/arrow-right.svg" alt="" />
      </a>
    </div>
    <div v-if="error" class="py-32 text-center">Error happened</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useArcsiStore } from '~/stores/arcsi'
import { useAsyncData, useNuxtApp } from '#app'
import { arcsiItemBaseURL, config } from '~/constants'

const { screens } = useTailwindBreakpoints()
const tabletSize = screens.md
const desktopSize = screens.lg
const largeScreenSize = screens['2xl']

const arcsi = useArcsiStore()

const startIndex = ref(0)
const numberOfEpisodes = ref(12)
const visibleEpisodes = ref(3)
const sliderPosition = ref(0)
const episodeWidth = ref(300)
const arcsiEpisodes = ref([])
let resizeTimeout
let initTimeout // Track initialization timeout

const slider = ref(null)
const episodes = ref(null)

const { $axios, $sentry } = useNuxtApp()

const { data: fetchedEpisodes, pending, error } = await useAsyncData('arcsi-latest', async () => {
  try {
    const res = await $axios.get(`${arcsiItemBaseURL}/latest?size=${numberOfEpisodes.value}&page=${startIndex.value}`, config)
    return res.data || []
  } catch (e) {
    $sentry?.captureException(new Error('Arcsi latest not found', { cause: e }))
    throw e
  }
})

if (Array.isArray(fetchedEpisodes.value)) {
  arcsiEpisodes.value = fetchedEpisodes.value
}

const getToday = computed(() => {
  const d = new Date()
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
  const day = d.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })
  return `${year}-${month}-${day}`
})

const arcsiEpisodesListSortedLatest = computed(() => {
  const list = Array.isArray(arcsiEpisodes.value) ? [...arcsiEpisodes.value] : []
  return list
    .filter(item => item.play_date < getToday.value)
    .filter(item => item.archived === true)
    .filter(item => item.name_slug !== null)
    .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
    .slice(startIndex.value, numberOfEpisodes.value)
})

const arcsiList = computed(() => (arcsi ? arcsi.returnArcsiShows : []))

function changeBreakpoint() {
  if (typeof window === 'undefined') return
  clearTimeout(resizeTimeout)
  const windowWidth = window.innerWidth
  const viewport = slider.value
  if (!viewport) return

  const maxPosition = arcsiEpisodesListSortedLatest.value.length - visibleEpisodes.value

  if (windowWidth >= parseInt(largeScreenSize)) {
    visibleEpisodes.value = 4
  } else if (windowWidth >= parseInt(desktopSize) && windowWidth < parseInt(largeScreenSize)) {
    visibleEpisodes.value = 3
  } else if (windowWidth <= parseInt(tabletSize)) {
    visibleEpisodes.value = 1
  } else {
    visibleEpisodes.value = 2
  }

  // Ensure slider position doesn't exceed the new maximum
  const newMaxPosition = arcsiEpisodesListSortedLatest.value.length - visibleEpisodes.value
  if (sliderPosition.value > newMaxPosition) {
    sliderPosition.value = Math.max(0, newMaxPosition)
  }

  episodeWidth.value = Math.round(viewport.clientWidth / visibleEpisodes.value)
  resizeTimeout = setTimeout(() => reInitSlider(), 1)
}

function reInitSlider() {
  if (episodes.value) {
    episodes.value.style.transform = `translateX(-${episodeWidth.value * sliderPosition.value}px)`
  }
}

function previousBlock() {
  if (!episodes.value) return
  if (sliderPosition.value === 0) {
    episodes.value.style.transform = 'translateX(0px)'
    return
  }
  sliderPosition.value--
  episodes.value.style.transform = `translateX(-${episodeWidth.value * sliderPosition.value}px)`
}

function nextBlock() {
  if (!episodes.value) return
  if (sliderPosition.value === arcsiEpisodesListSortedLatest.value.length - visibleEpisodes.value) return
  sliderPosition.value++
  episodes.value.style.transform = `translateX(-${episodeWidth.value * sliderPosition.value}px)`
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', changeBreakpoint, { passive: true })

    // Wait for stylesheets to load before measuring layout
    const initializeLayout = () => {
      const viewport = slider.value
      if (viewport) episodeWidth.value = Math.round(viewport.clientWidth / visibleEpisodes.value)
      initTimeout = setTimeout(() => {
        changeBreakpoint()
        numberOfEpisodes.value = arcsiEpisodesListSortedLatest.value?.length || numberOfEpisodes.value
      }, 3000)
    }

    // Check if stylesheets are already loaded
    if (document.readyState === 'complete') {
      initializeLayout()
    } else {
      window.addEventListener('load', initializeLayout, { once: true })
    }
  }
})

onBeforeUnmount(() => {
  clearTimeout(resizeTimeout)
  clearTimeout(initTimeout)
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', changeBreakpoint)
  }
})
</script>

<style lang="scss" scoped>
.latest-container {
  min-height: 24rem;
}
.arcsi-slider-wrapper {
  overflow: hidden; /* overflow-hidden */
  width: 100%; /* w-full */
  .arcsi-episodes {
    transition: transform 0.25s ease-out;
    display: flex; /* flex */
    align-items: flex-start; /* items-start */
    width: max-content; /* w-max */
    .episode-wrap {
      padding-left: 0.5rem; /* px-2 */
      padding-right: 0.5rem;
    }
  }
}

.latest-nav {
  position: absolute; /* absolute */
  top: 12rem; /* top-48 (48 * .25rem) */
  margin-top: -0.5rem; /* -mt-2 */
  &.previous {
    left: -1rem; /* -left-4 */
  }
  &.next {
    right: -1rem; /* -right-4 */
  }
}

</style>
