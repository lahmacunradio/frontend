<template>
  <header class="flex-row-reverse items-center justify-between px-4 py-4 bg-white md:flex md:flex-row">
    <div class="items-center md:flex">
      <div class="block mr-4 cursor-pointer" @click="$router.push('/')">
        <img src="@/assets/img/lahmacun-logo.png" alt="" class="w-24 logo">
      </div>
      <div class="my-4 md:mr-8">
        <client-only>
          <RadioPlayer :show-album-art="true" :now-playing-uri="streamServer" />
        </client-only>
      </div>
    </div>
    <HeadNavigation />
    <div id="time">
      <div class="currenttime">
        {{ timestamp }} <br>CET
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
      const time = today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0')
      this.timestamp = time
    }

  }
}
</script>

<style lang="scss" scoped>
  header {
      justify-content: space-between;
      align-content: center;
      .logo {
        min-width: 6rem;
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
