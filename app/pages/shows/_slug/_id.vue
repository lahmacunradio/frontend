<template>
  <div>
    <SubTitle title="Lahmacun Archive" url="/archive" />
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
            <h1 class="h3">
              {{ fullEpisodeTitle || arcsiEpisode.name }}
            </h1>
            <div class="episode-infos">
              <p v-if="arcsiEpisode.play_date">
                Episode Nr. {{ arcsiEpisode.number }},
                Original air date:
                {{ airDate }}
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

            <div v-sanitize="[ sanitizeOptions, arcsiEpisode.description ]" />

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
      <div v-if="arcsiShow && arcsiEpisodesList && arcsiEpisodesList.length" class="py-8">
        <h4 class="pb-1 mb-4 text-center border-b border-current">
          Other Episodes from {{ arcsiShow.name }}
        </h4>
        <div class="pt-4 pb-6 text-center change-order xsm:text-right">
          <a id="bydate" ref="bydate" href="#" class="mr-2 selected change-order-button" @click.prevent="sortAirtime">
            <i v-if="airtimeAsc" class="fa fa-sort-numeric-desc" aria-hidden="true" />
            <i v-else class="fa fa-sort-numeric-asc" aria-hidden="true" />
            Order by Air time
          </a>
          <a id="alphabetical" ref="alphabetical" class="change-order-button" href="#" @click.prevent="sortAlphabeticaly">
            <i v-if="alphabeticAsc" class="fa fa-sort-alpha-asc" aria-hidden="true" />
            <i v-else class="fa fa-sort-alpha-desc" aria-hidden="true" />
            Order by Title
          </a>
        </div>
        <div class="grid gap-8 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="arcsi in arcsiEpisodesList" :key="arcsi.id">
            <div>
              <NuxtLink
                class="block overflow-hidden aspect-ratio-1/1"
                :to="{ path: `/shows/${slug}/${getCorrectSlug(arcsi.play_file_name)}` }"
              >
                <img :src="mediaServerURL + slug + '/' + arcsi.image_url" alt="" class="my-2 image-fit">
              </NuxtLink>
              <NuxtLink :to="{ path: `/shows/${slug}/${getCorrectSlug(arcsi.play_file_name)}` }">
                <h5 class="mt-4">
                  {{ arcsi.name }}
                </h5>
              </NuxtLink>
              <small>Play date: {{ $moment(arcsi.play_date).format('yyyy. MMMM Do.') }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { arcsiBaseURL, mediaServerURL } from '~/constants'

export default {
  data () {
    return {
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      arcsiItemShadowbox: false,
      slug: this.$route.params.slug,
      id: this.$route.params.id,
      arcsiEpisode: null,
      arcsiShow: null,
      playEpisode: false,
      mediaServerURL,
      sanitizeOptions: {
        allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'b', 'i', 'em', 'strong', 'img', 'figure', 'hr', 'br', 'a', 'sup', 'sub', 'iframe'],
        allowedAttributes: {
          img: ['*'],
          iframe: ['*'],
          a: ['*']
        }
      },
      sortingType: 'air',
      alphabeticAsc: false,
      airtimeAsc: true
    }
  },
  async fetch () {
    this.arcsiEpisode = await this.$axios.get(`${arcsiBaseURL}/show/${this.slug}/episode/${this.id}`)
      .then(res => res.data)
      .catch((error) => {
        this.$sentry.captureException(new Error('Arcsi server not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Arcsi server not available' })
      })
    if (this.arcsiEpisode && this.arcsiEpisode.shows[0]) {
      this.arcsiShow = await this.$axios.get(arcsiBaseURL + '/show/' + this.slug + '/page')
        .then(res => res.data)
        .catch((error) => {
          this.$sentry.captureException(new Error('Arcsi server not available ', error))
          this.$nuxt.error({ statusCode: 404, message: 'Arcsi server not available' })
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
          content: this.metaDescription
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.fullEpisodeTitle
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.metaDescription
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
    ...mapGetters('player', {
      arcsiCurrentEpisode: 'getArcsiEpisode',
      arcsiVisible: 'getArcsiVisibility',
      arcsiEpisodePlaying: 'getArcsiPlayState'

    }),
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
    airDate () {
      if (!this.arcsiEpisode?.play_date) {
        return ''
      }
      return this.$moment(this.arcsiEpisode.play_date).format('yyyy. MMMM Do.')
    },
    metaDescription () {
      if (!this.arcsiEpisode?.description) {
        return `Aired on ${this.airDate}`
      }
      return this.truncate(this.arcsiEpisode?.description, 150)
    },
    arcsiEpisodesList () {
      if (this.arcsiShow && this.arcsiShow.items?.length) {
        const itemsSorted = this.arcsiShow?.items
          .filter(item => item.id !== this.arcsiEpisode.id)
          .filter(show => show.play_date < this.getToday)
          .filter(show => show.archived === true)
          .sort((a, b) => b.number - a.number)
          .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
        if (this.airtimeAsc && this.sortingType === 'air') {
          return itemsSorted
            .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
        } else if (!this.airtimeAsc && this.sortingType === 'air') {
          return itemsSorted
            .sort((a, b) => new Date(a.play_date) - new Date(b.play_date))
        } else if (this.alphabeticAsc && this.sortingType === 'abc') {
          return itemsSorted
            .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
        } else if (!this.alphabeticAsc && this.sortingType === 'abc') {
          return itemsSorted
            .sort((a, b) => b.name.localeCompare(a.name, 'en', { sensitivity: 'base' }))
        } else {
          return itemsSorted
        }
      }
      return null
    }
  },
  beforeDestroy () {
    this.arcsiEpisode = null
    this.arcsiShow = null
  },
  methods: {
    playArcsi () {
      this.$store.commit('player/isArcsiPlaying', true)
      this.$store.commit('player/isArcsiVisible', true)
      this.$store.commit('player/currentlyPlayingArcsi', this.arcsiEpisode)
    },
    sortAlphabeticaly () {
      this.sortingType = 'abc'
      this.alphabeticAsc = !this.alphabeticAsc
      this.airtimeAsc = false
      this.$refs.alphabetical.classList.add('selected')
      this.$refs.bydate.classList.remove('selected')
    },
    sortAirtime () {
      this.sortingType = 'air'
      this.airtimeAsc = !this.airtimeAsc
      this.alphabeticAsc = false
      this.$refs.alphabetical.classList.remove('selected')
      this.$refs.bydate.classList.add('selected')
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
.change-order-button {
  border: 1px solid #775a8f;
  @apply py-2 px-4 rounded whitespace-nowrap;
  &.selected, &:hover {
    @apply bg-white bg-opacity-25;
  }
  @media (max-width: $mobile-width) {
    @apply text-sm px-2;
  }
}
</style>
