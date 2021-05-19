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
      <div class="mb-4">
        <h3>{{ arcsiEpisode.name }}</h3>
        <div>{{ arcsiEpisode.description }}</div>
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
      arcsiEpisode: {}
    }
  },
  async fetch () {
    this.arcsiEpisode = await fetch(`${arcsiItemBaseURL}/${this.id}`)
      .then(res => res.json())
  },
  head () {
    return {
      title: this.arcsiEpisode.name
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
