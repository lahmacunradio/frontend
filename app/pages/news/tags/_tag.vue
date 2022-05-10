<template>
  <div>
    <SubTitle title="Lahmacun News Tags" url="/news/tags" />
    <div class="container mt-8">
      <header class="mb-8">
        <h2>News tagged with "{{ tag }}"</h2>
      </header>
      <ItemList
        :items="news"
        :isLoading="isLoading"
      />
      <Pagination
        :itemsCount="news.length"
        :totalCount="totalCount"
        :isLoading="isLoading"
        @click="getNews"
      />
    </div>
  </div>
</template>

<script>
import { contentApiURL, tagsURL } from '~/constants'

export default {
  data () {
    return {
      tag: this.$route.params.tag,
      idTag: this.$route.query.id,
      tagsPosts: null,
      isLoading: false,
      news: [],
      numberOfItems: 9,
      totalCount: 0,
      page: 1
    }
  },
  computed: {
    newsUrl () {
      return `${contentApiURL}/posts?tags=${this.idTag}&per_page=${this.numberOfItems}&page=${this.page}`
    }
  },
  async mounted () {
    await this.getNews()
  },
  methods: {
    async useFetch (url) {
      try{
        const data = await this.$axios.get(url)
        return data
      } catch (error) {
        this.$sentry.captureException(new Error('No tags ', error))
        this.$nuxt.error({ statusCode: 404, message: 'No tags' })
      }
    },
    async getImage(idNews) {
      const { data } = await this.useFetch(`${contentApiURL}/media/${idNews}`)
      return data?.media_details?.sizes?.large?.source_url || data?.source_url
    },
    async getTags(idNews) {
      const { data } = await this.useFetch(`${tagsURL}?include=${idNews}`)
      return data.map(tag => ({ ...tag, link: `/news/tags/${tag.slug}` }))
    },
    async parseNews (news) {
      return await Promise.all (news.map( async news => ({
        title: news.title.rendered,
        url: `/news/${news.slug}`,
        image: await this.getImage(news.featured_media),
        description: this.truncate(news.excerpt.rendered, 150),
        tags: news.tags.length ? await this.getTags(news.tags) : null
      })))
    },
    async getNews () {
      this.isLoading = true
      const data = await this.useFetch(this.newsUrl)
      this.news = [...this.news, ...(await this.parseNews(data.data))]
      this.totalCount = parseInt(data.headers['x-wp-total'])
      this.page++
      this.isLoading = false
    },
  },
  head () {
    return {
      title: `Lahmacun News Tag: ${this.tag}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Post Tagged with ${this.tag}`
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Lahmacun News Tag: ${this.tag}`
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: `Post Tagged with ${this.tag}`
        }
      ]
    }
  }
}
</script>
