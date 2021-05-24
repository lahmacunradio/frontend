<template>
  <div>
    <div v-for="(day, index) in showsByDate" :key="day.id" class="mb-2 scheduleblock">
      <div class="flex flex-row justify-between dayname">
        <h4>{{ dayNames[day[0].day-1] }}</h4>
        <span>{{ format(new Date(index === 0 ? todayDate :
          tommorrow.setDate(tommorrow.getDate() + 1)) , 'MMMM dd.') }}</span>
      </div>
      <div class="dayshows">
        <div v-for="show in day" :key="show.id" :class="showAirCheck(index, show.name) ? 'dayblock onair' : 'dayblock'">
          <div class="show-basic-infos">
            {{ removeSeconds(show.start) }}-{{ removeSeconds(show.end) }} -
            <nuxt-link :to="'/shows/' + show.archive_lahmastore_base_url">
              {{ show.name }}
            </nuxt-link>
            <div class="show-image" :style="{ backgroundImage: `url(${show.cover_image_url})` }" />
          </div>
          <div v-if="showAirCheck(index, show.name)" class="onairtext">
            &nbsp;— On Air
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { streamServer } from '~/constants'

export default {
  props: {
    shows: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      streamServer,
      format,
      showsByDate: [],
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      interval: null,
      nowPlaying: {}
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
    },
    streamShowTitle () {
      if (!this.nowPlaying) {
        return false
      } else if (this.nowPlaying?.live?.is_live) {
        return this.nowPlaying?.live?.streamer_name
      } else {
        return this.nowPlaying?.now_playing?.song.artist
      }
    }
  },
  mounted () {
    this.groupShowsByDay(this.shows)
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
    showAirCheck (index, showname) {
      if (index === 0 && this.streamShowTitle && this.slugify(this.streamShowTitle) === this.slugify(showname)) {
        return true
      }
    },
    checkNowPlaying () {
      this.$axios.get(this.streamServer).then((response) => {
        this.nowPlaying = response.data
      }).catch((error) => {
        console.error(error)
      })
    },
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
a {
  &:hover {
    font-weight: 500;
  }
}
.scheduleblock {
  .dayname {
    border-bottom: 1px solid;
    padding-bottom: 0.25rem;
    margin-bottom: 0.25rem;
  }
  .dayshows {
    margin-bottom: 1rem;
    position: relative;
    display: none;
    .dayblock {
      @apply flex flex-row;
      .show-basic-infos {
        .show-image {
          width: 150px;
          height: 150px;
          background: center center no-repeat;
          background-size: cover;
          border-radius: 5px;
          display: none;
          position: absolute;
          z-index: 100;
          top: calc(50% - 75px);
          right: 0;
        }
      }
      &:hover .show-image {
        display: block;
      }
      .onairtext {
        text-transform: uppercase;
      }
    }
  }
  &:first-child .dayshows, &:hover .dayshows {
    display: block;
  }
}

@keyframes pulse {
  0% { color: black; }
  30% { color: white; }
  70% { color: white; }
  100% { color: black; }
}
.onair {
    animation: pulse 5s infinite;
}

</style>
