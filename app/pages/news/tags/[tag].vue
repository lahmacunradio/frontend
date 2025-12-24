<template>
  <div>
    <SubTitle title="Lahmacun News Tags" url="/news/tags" />
    <div class="container mt-8">
      <header class="mb-8">
        <h2>News tagged with "{{ tag }}"</h2>
      </header>
      <section class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <div v-for="tag in tagsPosts" :key="tag.id" class="">
          <NewsBlock :news="tag" />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { contentApiURL, tagsURL } from '~/constants'

export default {
  data () {
    return {
      tag: null,
      tagsPosts: null
    }
  },
  async mounted () {
    this.tag = this.$route.params.tag

    useHead({
      title: `Lahmacun News Tag: ${this.tag}`,
      meta: [
        {
          name: 'description',
          content: `Post Tagged with ${this.tag}`
        },
        {
          property: 'og:title',
          content: `Lahmacun News Tag: ${this.tag}`
        },
        {
          property: 'og:description',
          content: `Post Tagged with ${this.tag}`
        }
      ]
    })

    try {
      const tagResponse = await this.$axios.get(`${tagsURL}?slug=${this.tag}`)
      const tagId = tagResponse.data[0]?.id

      if (!tagId) {
        throw new Error('Tag not found')
      }

      const postsResponse = await this.$axios.get(`${contentApiURL}/posts?tags=${tagId}&per_page=100`)
      this.tagsPosts = postsResponse.data
    } catch (error) {
      this.$sentry?.captureException(new Error('No tags ', error))
      this.$nuxt?.error({ statusCode: 404, message: 'No tags' })
    }
  },
  beforeUnmount () {
    this.tagsPosts = null
  }
}
</script>
