<template>
  <div>
    <SubTitle :title="title" />
    <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-8">
      <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
      <p>Loading...</p>
    </div>
    <div v-if="$fetchState.error" class="py-8 text-center">
      Error happened
    </div>
    <div v-else class="container">
      <div v-if="shows?.length" class="pt-8 pb-12" :class="{
        'border-b border-current mb-12': shows?.length
      }">
        <h2 class="mb-4">Shows</h2>
        <div class="grid gap-8 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="show in shows" :key="show.id">
            <div>
              <NuxtLink class="block overflow-hidden aspect-ratio-1/1"
                :to="{ path: `/shows/${show.archive_lahmastore_base_url}` }">
                <img :src="show.cover_image_url" alt="" class="my-2 image-fit">
              </NuxtLink>
              <NuxtLink :to="{ path: `/shows/${show.archive_lahmastore_base_url}` }">
                <h5 class="mt-4">
                  {{ show.name }}
                </h5>
              </NuxtLink>
              <div v-if="show?.tags?.length" class="flex items-center mt-6 tags flex-wrap">
                <div v-for="(show_tag, index) in show.tags" :key="index + show_tag.id + show_tag.clean_name"
                  class="inline-block">
                  <div v-if="show_tag.clean_name.length > 0 && show_tag.clean_name !== tag?.clean_name" class="tag-block">
                    <NuxtLink :to="`/tag/${show_tag.clean_name}`">
                      {{ show_tag.display_name }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="episodes?.length" class="pt-8 pb-12" :class="{
        'border-b border-current mb-12': episodes?.length
      }">
        <h2 class="mb-4">Episodes</h2>
        <div class="grid gap-8 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="episode in episodes" :key="episode.id">
            <div>
              <NuxtLink class="block overflow-hidden aspect-ratio-1/1"
                :to="{ path: `/shows/${episode.shows?.[0]?.archive_lahmastore_base_url}/${episode.name_slug}` }">
                <img :src="episode.image_url" alt="" class="my-2 image-fit">
              </NuxtLink>
              <NuxtLink :to="{ path: `/shows/${episode.shows?.[0]?.archive_lahmastore_base_url}/${episode.name_slug}` }">
                <h5 class="mt-4">
                  {{ episode.name }}
                </h5>
              </NuxtLink>
              <small>Play date: {{ $moment(episode.play_date).format('yyyy. MMMM Do.') }}</small>
              <div v-if="episode?.tags?.length" class="flex items-center mt-6 tags flex-wrap">
                <div v-for="(episode_tag, index) in episode.tags" :key="index + episode_tag.id + episode_tag.clean_name"
                  class="inline-block">
                  <div v-if="episode_tag.clean_name.length > 0 && episode_tag.clean_name !== tag?.clean_name" class="tag-block">
                    <NuxtLink :to="`/tag/${episode_tag.clean_name}`">
                      {{ episode_tag.display_name }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="episodes?.length === 0 && shows?.length === 0" class="py-8">
        <p class="italic text-lg">
          No matching Shows or Episodes found for <b>{{ tag?.display_name }} </b> tag
        </p>
      </div>
      <div class="flex justify-end w-full">
        <NuxtLink :to="{ path: `/tag/` }">
          <h5 class="mt-6">
            Show all tags <i class="fa fa-angle-double-right font-normal"></i>
          </h5>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script>
import { arcsiItemBaseURL, arcsiShowsBaseURL, arcsiTagBaseURL, config } from '~/constants'

export default {
  data() {
    return {
      slug: this.$route.params.slug,
      tag: null,
      episodes: null,
      shows: null
    }
  },
  async fetch() {
    await this.$axios.get(`${arcsiTagBaseURL}/${this.slug}/minimal`, config)
      .then((res) => {
        this.tag = res.data
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Arcsi Tag server not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Arcsi Tag server not available' })
      })
    await this.$axios.get(`${arcsiItemBaseURL}/tag/${this.slug}`, config)
      .then((res) => {
        this.episodes = res.data
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Arcsi Episode server not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Arcsi Episode server not available' })
      })
    await this.$axios.get(`${arcsiShowsBaseURL}/tag/${this.slug}`, config)
      .then((res) => {
        this.shows = res.data
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Arcsi Show server not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Arcsi Show server not available' })
      })

  },
  computed: {
    title() {
      if (this.tag?.display_name) {
        return "TAGGED BY " + this.tag?.display_name
      } else {
        return "Tags"
      }
    },
  }


}
</script>

<style lang="scss" scoped></style>
