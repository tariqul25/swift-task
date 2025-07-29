import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex Thompson",
    role: "Freelance Worker",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote: "I've earned over $500 this month just by completing simple tasks during my free time. The platform is user-friendly and payments are always on time!",
    rating: 5
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    role: "Small Business Owner",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150&h=150&fit=crop&crop=face",
    quote: "As a buyer, I love how easy it is to get quality work done quickly. The workers are skilled and the results exceed my expectations every time.",
    rating: 5
  },
  {
    id: 3,
    name: "John Davis",
    role: "Student",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote: "Perfect for students like me! I can earn money between classes and it's helping me pay for my education. Highly recommend to anyone looking for flexible work.",
    rating: 5
  },
  {
    id: 4,
    name: "Sophie Chen",
    role: "Marketing Manager",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote: "The quality of work I get here is amazing. Workers are professional and deliver exactly what I need for my marketing campaigns.",
    rating: 5
  }
];

const TestimonialSlider = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600">
            Real feedback from our satisfied community
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev"
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={30}
            slidesPerView={1}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="bg-white rounded-2xl shadow-lg p-8 mx-auto max-w-2xl">
                  <div className="flex items-center mb-6">
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{t.name}</h3>
                      <p className="text-gray-600">{t.role}</p>
                    </div>
                    <div className="ml-auto">
                      <Quote className="w-6 h-6 text-blue-500 opacity-50" />
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg mb-6 italic">"{t.quote}"</p>
                  <div className="flex items-center">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Arrows */}
          <button
            className="custom-prev absolute left-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 p-2 rounded-full shadow z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            className="custom-next absolute right-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 p-2 rounded-full shadow z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
