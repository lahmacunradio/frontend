<template>
  <div>
    <SubTitle title="Lahmacun Schedule" :maintitle="true" />
    <client-only>
      <div class="container mt-8">
        <div class="mb-4 weeknav">
          <button v-if="weekOffset !== 0" type="button" class="today-button" @click="goToToday">
            Today
          </button>
          <div class="flex items-center justify-center weeknav-pager">
            <button type="button" aria-label="Previous week" :disabled="!week.hasPrevious" @click="changeWeek(-1)">
              &lsaquo;
            </button>
            <h3 class="flex items-center mx-8">
              <span class="sr-only">Rotation week</span>
              <span class="weekletter" :class="`weekletter-${weekLetter}`" :title="`Rotation week ${weekLetter}`">{{ weekLetter }}</span>
              Week {{ week.isoWeek }} · {{ week.isoYear }}
            </h3>
            <button type="button" aria-label="Next week" :disabled="!week.hasNext" @click="changeWeek(1)">
              &rsaquo;
            </button>
          </div>
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
          <ScheduleFullitem v-for="show in day.shows" :key="show.id" :show="show" :is-today="day.date === week.today" />
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getBudapestDate } from '~/plugins/budapestTime'
import { getWeekLetter } from '~/plugins/fourWeekRotation'
import { buildWeekSchedule, getDefaultDayIndex, getWeekPage } from '~/plugins/weekSchedule'

export default {
  data () {
    return {
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      weekOffset: 0,
      selectedDay: 0
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
    },
    weekLetter () {
      return getWeekLetter(this.week.weekIndex)
    }
  },
  created () {
    this.selectedDay = getDefaultDayIndex(this.week)
  },
  methods: {
    changeDay (dayindex) {
      this.selectedDay = dayindex
    },
    // Keeps the selected weekday: Thursday stays Thursday in the next week
    changeWeek (step) {
      this.weekOffset = getWeekPage(this.weekOffset + step).offset
    },
    goToToday () {
      this.weekOffset = 0
      this.selectedDay = getDefaultDayIndex(this.week)
    }
  }
}
</script>

<style lang="scss" scoped>
// Phones: no room beside the pager, Today goes on its own row below it.
// Wider: Today sits in the left column, an empty right column keeps the pager centred.
// Either way Today appearing doesn't move the arrows.
.weeknav {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  align-items: center;
  @media (min-width: $mobile-width) {
    grid-template-columns: 1fr auto 1fr;
  }
  .weeknav-pager {
    grid-row: 1;
    @media (min-width: $mobile-width) {
      grid-column: 2;
    }
    button {
      font-size: 2rem;
      line-height: 1;
      padding: 0 0.5rem;
      &:disabled {
        opacity: 0.3;
        cursor: default;
      }
    }
  }
  .today-button {
    grid-row: 2;
    margin-top: 0.5rem;
    @media (min-width: $mobile-width) {
      grid-row: 1;
      grid-column: 1;
      justify-self: end;
      margin-top: 0;
      margin-right: 1rem;
    }
    border: 2px solid $black-color;
    padding: 0.25rem 0.75rem;
    font-weight: 500;
    &:hover {
      background-color: white;
    }
  }
  h3 {
    font-size: 1.5rem;
  }
}
// Colour is a second cue only: the letter is always shown
.weekletter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-right: 0.75rem;
  border: 2px solid $black-color;
  border-radius: 50%;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1;
}
.weekletter-A {
  background-color: $black-color;
  color: white;
}
.weekletter-B {
  background-color: white;
  color: $black-color;
}
.weekletter-C {
  background-color: $yellow-color;
  color: $black-color;
}
.weekletter-D {
  background-color: #775a8f;
  color: white;
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
