<template>
  <div class="arcsiplayer">
    <div v-if="duration === 0" class="py-2 preload">
      <img src="/img/preloader.svg">
      <p>Preloading...</p>
    </div>
    <div v-else>
      <div>
        <button @click="togglePlayback">
          <span v-if="playing">
            <i class="fa fa-pause" aria-hidden="true" />
          </span>
          <span v-else>
            <i class="fa fa-play" aria-hidden="true" />
          </span>
        </button>
        <button @click="stop">
          <i class="fa fa-stop" aria-hidden="true" />
        </button>
      </div>
      <div id="myProgress" class="my-2">
        <div id="myBar" :style="{width: Math.round(progress * 100) + '%'}" />
      </div>
      <div>
        <span>Total duration: {{ currentDuration }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import VueHowler from 'vue-howler'
import { format, addSeconds } from 'date-fns'

export default {
  mixins: [VueHowler],
  data () {
    return {
    }
  },
  computed: {
    currentDuration () {
      const helperDate = addSeconds(new Date(0), this.duration)
      return format(helperDate, 'mm:ss')
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "/assets/css/variables";
 #myProgress {
  width: 100%;
  background-color: white;
}

#myBar {
  width: 1%;
  height: 1rem;
  background-color: $black-color;
}
</style>
