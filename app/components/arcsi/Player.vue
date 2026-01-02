<template>
  <div class="arcsiplayer">
    <audio id="arcsiplayer" ref="arcsiplayer" preload="metadata"
      :title="(episode.shows?.[0]?.name || '') + ' - ' + episode.name" :src="source" :autoplay="isSafari"
      @play="setPlayState()" @pause="setPauseState()" @loadedmetadata="getDuration()" @loadeddata="findIfArcsiSeek()"
      @timeupdate.passive="getPosition" @ended="stopArcsi()" />
    <div v-if="duration && duration === 0" class="flex items-center py-4 preload">
      <img src="@/assets/img/preloader.svg" class="h-4 mr-4" alt="preload">
      <p>Preloading...</p>
    </div>
    <div v-else class="flex flex-col items-start justify-between w-full md:items-center md:flex-row">
      <div class="flex items-center pt-4 pb-2 md:py-4 md:pr-4">
        <button class="w-5 h-5 mr-3 text-left cursor-pointer" @click="toggleArcsi">
          <span v-if="arcsiIsPlaying && seek === 0 && !isSafari">
            <i class="fa fa-spinner fa-pulse fa-fw" aria-hidden="true" />
          </span>
          <span v-else-if="arcsiIsPlaying">
            <i class="fa fa-pause" aria-hidden="true" />
          </span>
          <span v-else>
            <i class="fa fa-play" aria-hidden="true" />
          </span>
        </button>
        <h5 v-if="arcsiShow">
          <NuxtLink v-if="arcsiShow" :to="`/shows/${arcsiShow.archive_lahmastore_base_url}`">
            {{ episode.shows?.[0]?.name || '' }}
          </NuxtLink>
          <span> - </span>
          <NuxtLink :to="`/shows/${arcsiShow.archive_lahmastore_base_url}/${episode.name_slug}`">
            {{ episode.name }}
          </NuxtLink>
        </h5>
        <h5 v-else>
          {{ (episode.shows?.[0]?.name || '') + ' - ' + episode.name }}
        </h5>
      </div>
      <div class="flex items-center w-full md:mr-6 md:w-64 min-w-1/4 2xl:min-w-0" :class="{ 'mb-2': isTouchEnabled }">
        <a href="#" class="mr-2 text-xs" @click.prevent="seekBackward(10)" @dblclick.prevent="seekBackward(20)">
          <i class="fa fa-fast-backward" aria-hidden="true" />
        </a>
        <div class="text-sm seek-time">
          {{ seek && seek > 1 ? currentSeek : '0:00:00' }}
        </div>
        <div id="myProgress" class="mx-2 my-2">
          <div id="myBar" :style="{ width: (progress * 100).toFixed(2) + '%' }" />
          <input id="progressingRange" :value="progress" type="range" min="0" max="1" step="0.001"
            @change="seekBar($event.target.value)">
        </div>
        <div class="text-sm">
          {{ currentDuration }}
        </div>
        <a href="#" class="ml-2 text-xs" @click.prevent="seekForward(10)" @dblclick.prevent="seekForward(20)">
          <i class="fa fa-fast-forward" aria-hidden="true" />
        </a>
      </div>
      <div v-if="!isTouchEnabled" id="myVolume" class="my-2 whitespace-nowrap flex items-center gap-2">
        <div class="w-4 align-middle">
          <i v-if="currentVolume === '0'" class="fa fa-microphone-slash" />
          <i v-else-if="currentVolume < '0.3'" class="fa fa-volume-off" />
          <i v-else-if="currentVolume < '0.7'" class="fa fa-volume-down" />
          <i v-else class="fa fa-volume-up" />
        </div>
        <input id="volumeRange" v-model="currentVolume" class="align-middle" type="range" min="0" max="1" step="0.01"
          :style="{ '--progress': currentVolume * 100 + '%' }" @input.passive="volumeBar($event.target.value)">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '~/stores/player'

