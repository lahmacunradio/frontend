<template>
  <div>
    <h3 class="title-block">
      Lahmacun Donate
    </h3>
    <div class="container my-8">
      <div v-if="$fetchState.pending" class="center">
        Loading...
      </div>
      <article id="donate-page" ref="donate">
        <div v-if="donateContent">
          <h2>{{ donateContent.title.rendered }}</h2>
          <div v-sanitize="[sanitizeOptions, donateContentResults]" class="donate-content" />
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { donateURL } from '~/constants'

export default {
  data () {
    return {
      donateContent: null,
      sanitizeOptions: {
        allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br'],
        allowedAttributes: {
          img: ['*'],
          div: ['style', 'class', 'id'],
          form: ['*'],
          input: ['*']
        }
      }
    }
  },
  async fetch () {
    this.donateContent = await this.$axios.get(`${donateURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        console.log(error)
        this.$nuxt.error({ statusCode: 500, message: 'Donate not available' })
      })
  },
  head () {
    return {
      title: 'Lahmacun Donate',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'This is a not-for-profit webradio with various starting and running costs. Without financial help we won’t be able to provide quality content for long.'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Donate'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'This is a not-for-profit webradio with various starting and running costs. Without financial help we won’t be able to provide quality content for long.'
        }
      ]
    }
  },
  computed: {
    donateContentResults () {
      if (!this.donateContent) {
        return 'No content'
      }
      return this.donateContent.content.rendered.replaceAll('target="_top"', 'target="_blank"')
    }
  }
}
</script>

<style lang="scss">
.donate-content {
  @apply md:flex items-start;
  #donatetext {
    @apply md:pr-16 mb-12;
    hr {
      margin: 1rem 0;
    }
  }
  #donatepart {
    text-align: center;
    padding: 1rem 2rem 2rem;
    margin-bottom: 1rem;
    background: white;
    box-shadow: 0px 0px 12px #23282d;
    border-radius: 3px;
    h4 {
      margin-bottom: 1rem;
      font-size: 1.2rem;
      white-space: nowrap;
      text-transform: uppercase;
    }
  }
}
</style>
