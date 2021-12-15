<template>
  <div>
    <h2 class="title-block">
      Lahmacun Impressum
    </h2>
    <div id="about-page-content" class="container mt-8">
      <div v-if="$fetchState.pending" class="py-8 center w-100">
        Loading...
      </div>
      <div v-if="$fetchState.error" class="py-8 center w-100">
        Some error happened...
      </div>
      <div v-if="impressum">
        <div v-sanitize="[ sanitizeOptions, impressumResults]" />
      </div>
    </div>
  </div>
</template>

<script>
import { impressumURL } from '~/constants'

export default {
  components: {
  },
  data () {
    return {
      impressum: null,
      sanitizeOptions: {
        allowedTags: ['b', 'i', 'em', 'strong', 'img', 'figcaption', 'p'],
        allowedAttributes: {
          img: ['src', 'srcset']
        }
      }
    }
  },
  async fetch () {
    this.impressum = await this.$axios.get(`${impressumURL}`)
      .then(res => res.data)
      .catch((error) => {
        console.log(error)
        this.$nuxt.error({ statusCode: 500, message: 'About page not available' })
      })
  },
  head () {
    return {
      title: 'Lahmacun Impressum',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Read about Lahmacun '
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Impressum'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Read about Lahmacun'
        }
      ]
    }
  },
  computed: {
    impressumResults () {
      if (!this.impressum) {
        return false
      }
      return this.impressum.content.rendered
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 1rem;
  line-height: 3;
}
</style>

<style lang="scss">
#about-page-content {
  p {
    margin: 0 0 1rem;
    line-height: 1.6em;
  }
  img {
    width: 100%;
  }
}
</style>
