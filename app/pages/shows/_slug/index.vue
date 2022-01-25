<template>
  <div>
    <SubTitle title="Lahmacun Shows" url="/shows/" />
    <div class="container mt-10">
      <div class="flex-row sm:flex">
        <div class="mb-4 sm:w-128 xsm:mr-8 show-image">
          <a class="cursor-pointer" @click="shadowbox = !shadowbox">
            <img :src="arcsiInfosBlock.cover_image_url" :alt="arcsiInfosBlock.name">
            <Modal
              :media="arcsiInfosBlock.cover_image_url"
              :title="arcsiInfosBlock.name"
              :description="arcsiInfosBlock.description"
              :visibility="shadowbox"
            />
          </a>
        </div>
        <div class="mb-4 show-description">
          <h2 class="mt-0 font-bold">
            {{ arcsiInfosBlock.name }}
          </h2>
          <div class="show-infos">
            <p>
              Airing time: {{ dayNames[arcsiInfosBlock.day - 1] }} {{
                removeSeconds(arcsiInfosBlock.start)
              }}–{{ removeSeconds(arcsiInfosBlock.end) }},
              {{ showFrequency(arcsiInfosBlock.frequency, arcsiInfosBlock.week) }}, Language: <span
                v-sanitize.nothing="getLanguageGraph(arcsiInfosBlock.language)"
                class="language"
              />
            </p>
            <p v-if="arcsiShowsList && arcsiShowsList.length">
              {{ arcsiInfosBlock.active ? 'Show is active.' : 'Show is not active.' }}
              Latest episode:
              <NuxtLink :to="{ path: `/shows/${slug}/${arcsiShowsList[0].id.toString()}` }">
                <strong>{{ arcsiShowsList[0].name }}</strong>
              </NuxtLink>,
              {{ $moment(arcsiShowsList[0].play_date).fromNow() }}.
            </p>
          </div>
          <div v-sanitize="[ sanitizeOptions, arcsiInfosBlock.description ]" class="description-text" />
        </div>
      </div>
      <div v-if="arcsiShowsList && arcsiShowsList.length">
        <h3 class="pb-1 mb-4 text-center border-b border-current">
          Archived Shows
        </h3>
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
          <div v-for="arcsi in arcsiShowListFiltered" :key="arcsi.id">
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
              <small>Play date: {{ $moment(arcsi.play_date).format('yyyy. MMMM Do.') }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mediaServerURL } from '~/constants'

export default {
  data () {
    return {
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      shadowbox: false,
      slug: this.$route.params.slug,
      mediaServerURL,
      sanitizeOptions: {
        allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'b', 'i', 'em', 'strong', 'img', 'figure', 'hr', 'br', 'a', 'sup', 'sub', 'iframe'],
        allowedAttributes: {
          img: ['*'],
          iframe: ['*'],
          a: ['*']
        }
      },
      arcsiShowListFiltered: null,
      alphabeticAsc: false,
      airtimeAsc: true
    }
  },
  head () {
    return {
      title: this.arcsiInfosBlock?.name,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.metaDescription
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.arcsiInfosBlock?.name
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.metaDescription
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
          .sort((a, b) => b.number - a.number)
          .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
      }
      return null
    },
    metaDescription () {
      if (!this.arcsiInfosBlock?.description) {
        return ''
      }
      return this.truncate(this.arcsiInfosBlock?.description, 150)
    }
  },
  mounted () {
    this.arcsiShowListFiltered = this.arcsiShowsList
  },
  methods: {
    sortAlphabeticaly () {
      if (this.alphabeticAsc) {
        this.arcsiShowListFiltered = this.arcsiShowListFiltered.sort((a, b) => b.name.localeCompare(a.name, 'en', { sensitivity: 'base' }))
        this.alphabeticAsc = false
      } else {
        this.arcsiShowListFiltered = this.arcsiShowListFiltered.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
        this.alphabeticAsc = true
      }
      this.$refs.alphabetical.classList.add('selected')
      this.$refs.bydate.classList.remove('selected')
      this.airtimeAsc = false
    },
    sortAirtime () {
      if (this.airtimeAsc) {
        this.arcsiShowListFiltered = this.arcsiShowListFiltered
          .sort((a, b) => a.number - b.number)
          .sort((a, b) => new Date(a.play_date) - new Date(b.play_date))
        this.airtimeAsc = false
      } else {
        this.arcsiShowListFiltered = this.arcsiShowListFiltered
          .sort((a, b) => b.number - a.number)
          .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
        this.airtimeAsc = true
      }
      this.$refs.alphabetical.classList.remove('selected')
      this.$refs.bydate.classList.add('selected')
      this.alphabeticAsc = false
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
  @apply py-2 px-4 rounded;
  &.selected, &:hover {
    @apply bg-white bg-opacity-25;
  }
  @media (max-width: $mobile-width) {
    @apply text-sm px-2;
  }
}
</style>
