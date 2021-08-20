import Vue from 'vue'
import { Swiper as SwiperClass, Pagination, Navigation, Mousewheel, Autoplay } from 'vue-awesome-swiper'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'

// import custom style
import '@/assets/css/customswiper.scss'

SwiperClass.use([Pagination, Mousewheel, Navigation, Autoplay])
Vue.use(getAwesomeSwiper(SwiperClass))
