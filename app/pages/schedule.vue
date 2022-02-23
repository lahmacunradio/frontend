<template>
  <div>
    <SubTitle title="Lahmacun Schedule" :maintitle="true" />
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
      <div v-if="showsByDate.length" class="col-span-2 selectday">
        <div v-for="(day, index) in dayNames" :key="index" :ref="index" class="dayschedule" :class="index === 0 ? 'block' : 'hidden'">
          <div v-for="(show, showindex) in showsByDate[index]" :key="index + showindex">
            <div v-if="customPosition === index">
              <ScheduleCustom :show="show" :now-playing="nowPlaying" />
            </div>
            <div v-else>
              <ScheduleFullitem :show="show" :now-playing="nowPlaying" />
            </div>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { streamServer } from '~/constants'

export default {
  data () {
    return {
      streamServer,
      showsByDate: [],
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      selectedDay: 0,
      customPosition: null,
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
    ...mapGetters({
      fullSchedule: 'returnSchedule',
      rareShows: 'returnRareShows',
      customSchedule: 'returnCustomSchedule'
    }),
    rareShowThursday () {
      if (!this.rareShows) {
        return false
      }
      return this.rareShows.rare_thursday.find(item => item.active === true)
    },
    rareShowFriday () {
      if (!this.rareShows) {
        return false
      }
      return this.rareShows.rare_friday.find(item => item.active === true)
    },
    sortShowsForSchedule () {
      if (!this.fullSchedule) {
        return false
      }
      return [...this.fullSchedule]
        .filter(show => (
          !(show.archive_lahmastore_base_url === 'off-air' || !show.active)
        ))
        .sort((a, b) => a.day - b.day)
        .sort((a, b) => parseInt(a.start.replace(':', ''), 10) - parseInt(b.start.replace(':', ''), 10))
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
    setTimeout(() => {
      this.checkNowPlaying()
    }, 1000)
  },
  beforeDestroy () {
    // prevent memory leak
    clearInterval(this.interval)
  },
  created () {
    // update the time every minute
    if (this.isClient) {
      this.interval = setInterval(() => {
        this.checkNowPlaying()
      }, 60 * 1000)
    }
  },
  methods: {
    groupShowsByDay (shows) {
      if (!shows) { return false }
      const list = []
      const daybyMonday = this.getToday === 0 ? 7 : this.getToday
      const dayIndex = daybyMonday - 1
      this.latestRareThursday = shows
        .filter(item => item?.playlist_name?.startsWith('Ritka csut'))
        .filter(item => item?.archive_lahmastore_base_url !== this.rareShowThursday.archive_lahmastore_base_url)
      this.latestRareFriday = shows
        .filter(item => item?.playlist_name?.startsWith('Ritka pentek'))
        .filter(item => item?.archive_lahmastore_base_url !== this.rareShowFriday.archive_lahmastore_base_url)
      const filteredShows = shows
        .filter(val => !this.latestRareThursday.includes(val))
        .filter(val => !this.latestRareFriday.includes(val))
      // custom Schedule Day
      if (this.customSchedule?.is_active) {
        this.customScheduleDay = parseInt(this.customSchedule.day_number, 10)
        this.customScheduleEntries = this.customSchedule.schedule
        // TODO fix the correct index
        this.customPosition = this.customScheduleDay >= this.getToday ? this.customScheduleDay - this.getToday : (7 - this.getToday) + this.customScheduleDay
      }
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
        this.$sentry.captureException(new Error('Stream interrupted ', error))
        this.interval = setTimeout(this.checkNowPlaying, 15000)
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
