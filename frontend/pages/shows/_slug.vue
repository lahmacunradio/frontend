<template>
  <div class="container">
    <div class="flex-row sm:flex">
      <div class="mb-4 sm:w-128 xsm:mr-4 show-image">
        <a class="cursor-pointer" @click="shadowbox = !shadowbox">
          <img :src="arcsiInfosBlock.cover_image_url" alt="" class="rounded-md">
          <vue-shadow-box :media="[{ src: arcsiInfosBlock.cover_image_url, description: arcsiInfosBlock.name }]" :visibility="shadowbox" />
        </a>
      </div>
      <div class="mb-4">
        <h3>{{ arcsiInfosBlock.name }}</h3>
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
            <img :src="mediaServerURL + slug + '/' + arcsi.image_url" alt="" class="my-2 rounded-md">
            <h5>
              {{ arcsi.name }}
            </h5>
            <small>Play date: {{ format(new Date(arcsi.play_date), 'yyyy. MMMM dd.') }}</small>
            <p>{{ arcsi.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueShadowBox from 'vue-shadowbox'
import {format} from 'date-fns'
import {mediaServerURL} from '~/constants'

export default {
  components: {
    VueShadowBox
  },

  data () {
    return {
      shadowbox: false,
      slug: this.$route.params.slug,
      mediaServerURL,
      format
    }
  },
  head () {
    return {
      title: this.arcsiInfosBlock.name
    }
  },
  computed: {
    arcsiShows() {
      return this.$store.state.arcsiShows
    },
    arcsiInfosBlock () {
      if (this.arcsiShows) {
        const allShows = [...this.arcsiShows]
        return allShows.filter(show => show.archive_lahmastore_base_url === this.$route.params.slug).shift()
      }
      return null
    },
    arcsiShowsList () {
      if (this.arcsiShows) {
        const showslist = [...this.arcsiInfosBlock.items]
        return showslist.sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
      }
      return null
    }
  }
}
</script>

<style scoped>
  .show-image {
      min-width: 300px;
      max-width: 360px;
  }
</style>
