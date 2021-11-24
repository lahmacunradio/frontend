<template>
  <div>
    <h3 class="title-block">
      <NuxtLink :to="`/archive/`">
        Arcsi's Latest
      </NuxtLink>
    </h3>
    <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-32">
      <img src="@/assets/img/preloader.svg" class="h-8 mb-2">
      <p>Loading...</p>
    </div>
    <div class="container relative py-10 latest-container" :class="{'opacity-0': $fetchState.pending} ">
      <div ref="slider" class="arcsi-slider-wrapper">
        <div ref="episodes" class="relative arcsi-episodes">
          <div v-for="(episode, i) in arcsiEpisodesListSortedLatest" :key="episode + i">
            <div class="episode-wrap" :style="{ 'width': episodeWidth + 'px' }">
              <ArcsiLatestBlock :episode="episode" :arcsilist="arcsiList" />
            </div>
          </div>
        </div>
      </div>
      <a ref="button-prev" href="#" class="latest-nav previous" @click.prevent="previousBlock">
        <img src="@/assets/img/arrow-left.svg" alt="">
      </a>
      <a ref="button-next" href="#" class="latest-nav next" @click.prevent="nextBlock">
        <img src="@/assets/img/arrow-right.svg" alt="">
      </a>
    </div>
    <div v-if="$fetchState.error" class="py-32 text-center">
      Error happened
    </div>
  </div>
</template>

<script>
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '~/tailwind.config.js'

import { arcsiItemBaseURL } from '~/constants'

const fullConfig = resolveConfig(tailwindConfig)
const mobileSize = fullConfig.theme.screens.sm
const tabletSize = fullConfig.theme.screens.md
const desktopSize = fullConfig.theme.screens.lg

export default {
  name: 'LatestArcsi',
  data () {
    return {
      startIndex: 0,
      numberOfEpisodes: 9,
      visibleEpisodes: 3,
      sliderPosition: 0,
      episodeWidth: 300,
      arcsiEpisodes: null
    }
  },
  async fetch () {
    this.arcsiEpisodes = await this.$axios.get(arcsiItemBaseURL + '/all')
      .then(res => res.data)
      .catch((error) => {
        console.log(error)
        this.$nuxt.error({ statusCode: 500, message: 'Arcsi latest not found' })
      })
    this.changeBreakpoint()
  },
  computed: {
    getToday () {
      const d = new Date()
      const year = d.getFullYear()
      const month = (d.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
      const day = d.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })
      return `${year}-${month}-${day}`
    },
    arcsiEpisodesListSortedLatest () {
      if (this.arcsiEpisodes) {
        const showslist = [...this.arcsiEpisodes]
        return showslist
          .filter(item => item.play_date < this.getToday)
          .filter(item => item.archived === true)
          .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
          .slice(this.startIndex, this.numberOfEpisodes)
      }
      return null
    },
    arcsiList () {
      return [...this.$store.state.arcsiShows]
    }
  },
  mounted () {
    window.addEventListener('resize', this.changeBreakpoint, { passive: true })
    setTimeout(() => {
      this.changeBreakpoint()
    }, 3000)
  },
  beforeDestroy () {
    this.arcsiEpisodes = null
    window.removeEventListener('resize', this.changeBreakpoint)
  },
  methods: {
    changeBreakpoint () {
      const windowWidth = window.innerWidth
      const viewport = this.$refs.slider
      if (!viewport) {
        return false
      }
      if (windowWidth >= parseInt(desktopSize)) {
        this.visibleEpisodes = 3
      } else if (windowWidth <= parseInt(tabletSize)) {
        this.visibleEpisodes = 1
      } else {
        this.visibleEpisodes = 2
      }
      this.episodeWidth = Math.round(viewport.clientWidth / this.visibleEpisodes)
    },
    previousBlock () {
      const episodes = this.$refs.episodes
      if (this.sliderPosition === 0) {
        episodes.style.transform = 'translateX(0px)'
        return false
      }
      this.sliderPosition--
      episodes.style.transform = `translateX(-${this.episodeWidth * this.sliderPosition}px)`
    },
    nextBlock () {
      const episodes = this.$refs.episodes
      if (this.sliderPosition === this.numberOfEpisodes - this.visibleEpisodes) {
        return false
      }
      this.sliderPosition++
      episodes.style.transform = `translateX(-${this.episodeWidth * this.sliderPosition}px)`
    }

  }
}
</script>

<style lang="scss" scoped>
.latest-container {
  min-height: 24rem;
}
.arcsi-slider-wrapper {
  @apply overflow-hidden w-full;
  .arcsi-episodes {
    transition: all 1s;
    @apply flex items-start w-max;
    .episode-wrap {
      @apply px-2;
    }
  }
}

.latest-nav {
  @apply absolute top-48;
  &.previous {
    @apply -left-4;
  }
  &.next {
    @apply -right-4;
  }
}

/* .latest-container {
  max-height: 75vh;
} */

</style>
