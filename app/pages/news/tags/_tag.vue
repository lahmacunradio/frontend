<template>
  <div>
    <h3 class="title-block">
      Lahmacun News Tags
    </h3>
    <div class="container mt-8">
      <header class="mb-8">
        <h1>News tagged with "{{ tag }}"</h1>
      </header>
      <section class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <div v-for="tag in tagsPosts" :key="tag.id" class="">
          <NewsBlock :news="tag"/>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import {contentApiURL, tagsURL} from '~/constants'

export default {
  data() {
    return {
      tag: this.$route.params.tag,
      tagsPosts: null
    }
  },
  async fetch() {
    const tagId = await this.$axios.get(`${tagsURL}?slug=${this.tag}`)
      .then(res => res.data[0].id)
      .catch((error) => {
        console.log(error)
        this.$nuxt.error({statusCode: 500, message: 'Tags not found'})
      })
    this.tagsPosts = await this.$axios.get(`${contentApiURL}/posts?tags=${tagId}&per_page=100`)
      .then(res => res.data)
      .catch((error) => {
        console.log(error)
        this.$nuxt.error({statusCode: 500, message: 'Tags not found'})
      })
  }
}
</script>
