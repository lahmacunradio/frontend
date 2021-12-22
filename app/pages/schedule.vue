<template>
  <div>
    <h2 class="title-block">
      Lahmacun Schedule
    </h2>
    <client-only>
      <div class="container mt-8">
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
      </div>
      <div class="col-span-2 selectday">
        <div v-for="(day, index) in dayNames" :key="index" :ref="index" class="dayschedule" :class="index === 0 ? 'block' : 'hidden'">
          <div v-if="day === 'Thursday'">
            <ScheduleFullitemRare :show="latestRareThursday" />
          </div>
          <div v-if="day === 'Friday'">
            <ScheduleFullitemRare :show="latestRareFriday" />
          </div>
          <div v-for="(show, showindex) in showsByDate[index]" :key="index + showindex">
            <ScheduleFullitem :show="show" :now-playing="nowPlaying" />
          </div>
        </div>
      </div>
    </client-only>
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
      selectedDay: 0,
      interval: null,
      nowPlaying: {},
      latestRareThursday: null,
      latestRareFriday: null
    }
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
    arcsishows () {
      return this.$store.state.arcsiShows
    },
    sortShowsForSchedule () {
      return [...this.arcsishows].sort((a, b) => a.day - b.day).sort((a, b) => parseInt(a.start.replace(':', ''), 10) - parseInt(b.start.replace(':', ''), 10))
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
    groupShowsByDay (shows) {
      if (!shows) { return false }
      const list = []
      const daybyMonday = this.getToday === 0 ? 7 : this.getToday
      const dayIndex = daybyMonday - 1
      this.latestRareThursday = shows.filter(item => item.playlist_name.startsWith('Ritka csut'))
      this.latestRareFriday = shows.filter(item => item.playlist_name.startsWith('Ritka pentek'))
      const filteredShows = shows.filter(val => !this.latestRareThursday.includes(val)).filter(val => !this.latestRareFriday.includes(val))
      for (let i = 0; i < 7; i++) {
        list.push([])
        filteredShows.forEach((show) => {
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
    },
    checkNowPlaying () {
      this.$axios.get(this.streamServer).then((response) => {
        this.nowPlaying = response.data
      }).catch((error) => {
        console.log(error)
      })
    }
  }

}

</script>

<style lang="scss" scoped>
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