const props = defineProps({
  episode: {
    type: Object,
    required: true
  },
  source: {
    type: String,
    required: true
  }
})

const player = usePlayerStore()
const { isStreamPlaying, isArcsiPlaying: arcsiIsPlaying } = storeToRefs(player)

const arcsiplayer = ref(null)
const currentVolume = ref('1')
const duration = ref(0)
const seek = ref(0)
const lastSavedTime = ref(0)
const timeOutHelper = ref(null)
const docTitleSetter = ref(null)

const isSafari = computed(() => {
  if (import.meta.server) return false
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
})

const isTouchEnabled = computed(() => {
  if (import.meta.server) return false
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
})

const arcsiShow = computed(() => {
  if (props.episode?.shows?.[0]) {
    return props.episode.shows[0]
  }
  return null
})

const currentDuration = computed(() => {
  return formatTime(duration.value)
})

const currentSeek = computed(() => {
  return formatTime(seek.value)
})

const progress = computed(() => {
  if (!duration.value) return 0
  return seek.value / duration.value
})

// Watchers
watch(() => props.source, () => {
  lastSavedTime.value = 0
  if (arcsiplayer.value) {
    arcsiplayer.value.load()
    if (isSafari.value) {
      player.setIsArcsiPlaying(true)
    } else {
      player.setIsArcsiPlaying(false)
      setTimeout(() => {
        play()
      }, 100)
    }
  }
})

watch(currentVolume, (val) => {
  if (arcsiplayer.value) {
    arcsiplayer.value.volume = val
  }
  player.setArcsiVolume(val)
})

// Watch stream playing state to stop arcsi
watch(isStreamPlaying, (val) => {
  if (val && arcsiIsPlaying.value) {
    pause()
  }
})

// Watch arcsi playing state to control audio element
watch(arcsiIsPlaying, (val) => {
  if (!val && arcsiplayer.value && !arcsiplayer.value.paused) {
    arcsiplayer.value.pause()
  }
})

// Methods
const play = () => {
  if (arcsiplayer.value) {
    arcsiplayer.value.play()
      .then(() => {
        player.setIsArcsiPlaying(true)
      })
      .catch(e => console.error(e))
  }
}

const pause = () => {
  if (arcsiplayer.value) {
    arcsiplayer.value.pause()
    player.setIsArcsiPlaying(false)
    saveHistory()
  }
}

const toggleArcsi = () => {
  if (arcsiIsPlaying.value) {
    pause()
  } else {
    play()
  }
}

const stopArcsi = () => {
  pause()
  if (arcsiplayer.value) {
    arcsiplayer.value.currentTime = 0
  }
}

const setPlayState = () => {
  player.setIsArcsiPlaying(true)

  // Stop stream if it's playing
  if (player.isStreamPlaying) {
    player.setIsStreamPlaying(false)
  }

  document.title = `🔈 ${props.episode.shows?.[0]?.name || ''} - ${props.episode.name}`
  clearInterval(docTitleSetter.value)
  docTitleSetter.value = setInterval(() => {
    if (arcsiIsPlaying.value) {
      document.title = `🔈 ${props.episode.shows?.[0]?.name || ''} - ${props.episode.name}`
    } else {
      clearInterval(docTitleSetter.value)
    }
  }, 3000)
}

const setPauseState = () => {
  player.setIsArcsiPlaying(false)
  clearInterval(docTitleSetter.value)
  const ogTitle = document.querySelector("meta[property='og:title']")
  document.title = ogTitle ? ogTitle.getAttribute('content') : 'Lahmacun radio'
}

const getDuration = () => {
  if (arcsiplayer.value) {
    duration.value = arcsiplayer.value.duration
  }
}

const saveHistory = () => {
  if (props.episode && props.episode.name_slug) {
    player.setArcsiProgressHistory({
      showID: props.episode.shows?.[0]?.archive_lahmastore_base_url || '',
      showName: props.episode.shows?.[0]?.name || '',
      episodeID: props.episode.id,
      episodeSlug: props.episode.name_slug,
      episodeName: props.episode.name,
      value: seek.value
    })
  }
}

