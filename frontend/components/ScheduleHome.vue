<template>
  <div>
    <div v-for="(day, index) in showsByDate" :key="day.id" class="mb-2">
      <div>
        <h5>{{ dayNames[day[0].day-1] }}</h5>
      </div>
      <div v-for="show in day" :key="show.id">
        <nuxt-link :to="'/shows/' + show.archive_lahmastore_base_url">
          {{ show.name }}
        </nuxt-link>
        - {{ show.start }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    shows: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      showsByDate: [],
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  },
  computed: {
    getToday () {
      const d = new Date()
      return d.getDay()
    }
  },
  mounted () {
    this.groupShowsByDay(this.shows)
  },
  methods: {
    groupShowsByDay (shows) {
      const list = []
      const daybyMonday = this.getToday === 0 ? 7 : this.getToday
      for (let i = 0; i < 7; i++) {
        list.push([])
        shows.forEach((show) => {
          if (show.archive_lahmastore_base_url === 'off-air' || !show.active) { return false }
          if (show.day - 1 === i) {
            list[i].push(show)
          }
        })
      }
      // TODO sorty by current day
      this.showsByDate = list
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
</style>
