<template>
  <div>
    <SubTitle title="Lahmacun membership" :maintitle="true" />
    <div class="container my-8">
      <div v-if="$fetchState.pending" class="center">
        Loading...
      </div>
      <article id="membership-page" ref="membership">
        <div v-if="membershipContent">
          <h2>{{ membershipContent.title.rendered }}</h2>
          <div v-sanitize="[sanitizeOptions, membershipContentResults]" class="donate-content" />
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { membershipURL } from '~/constants'

export default {
  data () {
    return {
      membershipContent: null,
      sanitizeOptions: {
        allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br'],
        allowedAttributes: {
          a: ['*'],
          img: ['*'],
          div: ['style', 'class', 'id'],
          form: ['*'],
          input: ['*']
        }
      }
    }
  },
  async fetch () {
    this.membershipContent = await this.$axios.get(`${membershipURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Membership not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Membership not available' })
      })
  },
  head () {
    return {
      title: 'Lahmacun Membership',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'We have a monthly membership fee. We will use this money for monthy costs and development (e.g.buy new studio gear).'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun membership'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'We have a monthly membership fee. We will use this money for monthy costs and development (e.g.buy new studio gear).'
        }
      ]
    }
  },
  computed: {
    membershipContentResults () {
      if (!this.membershipContent?.content?.rendered) {
        return 'No content'
      }
      return this.membershipContent?.content?.rendered.replace(/target="_top"/g, 'target="_blank"')
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
      text-transform: uppercase;
    }
  }
}
</style>
