<template>
  <div class="container">
    <header>
      <h1>Lahmacun Community</h1>
      <nav class="py-4">
        <ul class="comunity-navigation">
          <li>
            <a href="#" @click.prevent="scrollToRef('donate')">
              Donate
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToRef('projects')">
              Radio projects
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToRef('favourite')">
              Favourite radios
            </a>
          </li>
        </ul>
      </nav>
      <div v-if="$fetchState.pending" class="center">
        Loading...
      </div>
    </header>
    <article id="donate-page" ref="donate">
      <div v-if="donateContent">
        <h2>{{ donateContent.title.rendered }}</h2>
        <div v-sanitize="donateContentResults" class="donate-content" />
      </div>
    </article>
    <article id="projects-page" ref="projects">
      <h2>Projects</h2>
      <div class="projects-content">
        Our projects, coming soon...
      </div>
    </article>
    <article id="favourite-page" ref="favourite">
      <h2>Favourite radio stations</h2>
      <div v-sanitize="favouritesContentResults" class="favourite-radios-content" />
    </article>
  </div>
</template>

<script>
import { donateURL, favouriteRadiosURL } from '~/constants'

export default {
  data () {
    return {
      donateContent: null,
      favouritesContent: null
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
        console.error('Error:', error)
      })
    this.favouritesContent = await this.$axios.get(`${favouriteRadiosURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  },
  computed: {
    donateContentResults () {
      if (!this.donateContent) {
        return 'No content'
      }
      const content = this.donateContent.content.rendered.replace('target="_top"', 'target="_blank"')
      return content
    },
    favouritesContentResults () {
      if (!this.favouritesContent) {
        return 'No content'
      }
      const content = this.favouritesContent.content.rendered
      return content
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  padding-top: 1rem;
  margin-bottom: 1rem;
}
article {
  margin-bottom: 2rem;
}

.comunity-navigation {
  li {
    display: inline-block;
    &:after {
      content: ' | ';
      margin: 0 0.5rem;
    }
    &:last-child:after {
      display: none;
    }
  }
}

</style>

<style lang="scss">
.donate-content {
  @apply md:flex;
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
#favourite-page .favourite-radios-content {
  table {
    overflow: auto;
    display: block;
  }
  td {
    padding: 0.25rem 1rem 0.25rem 0;
    &:first-child {
      width: 25%;
    }
    a {
      white-space: nowrap;
    }
  }
}
</style>
