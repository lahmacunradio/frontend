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
    </header>
    <article id="donate-page" ref="donate">
      <div v-if="donateContent">
        <h2>{{ donateContent.title.rendered }}</h2>
        <div class="donate-content" v-html="donateContentResults" />
      </div>
    </article>
    <article id="projects-page" ref="projects">
      <h2>Projects</h2>
    </article>
    <article id="favourite-page" ref="favourite">
      <h2>Favourite radio stations</h2>
    </article>
  </div>
</template>

<script>
import { donateURL } from '~/constants'

export default {
  data () {
    return {
      donateContent: null
    }
  },
  async fetch () {
    this.donateContent = await fetch(`${donateURL}`)
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  },
  computed: {
    donateContentResults () {
      if (!this.donateContent) {
        return false
      }
      const content = this.donateContent.content.rendered.replace('target="_top"', 'target="_blank"')
      return content
    }
  }
}
</script>

<style lang="scss" scoped>
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
    @apply md:pr-4 mb-4;
    hr {
      margin: 1rem 0;
    }
  }
  #donatepart {
    text-align: center;
    padding: 0 2rem;
    margin-bottom: 1rem;
  }

}
</style>
