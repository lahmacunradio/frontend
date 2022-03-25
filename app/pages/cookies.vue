<template>
  <div>
    <SubTitle title="Lahmacun radio - Cookies" :maintitle="true" />
    <div class="container my-8">
      <div v-if="$fetchState.pending" class="center">
        Loading...
      </div>
      <article id="cookies-page" ref="cookies">
        <div v-if="cookiesContent">
          <h2>{{ cookiesContent.title.rendered }}</h2>
          <span v-sanitize.nothing="cookiesContentResults" />
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { cookiesPageURL } from '~/constants'

export default {
  data () {
    return {
      cookiesContent: null,
    }
  },
  async fetch () {
    this.cookiesContent = await this.$axios.get(`${cookiesPageURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Cookies page info not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Cookies page info not available' })
      })
  },
  head () {
    return {
      title: 'Lahmacun radio - Cookies',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Lahmacun radio - Cookie policy'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun radio - Cookies'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Lahmacun radio - Cookie policy'
        }
      ]
    }
  },
  computed: {
    cookiesContentResults () {
      if (!this.cookiesContent?.content?.rendered) {
        return 'No content'
      }
      return this.cookiesContent?.content?.rendered.replace(/target="_top"/g, 'target="_blank"')
    }
  }
}
</script>

<style lang="scss">
p, div.CookieDeclarationType {
    margin-bottom: 30px;
}
thead th {
    background-color: rgba(88, 88, 88, 0.2);
    text-transform: uppercase;
}
th {
    text-align: left;
}
td {
    border-bottom: 1px solid black;
    width: auto;
}
</style>