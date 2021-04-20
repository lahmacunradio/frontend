<template>
  <div>
    <div class="m-4 text-center title">
      <h1>Lahmacun Shows</h1>
    </div>
    <!-- Make a listing component -->
    <div class="container grid grid-cols-4 gap-8">
      <div v-for="show in arcsiShowsList" :key="show.id" class="max-w-sm overflow-hidden bg-white rounded shadow-lg cursor-pointer">
        <NuxtLink :to="'/shows/' + show.archive_lahmastore_base_url">
          <div class="show-image">
            <img
              class="w-full"
              :src="show.cover_image_url"
              :alt="show.name"
            >
          </div>
          <div class="px-6 py-4">
            <div class="mb-2 text-xl font-bold">
              {{ show.name }}
            </div>
            <div class="showdescription">
              {{ truncate(show.description, 300) }}
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>

import { mediaServerURL } from '~/constants'

export default {
  components: {
  },

  data () {
    return {

      mediaServerURL

    }
  },

  computed: {
    arcsishows () {
      return this.$store.state.arcsiShows
    },
    // ++ TODO filter Active and Past Shows
    arcsiShowsList () {
      if (this.arcsishows) {
        return [...this.arcsishows].sort((a, b) => a.name.localeCompare(b.name))
      }
      return null
    }
  },
  mounted () {
    // console.log(this.arcsiShows)
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.show-image {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  align-content: center;
  img {
    min-height: 300px;
    min-width: 300px;
    object-fit: cover;
  }
}
</style>
