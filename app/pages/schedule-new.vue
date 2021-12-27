<template>
  <div class="container">
    <client-only>
      <div v-if="groupShowsByDay">
        <div v-for="(day, dayindex) in groupShowsByDay" :key="dayindex">
          <h3>{{ dayNames[dayindex] }}</h3>
          <div v-for="(show, showindex) in day" :key="dayindex + showindex">
            <ScheduleFullitem :show="show" :now-playing="nowPlaying" />
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { arcsiShowsBaseURL, streamServer } from '~/constants'

export default {
  data () {
    return {
      streamServer,
      showsByDate: [],
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      selectedDay: 0,
      interval: null,
      nowPlaying: {},
      loadedSchedule: null,
      latestRareThursday: null,
      latestRareFriday: null
    }
  },
  async fetch () {
    this.loadedSchedule = await this.$axios.get(arcsiShowsBaseURL + '/schedule')
      .then(res => res.data)
      .catch((error) => {
        this.$nuxt.error({ statusCode: 404, message: error + ' not found' })
      })
  },
  head () {
    return {
      title: 'Lahmacun Schedule',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Calendar of Lahmacun stream episodes'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Schedule'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Calendar of Lahmacun stream episodes'
        }
      ]
    }
  },
  computed: {
    sortShowsForSchedule () {
      if (!this.loadedSchedule) {
        return false
      }
      return [...this.loadedSchedule]
        .sort((a, b) => a.day - b.day)
        .sort((a, b) => parseInt(a.start.replace(':', ''), 10) - parseInt(b.start.replace(':', ''), 10))
    },
    groupShowsByDay () {
      if (!this.sortShowsForSchedule) {
        return false
      }
      const list = []
      const daybyMonday = this.getToday === 0 ? 7 : this.getToday
      const dayIndex = daybyMonday - 1
      for (let i = 0; i < 7; i++) {
        list.push([])
        this.sortShowsForSchedule.forEach((show) => {
          if (show.archive_lahmastore_base_url === 'off-air' || !show.active) { return false }
          if (show.day - 1 === i) {
            list[i].push(show)
          }
        })
      }
      return [...list.slice(dayIndex), ...list.slice(0, dayIndex)]
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
    todayName () {
      return this.dayNames[this.getToday - 1]
    }
  },
  mounted () {
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
    changeDay (dayindex) {
      const allDays = document.getElementsByClassName('dayschedule')
      Array.from(allDays).forEach((day) => {
        day.classList.remove('block')
        day.classList.add('hidden')
      })
      this.$refs[dayindex][0].classList.add('block')
      this.$refs[dayindex][0].classList.remove('hidden')
      this.selectedDay = dayindex
    },
    checkNowPlaying () {
      this.$axios.get(this.streamServer).then((response) => {
        this.nowPlaying = response.data
      }).catch((error) => {
        this.$sentry.captureException(new Error('Stream interrupted ', error))
        this.interval = setTimeout(this.checkNowPlaying, 15000)
      })
    }
  }

}
</script>

<style scoped>

</style>
