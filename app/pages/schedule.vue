<template>
  <div>
    <SubTitle title="Lahmacun Schedule" :maintitle="true" />
    <client-only>
      <div class="container mt-8">
        <div class="flex items-center justify-center mb-4 weeknav">
          <button type="button" aria-label="Previous week" :disabled="!week.hasPrevious" @click="changeWeek(-1)">
            &lsaquo;
          </button>
          <h3 class="mx-8">
            Week {{ week.isoWeek }} · {{ week.isoYear }}
          </h3>
          <button type="button" aria-label="Next week" :disabled="!week.hasNext" @click="changeWeek(1)">
            &rsaquo;
          </button>
        </div>
        <div class="mb-4 border-b days">
          <ul>
            <li v-for="(day, dayIndex) in week.days" :key="day.date">
              <div
                class="px-4 py-2"
                :class="[selectedDay === dayIndex && 'bg-white', day.date === week.today && 'today']"
                :aria-current="day.date === week.today ? 'date' : null"
                @click="changeDay(dayIndex)"
              >
                <h4 class="block">
                  {{ dayNames[day.day - 1] }}
                </h4>
                {{ $moment(day.date).format('D MMM') }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-span-2 selectday">
        <div v-for="(day, index) in week.days" :key="day.date" class="dayschedule" :class="index === selectedDay ? 'block' : 'hidden'">
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
import { getBudapestDate } from '~/plugins/budapestTime'
import { buildWeekSchedule, getDefaultDayIndex, getWeekPage } from '~/plugins/weekSchedule'

export default {
  data () {
    return {
      streamServer,
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      weekOffset: 0,
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
    // Reads the clock, so it also re-runs on every store refresh (10 min): after Sunday midnight,
    // offset 0 moves on to the new week then.
    week () {
      const { monday, hasPrevious, hasNext } = getWeekPage(this.weekOffset)
      const shows = Array.isArray(this.arcsiShows) ? this.arcsiShows : []
      return { ...buildWeekSchedule(shows, monday), hasPrevious, hasNext, today: getBudapestDate() }
    }
  },
  created () {
    this.selectedDay = getDefaultDayIndex(this.week)
  },
  methods: {
    changeDay (dayindex) {
      this.selectedDay = dayindex
    },
    changeWeek (step) {
      this.weekOffset = getWeekPage(this.weekOffset + step).offset
      this.selectedDay = getDefaultDayIndex(this.week)
    }
  }
}
</script>

<style lang="scss" scoped>
.weeknav {
  button {
    font-size: 2rem;
    line-height: 1;
    padding: 0 0.5rem;
    &:disabled {
      opacity: 0.3;
      cursor: default;
    }
  }
  h3 {
    font-size: 1.5rem;
  }
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
        .today h4 {
          text-decoration: underline;
        }
    }
  }
}
</style>
