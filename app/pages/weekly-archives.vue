<template>
  <div>
    <h3 class="title-block">
      Lahmacun Weekly Archives
    </h3>
    <client-only>
      <div class="container mt-8">
        <div class="selectday">
          <div v-for="(day, index) in showsByDate" :key="index" :ref="index" class="dayschedule">
            <ScheduleLatestDay :day="day" :index="index" />
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
      nowPlaying: {}
    }
  },
  head () {
    return {
      title: 'Lahmacun Weekly Archives',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Weekly archives of active Lahmacun shows'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Weekly Archives'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Weekly archives of active Lahmacun shows'
        }
      ]
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
    todayName () {
      return this.dayNames[this.getToday - 1]
    }
  },
  mounted () {
    this.groupShowsByDay(this.sortShowsForSchedule)
  },
  beforeDestroy () {
    // prevent memory leak
    clearInterval(this.interval)
  },
  methods: {
    groupShowsByDay (shows) {
      if (!shows) { return false }
      const list = []
      for (let i = 0; i < 7; i++) {
        list.push([])
        shows.forEach((show) => {
          if (show.archive_lahmastore_base_url === 'off-air' || !show.active) { return false }
          if (show.day - 1 === i) {
            list[i].push(show)
          }
        })
      }
      this.showsByDate = [...list]
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
