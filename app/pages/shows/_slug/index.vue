<template>
  <div>
    <SubTitle title="Lahmacun Shows" url="/shows/" />
    <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-8">
      <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
      <p>Loading...</p>
    </div>
    <div v-if="$fetchState.error" class="py-8 text-center">
      Error happened
    </div>
    <div v-if="showObject" class="container mt-10">
      <div class="flex-row sm:flex">
        <div class="mb-4 sm:w-128 xsm:mr-8 show-image">
          <a class="cursor-pointer" @click="shadowbox = !shadowbox">
            <img :src="showImage" :alt="showObject.name">
            <Modal
              :media="showImage"
              :title="showObject.name"
              :description="showObject.description"
              :visibility="shadowbox"
            />
          </a>
          <div v-if="episodeTags?.length" class="flex items-center mt-6 tags flex-wrap">
      <div v-for="(tag, index) in episodeTags" :key="index + tag.id + tag.slug" class="inline-block">
        <NuxtLink :to="`/archive/tags/${tag.clean_name}`" class="tag-block">
          {{ tag.display_name }}
        </NuxtLink>
      </div>
    </div>
        </div>
        <div class="mb-4 show-description">
          <h1 class="mt-0 font-bold h2">
            {{ showObject.name }}
          </h1>
          <div v-if="showObject.active" class="show-infos">
            <p>
              {{ dayNames[showObject.day - 1] }} {{
                removeSeconds(showObject.start)
              }}–{{ removeSeconds(showObject.end) }}
            </p>
            <p>
              {{ showFrequency(showObject.frequency, showObject.week, showObject.playlist_name) }}
            </p>
            <p>
              Language: <span v-sanitize.nothing="getLanguageGraph(showObject.language)" class="language"/>
            </p>
            <p v-if="showObject.archive_mixcloud_base_url">
              Elsewhere on web:
              <!-- Quick fix: we (mis)use Mixcloud links (originally meant for another upload platform) as arbitrary external link. -->
              <!-- Note: link needs to be full path and it will be displayed! -->
              <a class="show-external-link" :href="showObject.archive_mixcloud_base_url" target="_blank">
                {{ showObject.archive_mixcloud_base_url }}
              </a>
            </p>
          </div>
          <!-- Inactive shows: currently hard-coded for more flexibility and readability -->
          <div v-else class="show-infos">
            <p>
              <strong>Show is not active</strong>
            </p>
            <p>
              Language: <span v-sanitize.nothing="getLanguageGraph(showObject.language)" class="language"/>
            </p>
            <p v-if="showObject.archive_mixcloud_base_url">
              Elsewhere on web:
              <!-- Quick fix: we (mis)use Mixcloud links (originally meant for another upload platform) as arbitrary external link. -->
              <!-- Note: link needs to be full path and it will be displayed! -->
              <a class="show-external-link" :href="showObject.archive_mixcloud_base_url" target="_blank">
                {{ showObject.archive_mixcloud_base_url }}
              </a>
            </p>
          </div>
          <div v-sanitize="[ sanitizeOptions, showObject.description ]" class="description-text" />
        </div>
      </div>
      <div v-if="arcsiEpisodesList && arcsiEpisodesList.length">
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
          <div v-for="arcsi in arcsiEpisodesList" :key="arcsi.id">
            <div>
              <NuxtLink
                class="block overflow-hidden aspect-ratio-1/1"
                :to="{ path: `/shows/${slug}/${arcsi.name_slug}` }"
              >
                <img :src="mediaServerURL + slug + '/' + arcsi.image_url" alt="" class="my-2 image-fit">
              </NuxtLink>
              <NuxtLink :to="{ path: `/shows/${slug}/${arcsi.name_slug}` }">
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
import { arcsiBaseURL, mediaServerURL, config } from '~/constants'

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
      showObject: null,
      sortingType: 'air',
      alphabeticAsc: false,
      airtimeAsc: true
    }
  },
  async fetch () {
    this.showObject = await this.$axios.get(arcsiBaseURL + '/show/' + this.slug + '/page?filter=archived', config)
      .then(res => res.data)
      .catch((error) => {
        this.$nuxt.error({ statusCode: 404, message: 'Show page not found' + error })
      })
  },
  head () {
    return {
      title: this.showObject?.name,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.metaDescription
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.showObject?.name
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.metaDescription
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.showImage
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

    arcsiEpisodesList () {
      if (this.showObject?.items) {
        const itemsSorted = this.showObject.items
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
    },
    showImage () {
      const rootLink = mediaServerURL + this.slug + '/'
      return rootLink + this.showObject?.cover_image_url
    },
    metaDescription () {
      if (!this.showObject?.description) {
        return ''
      }
      return this.truncate(this.showObject?.description, 150)
    },
    episodeTags () {
      if (!this.showObject.tags) {
        return false
      }
      return this.showObject.tags.filter(tag => tag.display_name.length > 0)
    }
  },
  methods: {
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

.show-external-link {
  text-decoration: underline;
}

.show-image {
    min-width: 300px;
    max-width: 360px;
}
.show-infos {
  margin-bottom: 1rem;
  font-style: italic;
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
