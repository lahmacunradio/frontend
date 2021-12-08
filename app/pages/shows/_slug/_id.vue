<template>
  <div>
    <h3 class="title-block">
      <NuxtLink :to="`/archive/`">
        Lahmacun Archive
      </NuxtLink>
    </h3>
    <div class="container mt-8">
      <div v-if="arcsiEpisode">
        <NuxtLink :to="`/shows/${slug}`" class="block">
          <div class="pb-6">
            <i class="fa fa-toggle-left" aria-hidden="true" /> Back to <b>{{ showTitle }}</b>
          </div>
        </NuxtLink>
        <div class="flex-row sm:flex">
          <div class="mb-4 sm:w-128 xsm:mr-8 show-image">
            <a class="cursor-pointer" @click="arcsiItemShadowbox = !arcsiItemShadowbox">
              <img :src="arcsiEpisode.image_url" :alt="arcsiEpisode.name">
              <Modal
                :media="arcsiEpisode.image_url"
                :title="arcsiEpisode.name"
                :description="arcsiEpisode.description"
                :visibility="arcsiItemShadowbox"
              />
            </a>
          </div>
          <div class="mb-4 show-description">
            <h3>{{ fullEpisodeTitle || arcsiEpisode.name }}</h3>
            <div class="episode-infos">
              <p v-if="arcsiEpisode.play_date">
                Episode Nr. {{ arcsiEpisode.number }},
                Original air date:
                {{ $moment(arcsiEpisode.play_date).format('yyyy. MMMM Do.') }}
                Language: <span v-sanitize.nothing="getLanguageGraph(arcsiEpisode.language)" class="language" />
              </p>
            </div>

            <div v-if="arcsiShow" class="show-infos">
              <p>
                {{ arcsiShow.active ? 'Show is active.' : 'Show is not active.' }}
                Airing time: {{ dayNames[arcsiShow.day - 1] }} {{
                  removeSeconds(arcsiShow.start)
                }}–{{ removeSeconds(arcsiShow.end) }}, {{ showFrequency(arcsiShow.frequency, arcsiShow.week) }}.
              </p>
            </div>

            <div>{{ arcsiEpisode.description }}</div>
            <div v-if="arcsiEpisode.play_file_name" class="py-4">
              <client-only>
                <div v-if="arcsiCurrentEpisode.id === arcsiEpisode.id">
                  <i>Episode is now in the Arcsi player...</i>
                </div>
                <div v-else>
                  <a v-if="fullEpisodeTitle" href="#" class="cursor-pointer" @click.prevent="playArcsi()">
                    <i class="fa fa-play" aria-hidden="true" /> Play {{ fullEpisodeTitle }}
                  </a>
                </div>
              </client-only>
            </div>
          </div>
        </div>
      </div>
      <div v-if="arcsiShow && otherEpisodes.length" class="py-8">
        <h4 class="pb-1 mb-4 text-center border-b border-current">
          Other Episodes from {{ arcsiShow.name }}
        </h4>
        <div class="grid gap-8 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="arcsi in otherEpisodes" :key="arcsi.id">
            <div>
              <NuxtLink
                class="block overflow-hidden aspect-ratio-1/1"
                :to="{ path: `/shows/${slug}/${arcsi.id.toString()}` }"
              >
                <img :src="mediaServerURL + slug + '/' + arcsi.image_url" alt="" class="my-2 image-fit">
              </NuxtLink>
              <NuxtLink :to="{ path: `/shows/${slug}/${arcsi.id.toString()}` }">
                <h5 class="mt-4">
                  {{ arcsi.name }}
                </h5>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { arcsiBaseURL, arcsiItemBaseURL, mediaServerURL } from '~/constants'

export default {
  components: {
  },
  data () {
    return {
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      arcsiItemShadowbox: false,
      slug: this.$route.params.slug,
      id: this.$route.params.id,
      arcsiEpisode: null,
      arcsiShow: null,
      playEpisode: false,
      mediaServerURL
    }
  },
  async fetch () {
    this.arcsiEpisode = await this.$axios.get(`${arcsiItemBaseURL}/${this.id}`)
      .then(res => res.data)
      .catch((error) => {
        console.log(error)
        this.$nuxt.error({ statusCode: 500, message: 'Arcsi server not available' })
      })
    if (this.arcsiEpisode && this.arcsiEpisode.shows[0]) {
      this.arcsiShow = await this.$axios.get(`${arcsiBaseURL}/show/${this.arcsiEpisode.shows[0].id}`)
        .then(res => res.data)
        .catch((error) => {
          console.log(error)
          this.$nuxt.error({ statusCode: 500, message: 'Arcsi server not available' })
        })
    }
  },
  head () {
    return {
      title: this.fullEpisodeTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.arcsiEpisode?.description
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.fullEpisodeTitle
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.arcsiEpisode?.description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.arcsiEpisode?.image_url
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
    showTitle () {
      if (!this.arcsiEpisode) { return 'Show' }
      return this.arcsiEpisode?.shows?.[0].name
    },
    fullEpisodeTitle () {
      if (!this.arcsiEpisode) { return 'Arcsi Episode' }
      return this.arcsiEpisode?.shows?.[0].name + ' - ' + this.arcsiEpisode?.name
    },
    arcsiVisible () {
      return this.$store.state.player.isArcsiVisible
    },
    arcsiEpisodePlaying () {
      if (!this.$store.state.player.isArcsiPlaying) {
        return false
      }
      return this.$store.state.player.isArcsiPlaying
    },
    arcsiCurrentEpisode () {
      if (!this.$store.state.player.arcsiEpisode) {
        return false
      }
      return this.$store.state.player.arcsiEpisode
    },
    otherEpisodes () {
      if (!this.arcsiShow.items) {
        return false
      }
      return this.arcsiShow.items
        .filter(item => item.id.toString() !== this.id)
        .filter(item => item.play_date < this.getToday)
        .filter(item => item.archived === true)
    }
  },
  beforeDestroy () {
    this.arcsiEpisode = null
  },
  methods: {
    playArcsi () {
      this.$store.commit('player/isArcsiPlaying', true)
      this.$store.commit('player/isArcsiVisible', true)
      this.$store.commit('player/currentlyPlayingArcsi', this.arcsiEpisode)
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