const getPosition = () => {
  if (arcsiplayer.value) {
    seek.value = arcsiplayer.value.currentTime
    if (Math.abs(seek.value - lastSavedTime.value) > 5) {
      // saveHistory()
      lastSavedTime.value = seek.value
    }
  }
}

const seekBar = (value) => {
  if (arcsiplayer.value && duration.value) {
    const newTime = value * duration.value
    arcsiplayer.value.currentTime = newTime
    seek.value = newTime
  }
}

const volumeBar = (value) => {
  currentVolume.value = value
}

const seekForward = (seconds) => {
  if (arcsiplayer.value) {
    arcsiplayer.value.currentTime += seconds
  }
}

const seekBackward = (seconds) => {
  if (arcsiplayer.value) {
    arcsiplayer.value.currentTime -= seconds
  }
}

const findIfArcsiSeek = () => {
  if (typeof URLSearchParams !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('t')) {
      const time = parseInt(urlParams.get('t'))
      if (arcsiplayer.value) {
        arcsiplayer.value.currentTime = time
      }
    }
  }
}

const formatTime = (time) => {
  const secNum = parseInt(time, 10)
  let hours = Math.floor(secNum / 3600)
  let minutes = Math.floor((secNum - (hours * 3600)) / 60)
  let seconds = secNum - (hours * 3600) - (minutes * 60)

  if (hours < 10) { hours = '0' + hours }
  if (minutes < 10) { minutes = '0' + minutes }
  if (seconds < 10) { seconds = '0' + seconds }
  return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds
}

// Lifecycle
onMounted(() => {
  // Initialize volume from store
  if (player.getArcsiVolume) {
    currentVolume.value = player.getArcsiVolume
  }
})

onBeforeUnmount(() => {
  saveHistory()
  clearInterval(docTitleSetter.value)
  clearTimeout(timeOutHelper.value)
})
</script>

<style lang="scss" scoped>
h5 {
  line-height: 1.2em;
  a {
    color: #000;
    &:hover {
      text-decoration: underline;
    }
  }
  span {
    font-weight: normal;
  }
}
#myProgress {
  width: 100%;
  background-color: #000;
    input[type="range" i]::-webkit-slider-thumb {
      opacity: 0;
      transition: opacity 0.2s;
      transform: translateY(3px);
    }
    &:hover {
      input[type="range" i]::-webkit-slider-thumb {
        opacity: 1;
      }
    }
}

#myBar {
  width: 1%;
  height: 0.4rem;
  background-color: #d09cf8;
}

#progressingRange {
  width: 100%;
  height: 0.8rem;
  -webkit-appearance: none !important;
  appearance: none;
  margin-top: -0.8rem;
  float: left;
  background: transparent;
}

.seek-time {
  color: #d09cf8;
}

#myVolume {
  position: relative;
  display: flex;
  align-items: center;
  width: 100px;

  input[type="range" i]::-webkit-slider-thumb {
    opacity: 0;
    transition: opacity 0.2s;
  }
}

#volumeRange {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  background: black;
  outline: none;
  border-radius: 5px;
  cursor: pointer;
  position: relative;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #d09cf8;
    cursor: pointer;
    position: relative;
    z-index: 2;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #d09cf8;
    cursor: pointer;
    position: relative;
    z-index: 2;
  }
}

/* Custom track styling for volume to show progress */
#volumeRange::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: var(--progress, 100%);
  background: #d09cf8;
  border-radius: 5px;
  z-index: 1;
}

/* Only for Safari  */
@media not all and (min-resolution:.001dpcm){ @supports (-webkit-appearance:none) {
  #myVolume {
    input[type="range" i]::-webkit-slider-thumb {
      opacity: 1;
    }
  }
}}
</style>
