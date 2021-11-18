<template>
  <div>
    <h3 class="title-block">
      Schedule
    </h3>
    <div class="container mt-8">
      <div class="">
        <div class="mb-4 border-b days">
          <ul>
            <li v-for="(day, dayIndex) in dayNames" :key="dayIndex">
              <div class="px-4 py-2" :class="selectedDay === dayIndex && 'bg-white'" @click="changeDay(dayIndex)">
                <h4 class="block">
                  {{ day }}
                </h4>
                {{ $moment(todayDate).add(dayIndex, 'days').format('MMM Do') }}
              </div>
            </li>
          </ul>
        </div>
        <div class="col-span-2 selectday">
          <div v-for="(day, index) in dayNames" :key="index" :ref="index" class="dayschedule" :class="index === 0 ? 'block' : 'hidden'">
            <div v-for="(show, showindex) in showsByDate[index]" :key="index + showindex" :class="showAirCheck(0, show.name) ? 'dayblock onair' : 'dayblock'">
              <div class="onairshow">
                <span class="text-red-600">●</span>
                On Air
              </div>
              <div class="show-basic-infos">
                {{ removeSeconds(show.start) }}
                <img src="@/assets/img/arrow-schedule.svg" alt="" class="inline-block w-10">
                {{ removeSeconds(show.end) }}
                <span class="hidden md:inline-block"> - </span>
                <nuxt-link :to="'/shows/' + show.archive_lahmastore_base_url" class="block md:inline-block">
                  <b>{{ show.name }}</b>
                </nuxt-link>
                {{ showAirCheck(0, show.name) && ' | ' + streamEpisodeTitle }}
                <div v-if="!isTouchEnabled" class="show-image" :style="{ backgroundImage: `url(${show.cover_image_url})` }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { streamServer } from '~/constants'

export default {
  data () {
    return {
      streamServer,
      showsByDate: [],
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      interval: null,
      nowPlaying: {},
      selectedDay: 0
    }
  },
  computed: {
    arcsishows () {
      return this.$store.state.arcsiShows
    },
    sortShowsForSchedule () {
      return [...this.arcsishows].sort((a, b) => parseInt(a.start) - parseInt(b.start)).sort((a, b) => a.day - b.day)
    },
    getToday () {
      const d = new Date()
      return d.getDay()
    },
    todayDate () {
      return new Date()
    },
    tommorrow () {
      return new Date(new Date())
    },
    streamShowTitle () {
      if (!this.nowPlaying) {
        return false
      } else if (this.nowPlaying?.live?.is_live) {
        return this.nowPlaying?.live?.streamer_name
      } else {
        return this.nowPlaying?.now_playing?.song.artist
      }
    },
    streamEpisodeTitle () {
      if (!this.nowPlaying) {
        return false
      } else if (this.nowPlaying?.live?.is_live) {
        return this.nowPlaying?.live?.song?.title
      } else {
        return this.nowPlaying?.now_playing?.song?.title
      }
    },
    todayName () {
      return this.dayNames[this.getToday - 1]
    },
    isTouchEnabled () {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
    }
  },
  mounted () {
    this.groupShowsByDay(this.sortShowsForSchedule)
    this.checkNowPlaying()
  },
  beforeDestroy () {
    // prevent memory leak
    clearInterval(this.interval)
  },
  created () {
    // update the time every minute
    this.interval = setInterval(() => {
      this.checkNowPlaying()
    }, 60 * 1000)
  },
  methods: {
    showAirCheck (index, showname) {
      if (index === 0 && this.streamShowTitle && this.slugify(this.streamShowTitle) === this.slugify(showname)) {
        return true
      }
    },
    checkNowPlaying () {
      this.$axios.get(this.streamServer).then((response) => {
        this.nowPlaying = response.data
      }).catch((error) => {
        console.log(error)
        this.$nuxt.error({ statusCode: 500, message: 'Stream not available at the moment' })
      })
    },
    groupShowsByDay (shows) {
      if (!shows) { return false }
      const list = []
      const daybyMonday = this.getToday === 0 ? 7 : this.getToday
      const dayIndex = daybyMonday - 1
      for (let i = 0; i < 7; i++) {
        list.push([])
        shows.forEach((show) => {
          if (show.archive_lahmastore_base_url === 'off-air' || !show.active) { return false }
          if (show.day - 1 === i) {
            list[i].push(show)
          }
        })
      }
      this.showsByDate = [...list.slice(dayIndex), ...list.slice(0, dayIndex)]
      this.dayNames = [...this.dayNames.slice(dayIndex), ...this.dayNames.slice(0, dayIndex)]
    },
    changeDay (dayindex) {
      const allDays = document.getElementsByClassName('dayschedule')
      Array.from(allDays).forEach((day) => {
        day.classList.remove('block')
        day.classList.add('hidden')
      })
      this.$refs[dayindex][0].classList.add('block')
      this.$refs[dayindex][0].classList.remove('hidden')
      this.selectedDay = dayindex
    }
  }

}

</script>

<style lang="scss" scoped>
.dayblock {
    @apply flex flex-row md:px-8 py-3 px-3;
    .show-basic-infos {
    position: relative;
    width: 100%;
    .show-image {
        width: 150px;
        height: 150px;
        background: center center no-repeat;
        background-size: cover;
        border-radius: 5px;
        display: none;
        position: absolute;
        z-index: 100;
        top: calc(50% - 75px);
        right: 0;
    }
    }
    &:hover {
      @media (min-width: $tablet-width) {
        background: rgba(255, 255, 255, 0.5);
        .show-image {
          display: block;
        }
      }
    }
    .onairtext {
    text-transform: uppercase;
    }
}
.onairshow {
    opacity: 0;
    padding-right: 1rem;
    white-space: nowrap;
    @media (max-width: $mobile-width) {
      display: none;
    }
}
.onair {
    @apply bg-white;
    .onairshow {
    opacity: 1;
    animation: pulse 5s infinite;
    }
    &:hover {
    @apply bg-white;
    }
}

@keyframes pulse {
  0% { opacity: 0.3; }
  30% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0.3; }
}

.days {
  ul {
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
    justify-content: space-between;
    overflow: auto;
    &::-webkit-scrollbar {
      height: 0.5rem;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: white;
    }
    li {
        cursor: pointer;
        width: 100%;
        white-space: nowrap;
        h4 {
          font-size: 1.2rem;
        }
    }
  }
}
</style>
