<template>
  <div class="container mt-12">
    <div class="flex-row sm:flex">
      <div class="mb-4 sm:w-128 xsm:mr-8 show-image">
        <a class="cursor-pointer" @click="shadowbox = !shadowbox">
          <img :src="arcsiInfosBlock.cover_image_url" :alt="arcsiInfosBlock.name">
          <Modal :media="arcsiInfosBlock.cover_image_url" :title="arcsiInfosBlock.name" :description="arcsiInfosBlock.description" :visibility="shadowbox" />
        </a>
      </div>
      <div class="mb-4 show-description">
        <h2 class="mt-0 font-bold">
          {{ arcsiInfosBlock.name }}
        </h2>
        <div class="show-infos">
          <p>Airing time: {{ dayNames[arcsiInfosBlock.day - 1] }} {{ removeSeconds(arcsiInfosBlock.start) }}–{{ removeSeconds(arcsiInfosBlock.end) }}, {{ showFrequency(arcsiInfosBlock.frequency, arcsiInfosBlock.week) }}, Language: <span v-sanitize.nothing="getLanguageGraph(arcsiInfosBlock.language)" class="language" /></p>
          <p>
            Last episode:
            <NuxtLink :to="{ path: `/shows/${slug}/${arcsiShowsList[0].id.toString()}` }">
              <strong>{{ arcsiShowsList[0].name }}</strong>
            </NuxtLink>,
            {{ formatDistance(new Date(arcsiShowsList[0].play_date), new Date().getTime(), { addSuffix: true }) }}.
            {{ arcsiInfosBlock.active ? 'Show is active.' : 'Show is not active.' }}
          </p>
        </div>
        <div>{{ arcsiInfosBlock.description }}</div>
      </div>
    </div>
    <div>
      <h3 class="pb-1 mb-4 text-center border-b border-current">
        Arcsived Shows
      </h3>
      <div class="grid gap-8 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div v-for="arcsi in arcsiShowsList" :key="arcsi.id">
          <div>
            <NuxtLink class="block overflow-hidden aspect-ratio-1/1" :to="{ path: `/shows/${slug}/${arcsi.id.toString()}` }">
              <img :src="mediaServerURL + slug + '/' + arcsi.image_url" alt="" class="my-2 image-fit">
            </NuxtLink>
            <NuxtLink :to="{ path: `/shows/${slug}/${arcsi.id.toString()}` }">
              <h5 class="mt-4">
                {{ arcsi.name }}
              </h5>
            </NuxtLink>
            <small>Play date: {{ format(new Date(arcsi.play_date), 'yyyy. MMMM dd.') }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format, formatDistance } from 'date-fns'

import { mediaServerURL } from '~/constants'

export default {
  data () {
    return {
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      shadowbox: false,
      slug: this.$route.params.slug,
      mediaServerURL,
      format,
      formatDistance
    }
  },
  head () {
    return {
      title: this.arcsiInfosBlock?.name,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.arcsiInfosBlock?.description
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.arcsiInfosBlock?.name
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.arcsiInfosBlock?.description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.arcsiInfosBlock?.cover_image_url
        }
      ]
    }
  },
  computed: {
    getToday () {
      const d = new Date()
      const year = d.getFullYear()
      const month = (d.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
      const day = d.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })
      return `${year}-${month}-${day}`
    },
    arcsiShows () {
      return this.$store.state.arcsiShows
    },
    arcsiInfosBlock () {
      if (this.arcsiShows) {
        const allShows = [...this.arcsiShows]
        return allShows
          .filter(show => show.archive_lahmastore_base_url === this.$route.params.slug)
          .shift()
      }
      return null
    },
    arcsiShowsList () {
      if (this.arcsiShows) {
        const showslist = [...this.arcsiInfosBlock.items]
        return showslist
          .filter(show => show.play_date < this.getToday)
          .filter(show => show.archived === true)
          .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
      }
      return null
    }
  },
  methods: {
    showFrequency (frequency, week) {
      let showText = 'Not defined'
      if (frequency === 1) {
        showText = 'New Episode: Monthly'
      }
      if (frequency === 2) {
        showText = 'New Episode: Every Second Week'
      }
      if (frequency >= 3) {
        showText = 'New Episode: Weekly'
      }
      return showText
    },
    getLanguageGraph (type) {
      if (type === 'music') {
        return '🎵'
      }
      if (type === 'hu_hu') {
        return '🇭🇺'
      }
      if (type === 'en_uk') {
        return '🇬🇧'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.show-image {
    min-width: 300px;
    max-width: 360px;
}
.show-infos {
  margin-bottom: 1rem;
}
.language {
  display: inline-block;
  vertical-align: middle;
}
</style>
