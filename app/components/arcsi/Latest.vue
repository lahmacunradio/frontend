<template>
  <div>
    <h3>Arcsi's Latest</h3>
    <div class="container py-8">
      <div v-swiper="swiperOption" class="relative" :loadtheme="false">
        <div class="swiper-wrapper">
          <div v-for="(episode, i) in arcsiEpisodesListSortedLatest" :key="i" class="swiper-slide">
            <div class="latest-arcsi-blokk">
              <div class="mb-4 arcsi-img">
                <img class="block" :src="episode.image_url">
              </div>
              <h5>{{ episode.name }}</h5>
            </div>
          </div>
        </div>
        <div slot="button-prev" class="swiper-button-prev" />
        <div slot="button-next" class="swiper-button-next" />
      </div>
    </div>
  </div>
</template>

<script>
import { directive } from 'vue-awesome-swiper'

export default {
  directives: {
    swiper: directive
  },
  data () {
    return {
      startIndex: 0,
      numberOfEpisodes: 9,
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: -10,
        slidesPerGroup: 3,
        loop: true,
        loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        breakpoints: {
          1200: {
            slidesPerView: 4,
            spaceBetween: 10
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 10
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 10
          },
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          }
        }
      }
    }
  },
  computed: {
    arcsiEpisodes () {
      return this.$store.state.arcsiEpisodes
    },
    arcsiEpisodesListSortedLatest () {
      if (this.arcsiEpisodes) {
        const showslist = [...this.arcsiEpisodes]
        return showslist.sort((a, b) => new Date(b.play_date) - new Date(a.play_date)).slice(this.startIndex, this.numberOfEpisodes)
      }
      return null
    }
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

.latest-arcsi-blokk {
  .arcsi-img {
    height: 300px;
    width: 100%;
    overflow: hidden;
    img {
      object-fit: cover;
      min-height: 100%;
      min-width: 100%;
    }
  }
}

</style>
