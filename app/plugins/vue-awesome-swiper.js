import Vue from 'vue'
import { Swiper as SwiperClass } from 'vue-awesome-swiper'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'

// import custom style
import '@/assets/css/customswiper.scss'

Vue.use(getAwesomeSwiper(SwiperClass))
