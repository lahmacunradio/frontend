<template>
  <div>
    <h2 class="title-block">
      Lahmacun Community
    </h2>
    <div>
      <nav class="px-4 pt-8">
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
              Show hosts & collabs
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
          <li>
            <a href="#" @click.prevent="scrollToRef('supporters')">
              Supporters
            </a>
          </li>
        </ul>
      </nav>
      <div class="px-4 my-8 italic text-center">
        <h4>Lahmacun.hu is an online music & more radio from Budapest since 2018</h4>
      </div>
      <div v-if="pendingAny" class="flex flex-col items-center justify-center py-8">
        <img src="@/assets/img/preloader.svg" class="h-8 mb-2" alt="preload">
        <p>Loading...</p>
      </div>
      <div id="community-content" class="container">
        <article id="call-page" ref="call">
          <div v-if="callForShows">
            <h2>{{ htmlDecoder(callForShows?.title?.rendered) }}</h2>
            <div v-dompurify-html="{ html: callForShowsResults, options: sanitizeOptions }" class="community-page-content" />
          </div>
        </article>
        <article id="base-page" ref="base">
          <div v-if="lahmaBase">
            <h2>{{ htmlDecoder(lahmaBase?.title?.rendered) }}</h2>
            <div class="md:flex">
              <div v-if="lahmaBaseFeaturedImage" class="mb-4 md:mr-8 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
                <img :src="lahmaBaseFeaturedImage.source_url" :alt="htmlDecoder(lahmaBase?.title?.rendered)">
              </div>
              <div v-dompurify-html="{ html: lahmaBaseResults, options: sanitizeOptions }" class="community-page-content" />
            </div>
          </div>
        </article>
        <article id="community-page" ref="community">
          <div v-if="communitySection">
            <h2>{{ htmlDecoder(communitySection?.title?.rendered) }}</h2>
            <div class="md:flex">
              <div v-if="communityFeaturedImage" class="mb-4 md:mr-8 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
                <img :src="communityFeaturedImage.source_url" :alt="htmlDecoder(communitySection?.title?.rendered)">
              </div>
              <div v-dompurify-html="{ html: communityResults, options: sanitizeOptions }" class="community-page-content" />
            </div>
          </div>
        </article>
        <article id="events-page" ref="events">
          <div v-if="eventsSection">
            <h2>{{ htmlDecoder(eventsSection?.title?.rendered) }}</h2>
            <div class="md:flex">
              <div v-if="eventsFeaturedImage" class="mb-4 md:mr-8 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
                <img :src="eventsFeaturedImage.source_url" :alt="htmlDecoder(eventsSection?.title?.rendered)">
              </div>
              <div v-dompurify-html="{ html: eventsSectionResults, options: sanitizeOptions }" class="community-page-content" />
            </div>
          </div>
        </article>
        <article id="press-page" ref="press">
          <div v-if="pressSection">
            <h2>{{ htmlDecoder(pressSection?.title?.rendered) }}</h2>
            <div class="md:flex">
              <div v-if="pressFeaturedImage" class="mb-4 md:mr-8 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
                <img :src="pressFeaturedImage.source_url" :alt="htmlDecoder(pressSection?.title?.rendered)">
              </div>
              <div v-dompurify-html="{ html: pressSectionResults, options: sanitizeOptions }" class="community-page-content" />
            </div>
          </div>
        </article>
        <article id="labs-page" ref="labs">
          <div v-if="labsSection">
            <h2>{{ htmlDecoder(labsSection?.title?.rendered) }}</h2>
            <div class="md:flex">
              <div v-if="labsFeaturedImage" class="mb-4 md:mr-8 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
                <img :src="labsFeaturedImage.source_url" :alt="htmlDecoder(labsSection?.title?.rendered)">
              </div>
              <div v-dompurify-html="{ html: labsSectionResults, options: sanitizeOptions }" class="community-page-content" />
            </div>
          </div>
        </article>
        <article id="recipe-page" ref="recipe">
          <div v-if="recipeSection">
            <h2>{{ htmlDecoder(recipeSection?.title?.rendered) }}</h2>
            <div class="md:flex">
              <div v-if="recipeFeaturedImage" class="mb-4 md:mr-8 md:mb-0 min-w-1/2 lg:min-w-1/3 md:w-1/2 lg:w-1/3">
                <img :src="recipeFeaturedImage.source_url" :alt="htmlDecoder(recipeSection?.title?.rendered)">
              </div>
              <div v-dompurify-html="{ html: recipeSectionResults, options: sanitizeOptions }" class="community-page-content" />
            </div>
          </div>
        </article>
        <article id="favourite-page" ref="favourite">
          <h2>Favourite radio stations</h2>
          <div v-dompurify-html="favouritesContentResults" class="community-page-content" />
        </article>
        <article id="supporters-page" ref="supporters">
          <h2>{{ htmlDecoder(supportersContent?.title?.rendered) }}</h2>
          <div v-dompurify-html="{ html: supportersContentResults, options: sanitizeOptions }" class="community-page-content" />
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { useHead } from '#app'
import { useWpPage } from '@/composables/useWpPage'
import {
  callForShowsURL,
  lahmaBaseURL,
  communitySectionURL,
  favouriteRadiosURL,
  eventsSectionURL,
  pressSectionURL,
  labsSectionURL,
  recipeSectionURL,
  supportersURL
} from '~/constants'

