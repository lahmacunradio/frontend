<template>
  <header class="flex-row-reverse items-center justify-between px-4 py-4 bg-white md:flex md:flex-row">
    <div class="flex items-center">
      <div class="block mr-4 cursor-pointer" @click="$router.push('/')">
        <img src="/img/lahmacun-logo.png" alt="" class="w-24">
      </div>
      <div class="mr-8">
        <client-only>
          <RadioPlayer :show-album-art="true" :now-playing-uri="streamServer" />
        </client-only>
      </div>
    </div>
    <HeadNavigation />
    <div id="time">
      <div class="currenttime">
        {{ timestamp }}
      </div>
    </div>
  </header>
</template>

<script>
import { streamServer } from '~/constants'

export default {

  components: {
  },

  data () {
    return {
      streamServer,
      timestamp: ''
    }
  },
  computed: {

  },
  created () {
    setInterval(this.getNow, 1000)
  },

  mounted () {
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

<style scoped>
  header {
      justify-content: space-between;
      align-content: center;
  }
  .currenttime {
    font-size: 1.4rem;
    font-weight: 600;
  }
</style>