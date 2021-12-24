<template>
  <div>
    <h2 class="title-block">
      Lahmacun Community
    </h2>
    <div>
      <nav class="pt-8 px-4">
        <ul class="text-center comunity-navigation">
          <li>
            <a href="#" @click.prevent="scrollToRef('call')">
              Call
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToRef('base')">
              Base
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToRef('events')">
              Events
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToRef('community')">
              Community
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToRef('press')">
              Press
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToRef('labs')">
              Labs
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToRef('recipe')">
              Recipe
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToRef('favourite')">
              Favourites
            </a>
          </li>
        </ul>
      </nav>
      <div class="italic text-center my-8 px-4">
        <h4>Lahmacun.hu is an online music & more radio from Budapest since 2018</h4>
      </div>
      <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-8">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
        <p>Loading...</p>
      </div>
      <div id="community-content" class="container">
        <article id="call-page" ref="call">
          <div v-if="callForShows">
            <h2>{{ htmlDecoder(callForShows.title.rendered) }}</h2>
            <div v-sanitize="[sanitizeOptions, callForShowsResults]" class="community-page-content" />
          </div>
        </article>
        <article id="base-page" ref="base">
          <div v-if="lahmaBase">
            <h2>{{ htmlDecoder(lahmaBase.title.rendered) }}</h2>
            <div class="md:flex">
              <div v-if="lahmaBaseFeaturedImage" class="md:mr-8 mb-4 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
                <img :src="lahmaBaseFeaturedImage.source_url" :alt="htmlDecoder(lahmaBase.title.rendered)">
              </div>
              <div v-sanitize="[sanitizeOptions, lahmaBaseResults]" class="community-page-content" />
            </div>
          </div>
        </article>
        <article id="community-page" ref="community">
          <div v-if="communitySection">
            <h2>{{ htmlDecoder(communitySection.title.rendered) }}</h2>
            <div class="md:flex">
              <div v-if="communityFeaturedImage" class="md:mr-8 mb-4 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
                <img :src="communityFeaturedImage.source_url" :alt="htmlDecoder(communitySection.title.rendered)">
              </div>
              <div v-sanitize="[sanitizeOptions, communityResults]" class="community-page-content" />
            </div>
          </div>
        </article>
        <article id="events-page" ref="events">
          <div v-if="eventsSection">
            <h2>{{ htmlDecoder(eventsSection.title.rendered) }}</h2>
            <div class="md:flex">
              <div v-if="eventsFeaturedImage" class="md:mr-8 mb-4 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
                <img :src="eventsFeaturedImage.source_url" :alt="htmlDecoder(eventsSection.title.rendered)">
              </div>
              <div v-sanitize="[sanitizeOptions, eventsSectionResults]" class="community-page-content" />
            </div>
          </div>
        </article>
        <article id="press-page" ref="press">
          <div v-if="pressSection">
            <h2>{{ htmlDecoder(pressSection.title.rendered) }}</h2>
            <div class="md:flex">
              <div v-if="pressFeaturedImage" class="md:mr-8 mb-4 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
                <img :src="pressFeaturedImage.source_url" :alt="htmlDecoder(pressSection.title.rendered)">
              </div>
              <div v-sanitize="[sanitizeOptions, pressSectionResults]" class="community-page-content" />
            </div>
          </div>
        </article>
        <article id="labs-page" ref="labs">
          <div v-if="labsSection">
            <h2>{{ htmlDecoder(labsSection.title.rendered) }}</h2>
            <div class="md:flex">
              <div v-if="labsFeaturedImage" class="md:mr-8 mb-4 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
                <img :src="labsFeaturedImage.source_url" :alt="htmlDecoder(labsSection.title.rendered)">
              </div>
              <div v-sanitize="[sanitizeOptions, labsSectionResults]" class="community-page-content" />
            </div>
          </div>
        </article>
        <article id="recipe-page" ref="recipe">
          <div v-if="recipeSection">
            <h2>{{ htmlDecoder(recipeSection.title.rendered) }}</h2>
            <div class="md:flex">
              <div v-if="recipeFeaturedImage" class="md:mr-8 mb-4 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
                <img :src="recipeFeaturedImage.source_url" :alt="htmlDecoder(recipeSection.title.rendered)">
              </div>
              <div v-sanitize="[sanitizeOptions, recipeSectionResults]" class="community-page-content" />
            </div>
          </div>
        </article>
        <article id="favourite-page" ref="favourite">
          <h2>Favourite radio stations</h2>
          <div v-sanitize="favouritesContentResults" class="community-page-content" />
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import {
  callForShowsURL,
  lahmaBaseURL,
  communitySectionURL,
  favouriteRadiosURL,
  eventsSectionURL,
  pressSectionURL,
  labsSectionURL, recipeSectionURL, mediaURL
} from '~/constants'

