<template>
  <div class="container">
    <NuxtLink :to="`/shows/${slug}`">
      <div class="pb-4">
        <i class="fa fa-toggle-left" aria-hidden="true" /> Back to Show
      </div>
    </NuxtLink>
    <div class="flex-row sm:flex">
      <div class="mb-4 sm:w-128 xsm:mr-4 show-image">
        <a class="cursor-pointer" @click="arcsiItemShadowbox = !arcsiItemShadowbox">
          <img :src="arcsiEpisode.image_url" alt="" class="rounded-md">
          <Modal :media="arcsiEpisode.image_url" :title="arcsiEpisode.name" :description="arcsiEpisode.description" :visibility="arcsiItemShadowbox" />
        </a>
      </div>
      <div class="mb-4 show-description">
        <h3>{{ arcsiEpisode.name }}</h3>
        <div>{{ arcsiEpisode.description }}</div>
        <div class="py-4">
          <div v-if="arcsiCurrentEpisode.id === arcsiEpisode.id">
            <i>Episode is now in the Arcsi player...</i>
          </div>
          <div v-else>
            <a href="#" @click.prevent="playArcsi()">
              <i class="fa fa-play" aria-hidden="true" /> Play {{ fullEpisodeTitle }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { arcsiItemBaseURL } from '~/constants'

export default {
  components: {
  },
  data () {
    return {
      arcsiItemShadowbox: false,
      slug: this.$route.params.slug,
      id: this.$route.params.id,
      arcsiEpisode: {},
      playEpisode: false
    }
  },
  async fetch () {
    this.arcsiEpisode = await this.$axios.get(`${arcsiItemBaseURL}/${this.id}`)
      .then(res => res.data)
  },
  head () {
    return {
      title: this.fullEpisodeTitle
    }
  },
  computed: {
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
    }
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
</style>
