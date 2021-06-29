<template>
  <div class="arcsiplayer">
    <div v-if="duration === 0" class="py-2 preload">
      <img src="/img/preloader.svg">
      <p>Preloading...</p>
    </div>
    <div v-else>
      <div>
        <span>Total duration: {{ duration }} seconds</span>
        <span>Progress: {{ (progress * 100) }}%</span>
      </div>
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
    </div>
  </div>
</template>

<script>
import VueHowler from 'vue-howler'

export default {
  mixins: [VueHowler],
  data () {
    return {
    }
  }
}
</script>
