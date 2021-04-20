<template>
  <div>
    <div v-for="(day, index) in showsByDate" :key="day.id" class="mb-2">
      <div class="flex flex-row justify-between dayname">
        <h4>{{ dayNames[day[0].day-1] }}</h4>
        <span>{{ format(new Date(index === 0 ? todayDate :
          tommorrow.setDate(tommorrow.getDate() + 1)) , 'MMMM dd.') }}</span>
      </div>
      <div class="dayshows">
        <div v-for="show in day" :key="show.id">
          <nuxt-link :to="'/shows/' + show.archive_lahmastore_base_url">
            {{ show.name }}
          </nuxt-link>
          - {{ removeSeconds(show.start) }}-{{ removeSeconds(show.end) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'

export default {
  props: {
    shows: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      format,
      showsByDate: [],
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
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
    }
  },
  mounted () {
    this.groupShowsByDay(this.shows)
  },
  methods: {
    groupShowsByDay (shows) {
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
    }
  }

}

</script>

<style lang="scss" scoped>
.dayname {
  border-bottom: 1px solid;
  padding-bottom: 0.25rem;
  margin-bottom: 0.25rem;
}
.dayshows {
  margin-bottom: 1rem;
}
a {
  &:hover {
    font-weight: 500;
  }
}
</style>
