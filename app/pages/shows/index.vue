<template>
  <div>
    <h2 class="title-block">
      Lahmacun Shows
    </h2>
    <div class="container mt-8">
      <div class="mb-8">
        <AutoCompleteSearch
          :default-items="defaultArcsiShows"
          suggestion-attribute="name"
          :search-fields="searchFields"
          place-holder="Search"
          @update="onUpdate"
        />
      </div>
      <!-- Make a listing component -->
      <div class="mt-8 mb-4 title">
        <h2>Active Shows</h2>
      </div>
      <div v-if="arcsiShowsList.length">
        <ShowsLister :shows="arcsiShowsList" />
      </div>
      <div v-else>
        <p class="italic">
          No matching Shows found
        </p>
      </div>
      <div class="mt-8 mb-4 title">
        <h2>Past Shows</h2>
      </div>
      <div v-if="pastShowsList.length">
        <ShowsLister :shows="pastShowsList" />
      </div>
      <div v-else>
        <p class="italic">
          No matching Shows found
        </p>
      </div>
    </div>
  </div>
</template>

<script>

import { mediaServerURL } from '~/constants'

export default {
  components: {},

  data () {
    return {
      mediaServerURL,
      defaultArcsiShows: this.$store.state.arcsiShows,
      arcsiShows: this.$store.state.arcsiShows,
      searchFields: ['name', 'description']
    }
  },
  head () {
    return {
      title: 'Lahmacun Shows',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'All Lahmacun Shows, active and past'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Shows'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'All Lahmacun Shows, active and past'
        }
      ]
    }
  },
  computed: {
    arcsiShowsList () {
      if (this.arcsiShows) {
        return this.arcsiShows.filter(show => (
          !(show.archive_lahmastore_base_url === 'off-air' || !show.active)
        )).sort((a, b) => a.name.localeCompare(b.name))
      }
      return null
    },
    pastShowsList () {
      if (this.arcsiShows) {
        return this.arcsiShows.filter(show => !show.active)
          .sort((a, b) => a.name.localeCompare(b.name))
      }
      return null
    }
  },
  beforeDestroy () {
    this.defaultArcsiShows = null
    this.arcsiShows = null
  },
  methods: {
    onUpdate (result) {
      this.arcsiShows = result
    }
  }
}
</script>