useHead({
  title: 'Lahmacun Community',
  meta: [
    { hid: 'description', name: 'description', content: 'Lahmacun.hu is an online music & more radio from Budapest since 2018' },
    { hid: 'og:title', property: 'og:title', content: 'Lahmacun Community' },
    { hid: 'og:description', name: 'og:description', content: 'Lahmacun.hu is an online music & more radio from Budapest since 2018' }
  ]
})

// sanitize options for DOMPurify
const sanitizeOptions = {
  allowedTags: ['div', 'p', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br', 'a', 'sup', 'sub'],
  allowedAttributes: {
    img: ['*'],
    div: ['style', 'class', 'id'],
    a: ['*']
  }
}

// Sections via composable (page + featured image)
const { data: callRes, pending: callPending } = await useWpPage(callForShowsURL)
const { data: baseRes, pending: basePending } = await useWpPage(lahmaBaseURL)
const { data: communityRes, pending: communityPending } = await useWpPage(communitySectionURL)
const { data: eventsRes, pending: eventsPending } = await useWpPage(eventsSectionURL)
const { data: pressRes, pending: pressPending } = await useWpPage(pressSectionURL)
const { data: labsRes, pending: labsPending } = await useWpPage(labsSectionURL)
const { data: recipeRes, pending: recipePending } = await useWpPage(recipeSectionURL)
const { data: favouritesRes, pending: favouritesPending } = await useWpPage(favouriteRadiosURL)
const { data: supportersRes, pending: supportersPending } = await useWpPage(supportersURL)

const callForShows = computed(() => callRes.value?.page || null)
const callForShowsResults = computed(() => callForShows.value ? callForShows.value.content?.rendered : 'No content')

const lahmaBase = computed(() => baseRes.value?.page || null)
const lahmaBaseFeaturedImage = computed(() => baseRes.value?.featuredImage || null)
const lahmaBaseResults = computed(() => lahmaBase.value ? lahmaBase.value.content?.rendered : 'No content')

const communitySection = computed(() => communityRes.value?.page || null)
const communityFeaturedImage = computed(() => communityRes.value?.featuredImage || null)
const communityResults = computed(() => communitySection.value ? communitySection.value.content?.rendered : 'No content')

const eventsSection = computed(() => eventsRes.value?.page || null)
const eventsFeaturedImage = computed(() => eventsRes.value?.featuredImage || null)
const eventsSectionResults = computed(() => eventsSection.value ? eventsSection.value.content?.rendered : 'No content')

const pressSection = computed(() => pressRes.value?.page || null)
const pressFeaturedImage = computed(() => pressRes.value?.featuredImage || null)
const pressSectionResults = computed(() => pressSection.value ? pressSection.value.content?.rendered : 'No content')

const labsSection = computed(() => labsRes.value?.page || null)
const labsFeaturedImage = computed(() => labsRes.value?.featuredImage || null)
const labsSectionResults = computed(() => labsSection.value ? labsSection.value.content?.rendered : 'No content')

const recipeSection = computed(() => recipeRes.value?.page || null)
const recipeFeaturedImage = computed(() => recipeRes.value?.featuredImage || null)
const recipeSectionResults = computed(() => recipeSection.value ? recipeSection.value.content?.rendered : 'No content')

const favouritesContent = computed(() => favouritesRes.value?.page || null)
const favouritesContentResults = computed(() => favouritesContent.value ? favouritesContent.value.content?.rendered : 'No content')

const supportersContent = computed(() => supportersRes.value?.page || null)
const supportersContentResults = computed(() => supportersContent.value ? supportersContent.value.content?.rendered : 'No content')

const pendingAny = computed(() => callPending.value || basePending.value || communityPending.value || eventsPending.value || pressPending.value || labsPending.value || recipePending.value || favouritesPending.value || supportersPending.value)

// In-page navigation refs and helper
const call = ref(null)
const base = ref(null)
const events = ref(null)
const community = ref(null)
const press = ref(null)
const labs = ref(null)
const recipe = ref(null)
const favourite = ref(null)
const supporters = ref(null)

function scrollToRef (name) {
  const map = { call, base, events, community, press, labs, recipe, favourite, supporters }
  const target = map[name]?.value
  if (target && typeof target.scrollIntoView === 'function') {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

// Intercept in-content links to navigate via router instead of full reload
const links = ref([])
function navigate (event) {
  const href = event.target.getAttribute('href')
  const target = event.target.getAttribute('target')
  const router = useRouter()
  if (href && href[0] === '/' && target !== '_blank') {
    event.preventDefault()
    router.push(href)
  }
  if (href && href.startsWith('https://www.lahmacun.hu')) {
    event.preventDefault()
    const filteredHref = href.replace('https://www.lahmacun.hu', '')
    router.push({ path: filteredHref })
  }
}

function addListeners () {
  const renderedContent = document.getElementById('community-content')
  if (!renderedContent) { return }
  links.value = renderedContent.getElementsByTagName('a')
  for (let i = 0; i < links.value.length; i++) {
    links.value[i].addEventListener('click', navigate, false)
  }
}
function removeListeners () {
  if (links.value && links.value.length) {
    for (let i = 0; i < links.value.length; i++) {
      links.value[i].removeEventListener('click', navigate, false)
    }
  }
  links.value = []
}

onMounted(async () => {
  await nextTick()
  addListeners()
})
onBeforeUnmount(() => {
  removeListeners()
})
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
      text-decoration: underline;
    }
    p {
      margin-bottom: 0.5rem;
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
