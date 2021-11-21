<template>
  <div>
    <h3 class="title-block">
      Lahmacun News
    </h3>
    <section class="container mt-8">
      <header class="mb-8">
        <h1>News tags</h1>
      </header>
      <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-4">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2">
        <p>Loading...</p>
      </div>
      <div v-if="$fetchState.error" class="py-8 text-center">
        Error happened
      </div>
      <div v-if="allTagsList.length" class="tags mb-8">
        <div v-for="(tag, index) in allTagsList" :key="index + tag.id" class="inline-block">
          <NuxtLink :to="`/news/tags/${tag.slug}`" class="tag-block">
            {{ tag.name }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { newsBaseURL, tagsURL } from '~/constants'

export default {
  data () {
    return {
      recentNews: null,
      allTagsList: []
    }
  },
  async fetch () {
    this.recentNews = await this.$axios.get(`${newsBaseURL}&per_page=100`)
      .then(res => res.data)
      .catch((error) => {
        console.log(error)
        this.$sentry.captureException(new Error('New not found ', error))
        this.$nuxt.error({ statusCode: 500, message: 'News not found' })
      })
    if (this.allTags) {
      this.allTagsList = await this.$axios.get(`${tagsURL}?include=${this.allTags.toString()}&per_page=100`)
        .then(res => res.data)
        .catch((error) => {
          console.log(error)
          this.$sentry.captureException(new Error('Tags not found ', error))
          this.$nuxt.error({ statusCode: 500, message: 'Tags not found' })
        })
    }
  },
  head () {
    return {
      title: 'Lahmacun News Tags',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Post tags for Lahmacun News'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun News Tags'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Post tags for Lahmacun News'
        }
      ]
    }
  },
  computed: {
    allTags () {
      if (!this.recentNews) {
        return false
      }
      const hasTags = this.recentNews.filter((item) => {
        return item.tags.length
      })
      return [...new Set(hasTags.flatMap(item => item.tags))]
    }
  }
}
</script>
