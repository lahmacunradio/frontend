<template>
  <div>
    <SubTitle title="All Lahmacun Tags" />
    <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-8">
      <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
      <p>Loading...</p>
    </div>
    <div v-if="$fetchState.error" class="py-8 text-center">
      Error happened
    </div>
    <div class="container">
      <div v-if="tags?.length" class="flex items-center mt-6 tags flex-wrap">
        <div v-for="(tag, index) in tags" :key="index + tag.id + tag.clean_name" class="inline-block">
          <div class="tag-block">
            <NuxtLink :to="`/archive/tags/${tag.clean_name}`">
              {{ tag.display_name }}
            </NuxtLink>
          </div>
        </div>
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
      tags: []
    }
  },
  async fetch() {
    //Fetch Tag data
    await this.$axios.get(arcsiBaseURL + '/tag/all', config)
      .then((res) => {
        console.log(res.data)
        this.tags = res.data
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Arcsi server not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Arcsi server not available' })
      })

  },

}
</script>

<style scoped></style>
