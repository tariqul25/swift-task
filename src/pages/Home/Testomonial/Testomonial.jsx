import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight, Star, Quote, CheckCircle2 } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex Thompson",
    role: "Top Rated Freelancer",
    location: "United States",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    quote: "I've earned over $1,200 this month just by completing micro-tasks between my university classes. The platform is intuitive, reliable, and payments are always processed instantly!",
    rating: 5,
    completedTasks: 340,
  },
  {
    id: 2,
    name: "Elena Rostova",
    role: "E-Commerce Enterprise Buyer",
    location: "Germany",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    quote: "As a digital agency director, getting hundreds of app reviews, survey responses, and QA tests done in 24 hours used to be a nightmare. SwiftTasks solved this completely with exceptional worker quality.",
    rating: 5,
    completedTasks: 1250,
  },
  {
    id: 3,
    name: "Marcus Vance",
    role: "Full-Stack Developer",
    location: "Canada",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    quote: "The interface is super fast and clean. You always know what is expected, the coin balance updates transparently, and the admin team maintains extremely high standards.",
    rating: 5,
    completedTasks: 520,
  },
  {
    id: 4,
    name: "Sophie Chen",
    role: "Growth Marketing Lead",
    location: "Singapore",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    quote: "We scaled our user-generated content by 400% in 2 weeks using SwiftTasks. The speed, worker commitment, and seamless coin reimbursement system make it our go-to workforce hub.",
    rating: 5,
    completedTasks: 890,
  }
];

const TestimonialSlider = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-950 transition-colors relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light border border-primary/20 mb-3">
            <Star className="w-3.5 h-3.5 fill-current" />
            Social Proof & Trust
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved by Thousands of <br />
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Workers & Buyers Worldwide
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Real experiences from professionals, students, and businesses scaling on SwiftTasks.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 sm:px-12">
          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            navigation={{
              nextEl: ".test-next-btn",
              prevEl: ".test-prev-btn"
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: "!bg-primary !w-8 !rounded-full transition-all",
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={24}
            slidesPerView={1}
            className="pb-12"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={t.photo}
                          alt={t.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-primary/20 shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-sm" title="Verified Member">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.name}</h3>
                        </div>
                        <p className="text-sm font-medium text-primary dark:text-primary-light">{t.role}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t.location} • {t.completedTasks}+ Tasks</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2">
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <Quote className="w-8 h-8 text-slate-200 dark:text-slate-800 hidden sm:block" />
                    </div>
                  </div>

                  <blockquote className="text-slate-700 dark:text-slate-300 text-base sm:text-xl font-medium leading-relaxed italic relative">
                    "{t.quote}"
                  </blockquote>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Arrows */}
          <button
            className="test-prev-btn absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:translate-x-0 w-11 h-11 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all z-20 cursor-pointer focus:outline-none"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="test-next-btn absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-0 w-11 h-11 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all z-20 cursor-pointer focus:outline-none"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
