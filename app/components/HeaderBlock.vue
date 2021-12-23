<template>
  <header class="flex-row-reverse items-center justify-between px-4 py-2 bg-white md:flex md:flex-row">
    <div class="items-center flex mb-4 xsm:mb-0 xsm:overflow-visible xsm:overflow-hidden">
      <div class="block mr-4 cursor-pointer" @click="$router.push('/')">
        <h1 class="main-title">
          Lahmacun Radio
        </h1>
        <img src="@/assets/img/lahma_logo_1.svg" alt="Lahmacun Radio" class="w-24 logo">
      </div>
      <div class=" mt-2 xsm:my-4 md:mr-8">
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
import { streamServer } from '~/constants'

export default {
  data () {
    return {
      streamServer,
      timestamp: '',
      interval: null
    }
  },
  mounted () {
    this.interval = setInterval(this.getNow, 1000)
  },
  beforeDestroy () {
    clearInterval(this.interval)
    this.interval = null
  },
  methods: {
    getNow () {
      const today = new Date()
      this.timestamp = today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0')
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
