<template>
  <header class="items-center justify-between px-4 py-2 bg-white lg:flex sm:flex-nowrap flex-wrap">
    <div class="flex items-center mb-4 xsm:mb-0">
      <div class="block mr-4 cursor-pointer" @click="$router.push('/')">
        <div class="main-title">
          Lahmacun Radio
        </div>
        <img src="@/assets/img/lahma_logo_1.svg" alt="Lahmacun Radio" class="w-24 logo">
      </div>
      <div class="mt-2 xsm:my-4">
        <client-only>
          <RadioPlayer :show-album-art="true" :now-playing-uri="streamServer" />
        </client-only>
      </div>
      <div class="ukraine-campaign block my-2 mx-auto sm:mx-4 md:w-48">
        <NuxtLink to="/campaigns/stand-with-ukraine/">
          <div class="ukraine-block h-full w-full flex justify-items-center items-center text-white hover:text-lahma-pink">
            <div class="text-center w-full font-bold sm:block hidden">
              #StandWithUkraine
            </div>
            <div class="text-center w-full sm:hidden block text-2xl px-2 py-4">
              ✌🏻
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <HeadNavigation />
    <div id="time" class="hidden lg:block">
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
      interval: null,
      isClient: typeof window !== 'undefined' && window.document
    }
  },
  created () {
    this.getNow()
  },
  mounted () {
    if (this.isClient) {
      this.interval = setInterval(this.getNow, 60 * 1000)
    }
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
      if (minutes % 10 === 0) {
        this.refreshArcsiShows()
      }

      // refresh arcsiShows every 3 minutes
      if (minutes % 3 === 0) {
        this.refreshRareShows()
      }

      // refresh arcsiShows every 4 minutes
      if (minutes % 4 === 0) {
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
    .ukraine-campaign {
      @media (max-width: $tablet-width) {
        position: absolute;
        right: 1rem;
      }
      .ukraine-block {
        background: url(@/assets/img/campaigns/standwith_alap.svg) no-repeat center center;
        background-size: contain;
        padding: 1.75rem 0.5rem;
        clip-path: ellipse(50% 40% at 50% 50%);
        height: 5rem;
        @media (max-width: $mobile-width) {
          clip-path: circle(50% at 50% 50%);
          background-size: cover;
          padding: 0;
          height: 3rem;
          width: 3rem;
        }
      }
    }
</style>
