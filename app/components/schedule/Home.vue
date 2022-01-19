<template>
  <div class="h-full overflow-hidden">
    <div class="text-center schedule-head">
      <div class="infos title">
        <nuxt-link to="/schedule">
          <h3>Today's Schedule</h3>
        </nuxt-link>
      </div>
    </div>
    <div class="flex items-center scheduleblock">
      <div class="w-full pt-4 pb-8 m-auto">
        <div v-if="getToday === 4 && latestRareThursday">
          <div class="dayblock">
            <div class="onairshow">
              <span class="text-red-600">●</span>
              On Air
            </div>
            <div>
              <div class="show-basic-infos">
                {{ removeSeconds(latestRareThursday[0].start) }}
                <img src="@/assets/img/arrow-schedule.svg" alt="" class="inline-block w-8 pb-1">
                {{ removeSeconds(latestRareThursday[0].end) }} -
                <i> Alternating shows</i>
              </div>
              <div class="mt-2">
                <div v-for="(rare, index) in latestRareThursday" :key="index" class="inline">
                  <span v-if="index !== 0" class="mx-1"> | </span>
                  <NuxtLink :to="'/shows/' + rare.archive_lahmastore_base_url">
                    <b>{{ rare.name }}</b>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="getToday === 5 && latestRareFriday">
          <div class="dayblock">
            <div class="onairshow">
              <span class="text-red-600">●</span>
              On Air
            </div>
            <div>
              <div class="show-basic-infos">
                {{ removeSeconds(latestRareFriday[0].start) }}
                <img src="@/assets/img/arrow-schedule.svg" alt="" class="inline-block w-8 pb-1">
                {{ removeSeconds(latestRareFriday[0].end) }} -
                <i> Alternating shows</i>
              </div>
              <div class="mt-2">
                <div v-for="(rare, index) in latestRareFriday" :key="index" class="inline">
                  <span v-if="index !== 0" class="mx-1"> | </span>
                  <NuxtLink :to="'/shows/' + rare.archive_lahmastore_base_url">
                    <b>{{ rare.name }}</b>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-for="(show, index) in showsByDate[0]" :key="show.id * (index + index) * index" :class="showAirCheck(0, show.name) ? 'dayblock onair' : 'dayblock'">
          <div class="onairshow">
            <span class="text-red-600">●</span>
            On Air
          </div>
          <div class="show-basic-infos">
            {{ removeSeconds(show.start) }}
            <img src="@/assets/img/arrow-schedule.svg" alt="" class="inline-block w-8 pb-1">
            {{ removeSeconds(show.end) }} -
            <div v-if="show.archive_lahmastore_base_url" class="inline">
              <NuxtLink :to="'/shows/' + show.archive_lahmastore_base_url">
                <b>{{ show.name }}</b>
              </NuxtLink>
            </div>
            <div v-else class="inline">
              <b>{{ show.name }}</b>
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
  props: {
    shows: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      streamServer,
      showsByDate: [],
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      interval: null,
      nowPlaying: {},
      latestRareThursday: null,
      latestRareFriday: null,
      customScheduleDay: null,
      customScheduleEntries: null,
      customPosition: null
    }
  },
  computed: {
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
    todayName () {
      return this.dayNames[this.getToday - 1]
    },
    customSchedule () {
      return this.$store.state.customSchedule
    }

  },
  mounted () {
    this.groupShowsByDay(this.shows)
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
        this.$sentry.captureException(new Error('Schedule not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Schedule not available' })
      })
    },
    groupShowsByDay (shows) {
      const list = []
      const daybyMonday = this.getToday === 0 ? 7 : this.getToday
      const dayIndex = daybyMonday - 1
      this.latestRareThursday = shows.filter(item => item.playlist_name.startsWith('Ritka csut'))
      this.latestRareFriday = shows.filter(item => item.playlist_name.startsWith('Ritka pentek'))

      // custom Schedule Day
      if (this.customSchedule?.acf?.is_active) {
        this.customScheduleDay = parseInt(this.customSchedule.acf.day_number, 10)
        this.customScheduleEntries = this.customSchedule.acf.schedule
        // TODO fix the correct index
        this.customPosition = this.customScheduleDay >= this.getToday ? this.customScheduleDay - this.getToday : (7 - this.getToday) + this.customScheduleDay
      }

      const filteredShows = shows.filter(val => !this.latestRareThursday.includes(val)).filter(val => !this.latestRareFriday.includes(val))
      for (let i = 0; i < 7; i++) {
        list.push([])
        if (this.customScheduleDay - 1 === i) {
          this.customScheduleEntries.forEach((entry) => {
            list[i].push(entry)
          })
        }

        filteredShows.forEach((show) => {
          if (show.archive_lahmastore_base_url === 'off-air' || !show.active) { return false }
          if (show.day - 1 === i && this.customScheduleDay - 1 !== i) {
            list[i].push(show)
          }
        })
      }
      this.showsByDate = [...list.slice(dayIndex), ...list.slice(0, dayIndex)]
    }
  }

}

</script>

<style lang="scss" scoped>
a {
  &:hover {
    font-weight: 500;
  }
}
.schedule-head {
  background: $black-color;
  color: white;
  h3 {
    margin: 0 0.5rem;
    padding: 0.5rem;
    text-transform: uppercase;
  }
  .day {
    background: $black-color;
    color: white;
  }
}
.scheduleblock {
  height: calc(100% - 50px);
  max-height: 450px;
  overflow: auto;
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: $lahma-pink;
  }
  .dayname {
    border-bottom: 1px solid;
    padding-bottom: 0.25rem;
    margin-bottom: 0.25rem;
  }
  .dayblock {
      @apply flex flex-row md:px-8 py-2 px-4;
      .show-basic-infos {
        position: relative;
        width: 100%;
        min-width: 140px;
      }
      &:hover {
        @media (min-width: $tablet-width) {
          background: rgba(255, 255, 255, 0.5);
        }
      }
      .onairtext {
        text-transform: uppercase;
      }
    }

  &:first-child .dayshows, &:hover .dayshows {
    display: block;
  }
  .onairshow {
    opacity: 0;
    padding-right: 1rem;
    white-space: nowrap;
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
}

@keyframes pulse {
  0% { opacity: 0.3; }
  30% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0.3; }
}

.time-block {
  width: 280px;
}

</style>
