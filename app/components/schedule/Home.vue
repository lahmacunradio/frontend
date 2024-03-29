<template>
  <div class="h-full overflow-hidden">
    <div class="text-center schedule-head">
      <div class="infos title">
        <nuxt-link to="/schedule">
          <h3>Today's Schedule</h3>
        </nuxt-link>
      </div>
    </div>
    <div class="flex items-center scheduleblock">
      <div class="w-full pt-4 pb-8 m-auto">
        <div v-for="(show, index) in showsByDate[0]" :key="show.id * (index + index) * index" :class="showAirCheck(0, show.name) ? 'dayblock onair' : 'dayblock'">
          <div class="onairshow">
            <span class="text-red-600">●</span>
            On Air
          </div>
          <div class="show-basic-infos">
            {{ removeSeconds(show.start) }}
            <img src="@/assets/img/arrow-schedule.svg" alt="" class="inline-block w-8 pb-1">
            {{ removeSeconds(show.end) }} -
            <div v-if="show.archive_lahmastore_base_url.includes(currentHost)" class="inline">
              <NuxtLink :to="show.archive_lahmastore_base_url.replace(currentHost, '')">
                <b>{{ show.name }}</b>
              </NuxtLink>
            </div>
            <div v-else-if="show.archive_lahmastore_base_url.includes('lahmacun.hu/shows/')" class="inline">
              <NuxtLink :to="'/shows/' + show.archive_lahmastore_base_url.substring(show.archive_lahmastore_base_url.lastIndexOf('/') + 1)">
                <b>{{ show.name }}</b>
              </NuxtLink>
            </div>
            <div v-else-if="show.archive_lahmastore_base_url.includes('http')" class="inline">
              <a :href="show.archive_lahmastore_base_url" target="_blank">
                <b>{{ show.name }}</b>
              </a>
            </div>
            <div v-else-if="show.archive_lahmastore_base_url" class="inline">
              <NuxtLink :to="'shows/' + show.archive_lahmastore_base_url.replace(currentHost, '')">
                <b>{{ show.name }}</b>
              </NuxtLink>
            </div>
            <div v-else class="inline">
              <b>{{ show.name }}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      currentHost: typeof window !== 'undefined' ? window.location.origin : null,
      isClient: typeof window !== 'undefined' && window.document,
      streamServer,
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      interval: null,
    }
  },
  computed: {
    ...mapGetters({
      streamShowTitle: 'player/getStreamShowTitle'
    }),
    getToday (){
      return this.getTodayNumeric()
    },
    todayDate () {
      return new Date()
    },
    tommorrow () {
      return new Date(new Date())
    },
    todayName () {
      return this.dayNames[this.getToday - 1]
    },
    showsByDate () {
      return this.$store.getters['player/getShowsByDate']
    }
  },
  methods: {
    showAirCheck (index, showname) {
      if (index === 0 && this.streamShowTitle && this.slugify(this.streamShowTitle) === this.slugify(showname)) {
        return true
      }
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
.schedule-head {
  background: $black-color;
  color: white;
  h3 {
    margin: 0 0.5rem;
    padding: 0.5rem;
    text-transform: uppercase;
  }
  .day {
    background: $black-color;
    color: white;
  }
}
.scheduleblock {
  height: calc(100% - 50px);
  max-height: 450px;
  overflow: auto;
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: $lahma-pink;
  }
  .dayname {
    border-bottom: 1px solid;
    padding-bottom: 0.25rem;
    margin-bottom: 0.25rem;
  }
  .dayblock {
      @apply flex flex-row md:px-8 py-2 px-4;
      .show-basic-infos {
        position: relative;
        width: 100%;
        min-width: 140px;
      }
      &:hover {
        @media (min-width: $tablet-width) {
          background: rgba(255, 255, 255, 0.5);
        }
      }
      .onairtext {
        text-transform: uppercase;
      }
    }

  &:first-child .dayshows, &:hover .dayshows {
    display: block;
  }
  .onairshow {
    opacity: 0;
    padding-right: 1rem;
    white-space: nowrap;
  }
  .onair {
      @apply bg-white;
      .onairshow {
        opacity: 1;
        animation: pulse 5s infinite;
      }
      &:hover {
        @apply bg-white;
      }
  }
}

@keyframes pulse {
  0% { opacity: 0.3; }
  30% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0.3; }
}

.time-block {
  width: 280px;
}

</style>
