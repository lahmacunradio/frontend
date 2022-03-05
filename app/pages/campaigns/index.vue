<template>
  <div>
    <SubTitle title="Lahmacun Campaigns" :maintitle="true" />
    <article class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      <div v-for="(item, index) in campaignsFilteredList" :key="`${item.id}-${index}`">
        <ItemBlock :item="item" />
      </div>
    </article>
  </div>
</template>

<script>
/* Basic list without search or pagination */
import { contentApiURL, campaignBaseURL } from '~/constants'

export default {
  data () {
    return {
      campaignsFilteredList: [],
      numberOfItems: 9,
      totalCount: 0,
      searchText: '',
      isLoading: false,
      page: 1
    }
  },
  head () {
    return {
      title: 'Lahmacun Campaigns',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Lahmacun Campaigns posts'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Campaigns'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Lahmacun Campaigns posts'
        }
      ]
    }
  },
  async mounted () {
    await this.fetchCampaigns()
  },
  beforeDestroy () {
    this.campaignsFilteredList = null
    this.totalCount = null
  },
  methods: {
    async useFetch (url) {
      try {
        const response = await this.$axios.get(`${url}`)
        return response
      } catch (error) {
        this.$sentry.captureException(new Error('Campaigns is not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Campaigns is not available' })
      }
    },
    async getImage (idCampaigns) {
      const { data } = await this.useFetch(`${contentApiURL}/media/${idCampaigns}`)
      return data?.media_details?.sizes?.large?.source_url || data?.source_url
    },
    async parseData (campaigns) {
      return await Promise.all(campaigns.map(async n => ({
        title: this.htmlDecoder(n.title.rendered),
        url: `/campaigns/${n.slug}`,
        image: await this.getImage(n.featured_media),
        description: this.truncate(n.excerpt.rendered, 150)
      })))
    },
    async fetchCampaigns () {
      this.isLoading = true
      const response = await this.useFetch(campaignBaseURL)
      this.campaignsFilteredList = [...this.campaignsFilteredList, ...(await this.parseData(response.data))]
      this.totalCount = parseInt(response.headers['x-wp-total'])
      this.page++
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  padding: 2rem 0 2rem 0;
}
.campaigns-block {
  max-width: 100%;
}
.input {
  display: block;
  width: 350px;
  @media (max-width: $mobile-width) {
    width: 100%;
  }
  height: 30px;
  border-radius: 0.25rem;
  outline: none;
  padding: 0 10px;
}
</style>
