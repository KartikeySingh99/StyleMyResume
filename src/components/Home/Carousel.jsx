import 'react-alice-carousel/lib/alice-carousel.css';
import ReviewsCards from './ReviewsCards';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';

const data = [
    {
        ratings: 4,
        name: "Albert",
        review: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos aliquid velit in."
    },
    {
        ratings: 4.5,
        name: "Maria",
        review: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos aliquid velit in."
    },
    {
        ratings: 5,
        name: "John",
        review: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos aliquid velit in."
    },
    {
        ratings: 3.5,
        name: "Jake",
        review: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos aliquid velit in."
    },
]

const Carousel = () => {
    return (

        <Swiper
            className="mySwiper"
            breakpoints={{
                320: {
                    slidesPerView: 1
                },
                375: {
                    slidesPerView: 1
                },
                425: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2
                },
                1024: {
                    slidesPerView: 3
                }
            }}
            freeMode={true}
            loop={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            grabCursor={true}
            // navigation={true}
            modules={[Navigation, Autoplay]}
            slidesPerView={3}
            spaceBetween={30}
            pagination={{
                clickable: true,
            }}>
            {
                data.map((item, i) => (
                    <SwiperSlide key={i}>
                        <ReviewsCards rating={item.ratings} name={item.name} review={item.review} />
                    </SwiperSlide>
                ))
            }

        </Swiper >
        // <AliceCarousel
        //     mouseTracking
        //     items={data.map((item, i) => (
        //         <ReviewsCards key={i} rating={item.ratings} name={item.name} review={item.review} />
        //     ))}
        //     disableDotsControls
        //     responsive={responsive}
        //     controlsStrategy="alternate"
        // />
    )
}

export default Carousel