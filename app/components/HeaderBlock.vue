<template>
  <header class="flex-row-reverse items-center justify-between px-4 py-2 bg-white md:flex md:flex-row">
    <div class="flex items-start mb-4 xxsm:items-center xsm:mb-0 xsm:overflow-hidden">
      <div class="block mr-4 cursor-pointer" @click="$router.push('/')">
        <div class="main-title">
          Lahmacun Radio
        </div>
        <img src="@/assets/img/lahma_logo_1.svg" alt="Lahmacun Radio" class="w-24 logo">
      </div>
      <div class="xxsm:mt-2 xsm:my-4 md:mr-8">
        <client-only>
          <RadioPlayer :show-album-art="true" :now-playing-uri="streamServer" />
        </client-only>
      </div>
    </div>
    <HeadNavigation />
    <div id="time" class="hidden md:block">
      <div class="currenttime">
        {{ timestamp }} <br class="block xl:hidden">CET
      </div>
    </div>
  </header>
</template>

<script>
import { streamServer, arcsiShowsBaseURL, config } from '~/constants'

export default {
  data () {
    return {
      streamServer,
      timestamp: '',
      interval: null
    }
  },
  created () {
    this.getNow()
  },
  // The site's one clock, client only (HeaderBlock is in the default layout, so on every page)
  mounted () {
    this.onClockTick()
    this.interval = setInterval(this.onClockTick, 60 * 1000)
    // Background tabs throttle timers: catch up (e.g. a midnight rollover) when the tab is shown again
    document.addEventListener('visibilitychange', this.onVisibilityChange)
  },
  beforeDestroy () {
    clearInterval(this.interval)
    this.interval = null
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
  },
  methods: {
    // Header clock text; also runs on SSR (created)
    getNow () {
      this.timestamp = new Date().toLocaleString("en-EN", {timeZone: "Europe/Budapest", hour:"numeric", minute:"numeric", hour12: false})
    },
    // Store `today` + loading today's week; on SSR failure this is the client's retry
    onClockTick () {
      this.getNow()
      this.$store.dispatch('tick')

      // refresh the schedule and arcsiShowsForTiles every 10 minutes
      if (new Date().getMinutes() % 10 === 0) {
        this.refreshArcsiShowsForSchedule()
        this.refreshArcsiShowsForTiles()
      }
    },
    onVisibilityChange () {
      if (document.visibilityState === 'visible') {
        this.getNow()
        this.$store.dispatch('tick')
      }
    },
    // On failure the previous tiles stay on screen
    async refreshArcsiShowsForTiles () {
      await this.$axios.get(`${arcsiShowsBaseURL}/all_details`, config)
        .then((res) => {
          this.$store.commit('refreshArcsiShowsForTiles', res.data)
        })
        .catch((e) => {
          this.$sentry.captureException(e)
        })
    },
    // On failure the previous schedule stays on screen
    // Interim until 10d: the old 4-week list (still read by the components) + the per-week cache.
    // refreshScheduleWeeks never rejects, it reports to Sentry itself.
    async refreshArcsiShowsForSchedule () {
      await Promise.all([
        this.$store.dispatch('fetchArcsiShowsForSchedule')
          .catch((e) => {
            this.$sentry.captureException(e)
          }),
        this.$store.dispatch('refreshScheduleWeeks')
      ])
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
      justify-content: space-between;
      align-content: center;
      .flex {
        flex: none;
      }
      .main-title {
        text-indent: -99em;
        font-size: 0.1px;
      }
      .logo {
        min-width: 6rem;
        @media (max-width: $small-width) {
          min-width: 4.5rem;
          width: 4.5rem;
        }
      }
      .currenttime {
        font-size: 1.2rem;
        font-weight: 500;
        white-space: nowrap;
        line-height: 1.1em;
        text-align: center;
      }
  }
  @media (max-width: $tablet-width) {
    #time {
      position: absolute;
      top: 0;
      right: 0;
      text-align: right;
      padding: 2rem 1rem;
    }
  }
</style>
