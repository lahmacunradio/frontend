<template>
  <div>
    <SubTitle title="Arcsi's Latest" url="/archive/" />
    <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-32">
      <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
      <p>Loading...</p>
    </div>
    <div class="container relative pt-12 latest-container" :class="{'opacity-0': $fetchState.pending} ">
      <div ref="slider" class="arcsi-slider-wrapper">
        <div ref="episodes" class="relative arcsi-episodes">
          <div v-for="(episode, i) in latestEpisodes" :key="episode + i">
            <div class="episode-wrap" :style="{ 'width': episodeWidth + 'px' }">
              <ItemBlock :item="episode" />
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
        <img src="@/assets/img/arrow-left.svg" alt="">
      </a>
      <a
        v-show="sliderPosition < numberOfEpisodes - visibleEpisodes"
        ref="button-next"
        href="#"
        class="latest-nav next"
        :style="{ top: episodeWidth / 2 + 'px' }"
        @click.prevent="nextBlock"
      >
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
import { arcsiItemBaseURL, tagsURL } from '~/constants'


const fullConfig = resolveConfig(tailwindConfig)
const tabletSize = fullConfig.theme.screens.md
const desktopSize = fullConfig.theme.screens.lg
const largeScreenSize = fullConfig.theme.screens['2xl']

export default {
  name: 'LatestArcsi',
  data () {
    return {
      startIndex: 0,
      numberOfEpisodes: 12,
      visibleEpisodes: 3,
      sliderPosition: 0,
      episodeWidth: 300,
      latestEpisodes: [],
      resizeTimeout: null
    }
  },
  async fetch () {
    try {
      const { data } = await this.$axios.get(arcsiItemBaseURL + '/all')
      this.latestEpisodes = await this.getLatestEpisodes(data)
    } catch (e) {
      this.$sentry.captureException(new Error('Arcsi latest not found ', error))
      this.$nuxt.error({ statusCode: 404, message: 'Arcsi latest not found' })
    }
    if (typeof window !== 'undefined') {
      this.changeBreakpoint()
    }
  },
  computed: {
    getToday () {
      const d = new Date()
      const year = d.getFullYear()
      const month = (d.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
      const day = d.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })
      return `${year}-${month}-${day}`
    },
    arcsiList () {
      return [...this.$store.getters.returnArcsiShows]
    }
  },
  mounted () {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.changeBreakpoint, { passive: true })
      setTimeout(() => {
        this.changeBreakpoint()
        this.numberOfEpisodes = this.arcsiEpisodesListSortedLatest?.length
      }, 3000)
    }
  },
  beforeDestroy () {
    this.arcsiEpisodes = null
    clearTimeout(this.resizeTimeout)
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.changeBreakpoint)
    }
  },
  methods: {
    async getLatestEpisodes (episodes) {
      const episodeArray =  episodes
        .filter(item => item.play_date < this.getToday && item.archived === true)
        .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
        .slice(this.startIndex, this.numberOfEpisodes)
      return await Promise.all(episodeArray.map(async e => await this.parseEpisode(e)))
    },
    async getImage (episode) {
      return episode.image_url.length > 0
        ? episode.image_url
        : this.arcsilist.find(item => item.id === episode.shows[0].id).cover_image_url
    },
    getUrl (episode) {
      const slug = this.arcsiList.find(item => item.id === episode.shows[0].id).archive_lahmastore_base_url
      return `/shows/${slug}/${episode.id}`
    },
    async parseEpisode (episode) {
      return {
        title: episode.name,
        subTitle: episode.shows[0].name,
        url: this.getUrl(episode),
        image: await this.getImage(episode),
      }
    },
    changeBreakpoint () {
      if (!window) {
        return false
      }
      clearTimeout(this.resizeTimeout)
      const windowWidth = window.innerWidth
      const viewport = this.$refs.slider
      if (!viewport) {
        return false
      }
      if (windowWidth >= parseInt(largeScreenSize)) {
        this.visibleEpisodes = 4
        // refactor the checks
        if (this.sliderPosition < this.numberOfEpisodes) {
          this.sliderPosition = this.sliderPosition - 1
        }
      } else if (windowWidth >= parseInt(desktopSize) && windowWidth < parseInt(largeScreenSize)) {
        this.visibleEpisodes = 3
        if (this.sliderPosition < this.numberOfEpisodes) {
          this.sliderPosition = this.sliderPosition - 1
        }
      } else if (windowWidth <= parseInt(tabletSize)) {
        this.visibleEpisodes = 1
      } else {
        this.visibleEpisodes = 2
        if (this.sliderPosition < this.numberOfEpisodes) {
          this.sliderPosition = this.sliderPosition - 1
        }
      }
      this.episodeWidth = Math.round(viewport.clientWidth / this.visibleEpisodes)
      this.resizeTimeout = setTimeout(() => this.reInitSlider(), 1)
    },
    reInitSlider () {
      this.$refs.episodes.style.transform = `translateX(-${this.episodeWidth * this.sliderPosition}px)`
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
    transition: transform 0.25s ease-out;
    @apply flex items-start w-max;
    .episode-wrap {
      @apply px-2;
    }
  }
}

.latest-nav {
  @apply absolute top-48 -mt-2;
  &.previous {
    @apply -left-4;
  }
  &.next {
    @apply -right-4;
  }
}

</style>
