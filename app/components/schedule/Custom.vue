<template>
  <div class="dayblock">
    <div class="container mx-auto sm:flex show-basic-infos">
      <div class="mr-4 timing-infos">
        <div class="mb-2 time-block sm:mb-0">
          {{ removeSeconds(show.start) }}
          <img src="@/assets/img/arrow-schedule.svg" alt="" class="inline-block w-8 pb-1">
          {{ removeSeconds(show.end) }}
        </div>
      </div>
      <div class="flex justify-between w-full schedule-infos">
        <div class="onair-infos">
          <div v-if="show.archive_lahmastore_base_url.includes(currentHost)">
            <NuxtLink :to="show.archive_lahmastore_base_url.replace(currentHost, '')" class="block mb-2">
              <b>{{ show.name }}</b>
            </NuxtLink>
          </div>
          <div v-else-if="show.archive_lahmastore_base_url">
            <a :href="show.archive_lahmastore_base_url" target="_blank">
              <b>{{ show.name }}</b>
            </a>
          </div>
          <div v-else>
            <b>{{ show.name }}</b>
          </div>
          <div v-if="opened" class="flex mt-4">
            <div v-if="show.image" class="mr-4 onair-image">
              <img :src="show.image" :alt="show.name">
            </div>
            <div v-sanitize="[sanitizeOptions, show.description]" />
          </div>
        </div>
        <div v-if="show.description">
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
      type: Object,
      required: true
    }
  },
  data () {
    return {
      currentHost: typeof window !== 'undefined' ? window.location.origin : null,
      opened: false,
      sanitizeOptions: {
        allowedTags: ['b', 'i', 'em', 'strong', 'br', 'a', 'sup'],
        allowedAttributes: {
          a: ['*']
        }
      }
    }
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
            min-width: 9rem;
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
