<template>
  <div>
    <h3>Arcsi's Latest</h3>
    <div class="container relative py-8">
      <div v-swiper="swiperOption" class="relative" :loadtheme="false">
        <div class="swiper-wrapper">
          <div v-for="(episode, i) in arcsiEpisodesListSortedLatest" :key="i" class="swiper-slide">
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

export default {
  name: 'LatestArcsi',
  directives: {
    swiper: directive
  },
  data () {
    return {
      startIndex: 0,
      numberOfEpisodes: 9,
      swiperOption: {
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
      }
    }
  },
  computed: {
    getToday () {
      const d = new Date()
      const year = d.getFullYear()
      const month = (d.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
      const day = d.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })
      return `${year}-${month}-${day}`
    },
    arcsiEpisodes () {
      return this.$store.state.arcsiEpisodes
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
@import "/assets/css/variables";
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

</style>