export default {
  data () {
    return {
      callForShows: null,
      lahmaBase: null,
      lahmaBaseFeaturedImage: null,
      communitySection: null,
      communityFeaturedImage: null,
      eventsSection: null,
      eventsFeaturedImage: null,
      pressSection: null,
      pressFeaturedImage: null,
      labsSection: null,
      labsFeaturedImage: null,
      recipeSection: null,
      recipeFeaturedImage: null,
      favouritesContent: null,
      sanitizeOptions: {
        allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br', 'a', 'sup'],
        allowedAttributes: {
          img: ['*'],
          div: ['style', 'class', 'id'],
          a: ['*']
        }
      }
    }
  },
  async fetch () {
    // callForShows
    this.callForShows = await this.$axios.get(`${callForShowsURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Call For Shows not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Call For Shows not available' })
      })
    // lahmaBaseURL
    this.lahmaBase = await this.$axios.get(`${lahmaBaseURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Lahma Base not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Lahma Base not available' })
      })
    if (this.lahmaBase && this.lahmaBase.featured_media !== 0) {
      this.lahmaBaseFeaturedImage = await this.$axios.get(mediaURL + `/${this.lahmaBase.featured_media}`)
        .then(res => res.data)
        .catch((error) => {
          this.$sentry.captureException(new Error('Lahma Base not available ', error))
          this.$nuxt.error({ statusCode: 404, message: 'Lahma Base not available' })
        })
    }
    // communitySection
    this.communitySection = await this.$axios.get(`${communitySectionURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Community Section not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Community Section not available' })
      })
    if (this.communitySection && this.communitySection.featured_media !== 0) {
      this.communityFeaturedImage = await this.$axios.get(mediaURL + `/${this.communitySection.featured_media}`)
        .then(res => res.data)
        .catch((error) => {
          this.$sentry.captureException(new Error('Featured Image not available ', error))
          this.$nuxt.error({ statusCode: 404, message: 'Featured Image not available' })
        })
    }
    // eventsSection
    this.eventsSection = await this.$axios.get(`${eventsSectionURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Events Section not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Events Section not available' })
      })
    if (this.eventsSection && this.eventsSection.featured_media !== 0) {
      this.eventsFeaturedImage = await this.$axios.get(mediaURL + `/${this.eventsSection.featured_media}`)
        .then(res => res.data)
        .catch((error) => {
          this.$sentry.captureException(new Error('Press Image not available ', error))
          this.$nuxt.error({ statusCode: 404, message: 'Press Image not available' })
        })
    }
    // pressSection
    this.pressSection = await this.$axios.get(`${pressSectionURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Press Section not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Press Section not available' })
      })
    if (this.pressSection && this.pressSection.featured_media !== 0) {
      this.pressFeaturedImage = await this.$axios.get(mediaURL + `/${this.pressSection.featured_media}`)
        .then(res => res.data)
        .catch((error) => {
          this.$sentry.captureException(new Error('Press Image not available ', error))
          this.$nuxt.error({ statusCode: 404, message: 'Press Image not available' })
        })
    }
    // labsSection
    this.labsSection = await this.$axios.get(`${labsSectionURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Labs Section not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Labs Section not available' })
      })
    if (this.labsSection && this.labsSection.featured_media !== 0) {
      this.labsFeaturedImage = await this.$axios.get(mediaURL + `/${this.labsSection.featured_media}`)
        .then(res => res.data)
        .catch((error) => {
          this.$sentry.captureException(new Error('Labs Image not available ', error))
          this.$nuxt.error({ statusCode: 404, message: 'Labs Image not available' })
        })
    }

    // recipeSection
    this.recipeSection = await this.$axios.get(`${recipeSectionURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Recipe Section not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Recipe Section not available' })
      })
    if (this.recipeSection && this.recipeSection.featured_media !== 0) {
      this.recipeFeaturedImage = await this.$axios.get(mediaURL + `/${this.recipeSection.featured_media}`)
        .then(res => res.data)
        .catch((error) => {
          this.$sentry.captureException(new Error('Recipe Image not available ', error))
          this.$nuxt.error({ statusCode: 404, message: 'Recipe Image not available' })
        })
    }
    // favourite radios
    this.favouritesContent = await this.$axios.get(`${favouriteRadiosURL}`)
      .then((res) => {
        if (res) {
          return res.data
        }
      })
      .catch((error) => {
        this.$sentry.captureException(new Error('Favourites not available ', error))
        this.$nuxt.error({ statusCode: 404, message: 'Favourites not available' })
      })
  },
  head () {
    return {
      title: 'Lahmacun Community',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Lahmacun.hu is an online music & more radio from Budapest since 2018'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Community'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Lahmacun.hu is an online music & more radio from Budapest since 2018'
        }
      ]
    }
  },
  computed: {
    callForShowsResults () {
      if (!this.callForShows) {
        return 'No content'
      }
      return this.callForShows.content.rendered
    },
    lahmaBaseResults () {
      if (!this.lahmaBase) {
        return 'No content'
      }
      return this.lahmaBase.content.rendered
    },
    communityResults () {
      if (!this.communitySection) {
        return 'No content'
      }
      return this.communitySection.content.rendered
    },
    eventsSectionResults () {
      if (!this.eventsSection) {
        return 'No content'
      }
      return this.eventsSection.content.rendered
    },
    pressSectionResults () {
      if (!this.pressSection) {
        return 'No content'
      }
      return this.pressSection.content.rendered
    },
    labsSectionResults () {
      if (!this.labsSection) {
        return 'No content'
      }
      return this.labsSection.content.rendered
    },
    recipeSectionResults () {
      if (!this.recipeSection) {
        return 'No content'
      }
      return this.recipeSection.content.rendered
    },

    favouritesContentResults () {
      if (!this.favouritesContent) {
        return 'No content'
      }
      return this.favouritesContent.content.rendered
    }
  },
  mounted () {
    if (this.$router) {
      this.addListeners()
    }
  },
  beforeDestroy () {
    if (this.$router) {
      this.removeListeners()
    }
  },
  updated () {
    if (this.$router) {
      this.removeListeners()
      this.$nextTick(() => {
        this.addListeners()
      })
    }
  },
  methods: {
    /**
     * Prevents default browser behavior (page reload) for in-page links.
     */
    navigate (event) {
      const href = event.target.getAttribute('href')
      const target = event.target.getAttribute('target')
      // check if the root and not blank
      if (href && href[0] === '/' && target !== '_blank') {
        event.preventDefault()
        this.$router && this.$router.push(href)
      }
      // check if it is a wp page
      if (href && href.startsWith('https://www.lahmacun.hu')) {
        event.preventDefault()
        const filteredHref = href.replace('https://www.lahmacun.hu', '')
        this.$router && this.$router.push({ path: filteredHref })
      }
    },
    addListeners () {
      const renderedContent = document.getElementById('community-content')
      this.links = renderedContent.getElementsByTagName('a')
      for (let i = 0; i < this.links.length; i++) {
        this.links[i].addEventListener('click', this.navigate, false)
      }
    },
    removeListeners () {
      for (let i = 0; i < this.links.length; i++) {
        this.links[i].removeEventListener('click', this.navigate, false)
      }
      this.links = []
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  padding-top: 1rem;
  margin-bottom: 1.5rem;
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
#community-content {
  .community-page-content {
    a {
      @apply underline;
    }
    p {
      @apply mb-2;
    }
  }
}

#favourite-page .community-page-content {
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
