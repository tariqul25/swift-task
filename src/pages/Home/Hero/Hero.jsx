import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [
  {
    title: "Earn Money with Simple Tasks",
    subtitle: "Complete micro-tasks and get paid instantly",
    background: "bg-gradient-to-r from-blue-600 to-purple-600",
    image: "https://i.ibb.co/BHFqtDxx/istockphoto-2185857500-612x612.jpg"
  },
  {
    title: "Post Tasks & Get Results",
    subtitle: "Hire skilled workers for your projects",
    background: "bg-gradient-to-r from-green-600 to-blue-600",
    image: "https://i.ibb.co/8DFYGfSR/computer-laptop-NLBN1-GQQET.jpg"
  },
  {
    title: "Join Thousands of Users",
    subtitle: "Start your earning journey today",
    background: "bg-gradient-to-r from-purple-600 to-pink-600",
    image: "https://i.ibb.co/sdRTBN9D/home-office-4996834-1280.jpg"
  }
];

const Hero = () => {
  return (
    <div className="h-screen overflow-hidden ">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="h-70vh"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {/* Outer wrapper to isolate Swiper's styling */}
            <div className="h-full w-full ">
              {/* Inner gradient background */}
              <div className={`${slide.background} h-full w-full flex items-center justify-center relative`}>
                {/* Overlay */}
                <div className="absolute inset-0 "></div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <div className="text-white">
                      <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        {slide.title}
                      </h1>
                      <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                          Get Started
                        </button>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
                          Learn More
                        </button>
                      </div>
                    </div>

                    {/* Image */}
                    <div>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="rounded-lg shadow-2xl w-full h-96 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
