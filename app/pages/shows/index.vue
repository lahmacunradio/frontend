<template>
  <div>
    <SubTitle title="Lahmacun Shows" />
    <div class="container mt-8">
      <div v-if="defaultArcsiShows" class="mb-8">
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
      <div v-if="arcsiShowsList && arcsiShowsList.length">
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
      <div v-if="pastShowsList && pastShowsList.length">
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
import { mapGetters } from 'vuex'

import { mediaServerURL } from '~/constants'


export default {
  data () {
    return {
      mediaServerURL,
      arcsiShows: null,
      defaultArcsiShows: null,
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
    ...mapGetters({
      fullSchedule: 'returnArcsiShows'
    }),
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
  mounted () {
    if (this.fullSchedule) {
      this.arcsiShows = [...this.fullSchedule]
      this.defaultArcsiShows = [...this.fullSchedule]
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
