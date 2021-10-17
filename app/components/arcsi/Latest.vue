<template>
  <div>
    <h3>Arcsi's Latest</h3>
    <div v-if="$fetchState.pending" class="flex flex-col items-center justify-center py-32">
      <img src="/img/preloader.svg" class="h-8 mb-2">
      <p>Loading...</p>
    </div>
    <div v-if="$fetchState.error" class="py-32 text-center">
      Error happened
    </div>
    <div class="container relative py-8 latest-container">
      <div v-swiper="swiperOption" class="relative" :loadtheme="false">
        <div class="swiper-wrapper">
          <div v-for="(episode, i) in arcsiEpisodesListSortedLatest" :key="episode + i" class="swiper-slide">
            <ArcsiLatestBlock :episode="episode" :arcsilist="arcsiList" />
          </div>
        </div>
      </div>
      <div slot="button-prev" class="swiper-button-prev">
        <img src="/img/arrow-left.svg" alt="">
      </div>
      <div slot="button-next" class="swiper-button-next">
        <img src="/img/arrow-right.svg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { directive } from 'vue-awesome-swiper'
import { arcsiItemBaseURL } from '~/constants'

export default {
  name: 'LatestArcsi',
  directives: {
    swiper: directive
  },
  data () {
    return {
      startIndex: 0,
      preloadImages: false,
      numberOfEpisodes: 9,
      swiperOption: {
        preloadImages: false,
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        breakpoints: {
          1024: {
            slidesPerView: 3,
            spaceBetween: 30
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          0: {
            slidesPerView: 1,
            spaceBetween: 30
          }
        }
      },
      arcsiEpisodes: null
    }
  },
  async fetch () {
    this.arcsiEpisodes = await this.$axios.get(arcsiItemBaseURL + '/all')
      .then(res => res.data)
      .catch((error) => {
        console.error('Error:', error)
      })
  },
  computed: {
    getToday () {
      const d = new Date()
      const year = d.getFullYear()
      const month = (d.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
      const day = d.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })
      return `${year}-${month}-${day}`
    },
    arcsiEpisodesListSortedLatest () {
      if (this.arcsiEpisodes) {
        const showslist = [...this.arcsiEpisodes]
        return showslist
          .filter(item => item.play_date < this.getToday)
          .filter(item => item.archived === true)
          .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))
          .slice(this.startIndex, this.numberOfEpisodes)
      }
      return null
    },
    arcsiList () {
      return [...this.$store.state.arcsiShows]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
h3 {
    width: 100%;
    padding: 0.5rem;
    margin: 0;
    text-transform: uppercase;
    background: $black-color;
    color: white;
    font-weight: 400;
    text-align: center;
}
.swiper-button-prev {
  left: -20px;
}
.swiper-button-next {
  right: -20px;
}
@media (max-width: $mobile-width) {
  .swiper-button-prev {
    left: 20px;
  }
  .swiper-button-next {
    right: 20px;
  }
}
.swiper-button-next, .swiper-button-prev {
  img {
    width: 3rem;
    max-width: none;
  }
  &::after {
    content: '';
  }
}
/* .latest-container {
  max-height: 75vh;
} */

</style>
