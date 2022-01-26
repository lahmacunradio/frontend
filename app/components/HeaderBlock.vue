<template>
  <header class="flex-row-reverse items-center justify-between px-4 py-2 bg-white md:flex md:flex-row">
    <div class="flex items-center mb-4 xsm:mb-0 xsm:overflow-visible xsm:overflow-hidden">
      <div class="block mr-4 cursor-pointer" @click="$router.push('/')">
        <h1 class="main-title">
          Lahmacun Radio
        </h1>
        <img src="@/assets/img/lahma_logo_1.svg" alt="Lahmacun Radio" class="w-24 logo">
      </div>
      <div class="mt-2 xsm:my-4 md:mr-8">
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
import { streamServer, arcsiServerURL, rareShowsURL, customScheduleURL } from '~/constants'

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
  mounted () {
    this.interval = setInterval(this.getNow, 60 * 1000)
  },
  beforeDestroy () {
    clearInterval(this.interval)
    this.interval = null
  },
  methods: {
    getNow () {
      const today = new Date()
      this.timestamp = today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0')

      const minutes = today.getMinutes()

      // refresh arcsiShows every 10 minutes
      if (minutes % 1 === 0) {
        this.refreshArcsiShows()
      }

      // refresh arcsiShows every 3 minutes
      if (minutes % 1 === 0) {
        this.refreshRareShows()
      }

      // refresh arcsiShows every 4 minutes
      if (minutes % 1 === 0) {
        this.refreshCustomSchedule()
      }
    },
    async refreshArcsiShows () {
      await this.$axios.get(arcsiServerURL)
        .then((res) => {
          this.$store.commit('refreshArcsiShows', res.data)
        })
        .catch((e) => {
          this.$sentry.captureException(e)
          this.error({ statusCode: 404, message: 'Latest news not found' })
        })
    },
    async refreshRareShows () {
      await this.$axios.get(rareShowsURL)
        .then((res) => {
          this.$store.commit('refreshRareShows', res.data?.acf)
        })
        .catch((e) => {
          this.$sentry.captureException(e)
          this.error({ statusCode: 404, message: 'Rare Shows not found' })
        })
    },
    async refreshCustomSchedule () {
      await this.$axios.get(customScheduleURL)
        .then((res) => {
          this.$store.commit('refreshCustomSchedule', res.data?.acf)
          console.log(this.$store.getters.returnCustomSchedule)
        })
        .catch((e) => {
          this.$sentry.captureException(e)
          this.error({ statusCode: 404, message: 'Rare Shows not found' })
        })
    }

  }
}
</script>

<style lang="scss" scoped>
  header {
      justify-content: space-between;
      align-content: center;
      h1.main-title {
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
