"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";

const BannerSlider = () => {
  const swiperRef = useRef(null);

  const bannerSlides = [
    {
      id: 1,
      image:
        "https://i.ibb.co.com/zqJknC6/image-cheerful-girl-going-shopping-holding-bags-with-purchases-smiling-camera-standing-aga.jpg",
      title: "Summer Sale",
      description: "Discover amazing deals on your favorite products",
      buttonText: "Shop Now",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      title: "New Collection",
      description: "Explore the latest trends in fashion",
      buttonText: "Discover Now",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      title: "Electronics Sale",
      description: "Up to 50% off on all electronics",
      buttonText: "Shop Electronics",
    },
  ];

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
      {/* Navigation Buttons */}
      <button
        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <FaChevronLeft size={16} className="md:block hidden" />
        <FaChevronLeft size={12} className="md:hidden" />
      </button>

      <button
        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <FaChevronRight size={16} className="md:block hidden" />
        <FaChevronRight size={12} className="md:hidden" />
      </button>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className} bg-white/50 w-3 h-3 mx-1 rounded-full hover:bg-white transition-all duration-300"></span>`,
        }}
        loop={true}
        className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]"
      >
        {bannerSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="100vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-4 sm:px-8 lg:px-12">
                <div className="text-white max-w-full sm:max-w-md lg:max-w-lg">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-6 opacity-90">
                    {slide.description}
                  </p>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .swiper-pagination-bullet-active {
          background: white !important;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default BannerSlider;
