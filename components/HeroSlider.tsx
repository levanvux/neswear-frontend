"use client";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const banners = [
  "/herobanner-1.png",
  "/hero-banner-2.png",
  "/hero-banner-3.png",
];

export default function HeroSlider() {
  return (
    <section>
      <Swiper
        className="hero-swiper"
        modules={[Autoplay, Navigation, Pagination, A11y]}
        slidesPerView={1}
        navigation
        autoplay={{
          delay: 3000,
        }}
        pagination={{ clickable: true }}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[15rem] md:h-[30rem] lg:h-[40rem] hover:cursor-pointer">
              <Image
                src={banner}
                alt={`Banner ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
