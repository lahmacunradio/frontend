<template>
  <div v-if="show" class="dayblock">
    <div class="container mx-auto sm:flex show-basic-infos">
      <div class="mr-4 timing-infos">
        <div class="mb-2 time-block sm:mb-0">
          {{ removeSeconds(show[0].start) }}
          <img src="@/assets/img/arrow-schedule.svg" alt="" class="inline-block w-10">
          {{ removeSeconds(show[0].end) }}
        </div>
        <div class="onairshow">
          <span class="text-red-600">●</span>
          On Air
        </div>
      </div>
      <div class="flex justify-between w-full schedule-infos">
        <div>
          <div v-for="(showItem, index) in show" :key="index" class="inline-block">
            <NuxtLink :to="'/shows/' + showItem.archive_lahmastore_base_url" class="">
              <b>{{ showItem.name }}</b>
            </NuxtLink>
            <span v-if="index < show.length - 1" class="mx-2"> | </span>
          </div>
          <div v-if="opened" class="mt-4">
            Alternating shows
          </div>
        </div>
        <div>
          <a href="#" @click.prevent="opened = !opened">
            <i v-if="opened" class="fa fa-chevron-up" aria-hidden="true" />
            <i v-else class="fa fa-chevron-down" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      opened: false,
      loadedShow: null
    }
  },
  computed: {
    isTouchEnabled () {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
    }

  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dayblock {
    @apply flex flex-row py-4;
    .show-basic-infos {
        position: relative;
        @media (min-width: $tablet-width) {
            max-width: $tablet-width;
        }
        .timing-infos {
            min-width: 130px;
        }
        .time-block {
            white-space: nowrap;
        }
    }
    &:hover {
      @media (min-width: $tablet-width) {
        background: rgba(255, 255, 255, 0.5);
      }
    }
    .onairtext {
        text-transform: uppercase;
    }
    .onair-image {
        width: 150px;
        flex-shrink: 0;
        @media (min-width: $small-width) and (max-width: $mobile-width) {
            width: 100px;
        }
        @media (max-width: $small-width) {
            margin: 1rem 0;
        }
    }
    .onair-infos {
        overflow: auto;
    }
}

.onairshow {
    opacity: 0;
    text-transform: uppercase;
    font-weight: bold;
    white-space: nowrap;
    display: none;
}

.onair {
    @apply bg-white py-8;
    .onairshow {
        display: block;
        opacity: 1;
        animation: pulse 5s infinite;
    }
    &:hover {
        @apply bg-white;
    }
}

@keyframes pulse {
  0% { opacity: 0.3; }
  30% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0.3; }
}

.language {
  display: inline-block;
  vertical-align: middle;
}
</style>
