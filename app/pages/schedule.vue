<template>
  <div>
    <SubTitle title="Lahmacun Schedule" :maintitle="true" />
    <client-only>
      <div class="container mt-8">
        <div class="mb-4 border-b days">
          <ul>
            <li v-for="(day, dayIndex) in days" :key="day.date">
              <div class="px-4 py-2" :class="selectedDay === dayIndex && 'bg-white'" @click="changeDay(dayIndex)">
                <h4 class="block">
                  {{ dayNames[day.day - 1] }}
                </h4>
                {{ $moment(day.date).format('MMM Do') }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="days.length" class="col-span-2 selectday">
        <div v-for="(day, index) in days" :key="day.date" class="dayschedule" :class="index === selectedDay ? 'block' : 'hidden'">
          <div v-for="(show, showindex) in day.shows" :key="index + showindex">
            <div v-if="customPosition === index">
              <ScheduleCustom :show="show" />
            </div>
            <div v-else>
              <ScheduleFullitem :show="show" />
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
import { buildRollingSchedule } from '~/plugins/rollingSchedule'

export default {
  data () {
    return {
      streamServer,
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      selectedDay: 0,
      customPosition: null,
      interval: null
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
      arcsiShows: 'returnArcsiShowsForSchedule'
    }),
    days () {
      return Array.isArray(this.arcsiShows) ? buildRollingSchedule(this.arcsiShows) : []
    }
  },
  methods: {
    changeDay (dayindex) {
      this.selectedDay = dayindex
    },
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
