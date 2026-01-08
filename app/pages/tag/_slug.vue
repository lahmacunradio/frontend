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
      <div v-if="tags?.shows?.length" class="pt-8 pb-12" :class="{
        'border-b border-current mb-12': tags?.items?.length
      }">
        <h2 class="mb-4">Shows</h2>
        <div class="grid gap-8 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="show in tags?.shows" :key="show.id">
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
                <div v-for="(tag, index) in show.tags" :key="index + tag.id + tag.clean_name" class="inline-block">
                  <div v-if="tag.clean_name.length > 0 && tag.clean_name !== tags?.clean_name" class="tag-block">
                    <NuxtLink :to="`/tag/${tag.clean_name}`">
                      {{ tag.display_name }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tags?.items?.length" class="">
        <h2 class="mb-4">Episodes</h2>
        <div class="grid gap-8 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="arcsi in tags?.items" :key="arcsi.id">
            <div>
              <NuxtLink class="block overflow-hidden aspect-ratio-1/1"
                :to="{ path: `/shows/${arcsi.shows?.[0]?.archive_lahmastore_base_url}/${arcsi.name_slug}` }">
                <img :src="arcsi.image_url" alt="" class="my-2 image-fit">
              </NuxtLink>
              <NuxtLink :to="{ path: `/shows/${arcsi.shows?.[0]?.archive_lahmastore_base_url}/${arcsi.name_slug}` }">
                <h5 class="mt-4">
                  {{ arcsi.name }}
                </h5>
              </NuxtLink>
              <small>Play date: {{ $moment(arcsi.play_date).format('yyyy. MMMM Do.') }}</small>
              <div v-if="arcsi?.tags?.length" class="flex items-center mt-6 tags flex-wrap">
                <div v-for="(tag, index) in arcsi.tags" :key="index + tag.id + tag.clean_name" class="inline-block">
                  <div v-if="tag.clean_name.length > 0 && tag.clean_name !== tags?.clean_name" class="tag-block">
                    <NuxtLink :to="`/tag/${tag.clean_name}`">
                      {{ tag.display_name }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tags?.items?.length === 0 && tags?.shows?.length === 0" class="py-8">
        <p class="italic text-lg">
          No matching Shows or Episodes found for <b>{{ tags?.display_name }} </b> tag
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
import { arcsiBaseURL, mediaServerURL, config } from '~/constants'

export default {
  data() {
    return {
      mediaServerURL,
      slug: this.$route.params.slug,
      tags: null
    }
  },
  async fetch() {
    //Fetch show data
    await this.$axios.get(arcsiBaseURL + '/tag/' + this.slug, config)
      .then((res) => {
        this.tags = res.data
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Arcsi server not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Arcsi server not available' })
      })

  },
  computed: {
    title() {
      if (this.tags?.display_name) {
        return "TAGGED BY " + this.tags?.display_name
      } else {
        return "Tags"
      }
    },
  }


}
</script>

<style lang="scss" scoped></style>
