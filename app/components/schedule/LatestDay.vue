<template>
  <div :ref="dayNamesShort[index]" class="flex justify-items-start items-stretch mb-6">
    <a href="#" class="border-black border-t border-b px-4 py-4 w-1/3" @click.prevent="openDay()">
      <div class="flex justify-between items-center">
        <h5>
          <span class="md:block hidden">
            {{ dayNames[index] }}
          </span>
          <span class="block md:hidden">
            {{ dayNamesShort[index] }}
          </span>
        </h5>
        <div>
          <i v-if="showDay" class="fa fa-chevron-down" aria-hidden="true" />
          <i v-else class="fa fa-chevron-right" aria-hidden="true" />
        </div>
      </div>
    </a>
    <div v-show="showDay" class="w-2/3 border-t border-black">
      <div v-for="(show, showindex) in day" :key="index + showindex">
        <ScheduleLatestEpisodes :show="show" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    day: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      showsByDate: [],
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      dayNamesShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      showDay: false
    }
  },
  computed: {
    getToday () {
      const d = new Date()
      return d.getDay()
    }
  },
  mounted () {
    if (this.index === this.getToday - 1) {
      this.openDay()
    }
  },
  methods: {
    openDay () {
      this.showDay = !this.showDay
      if (this.showDay) {
        setTimeout(() => {
          this.scrollToRef(this.dayNamesShort[this.index])
        }, 100)
      }
    }
  }
}
</script>
