import 'swiper/swiper.min.css'
import SwiperCore, { Mousewheel } from 'swiper'

SwiperCore.use([Mousewheel])

export type { SwiperOptions } from 'swiper'
export { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue'
