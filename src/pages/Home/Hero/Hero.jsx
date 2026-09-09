import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Users, TrendingUp } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    tag: "High-Frequency Micro-Workforce",
    title: "Complete Micro-Tasks & Earn Liquid Rewards Instantly",
    subtitle: "Unlock daily micro-earnings with zero friction. From data classification to content curation, work on your own schedule and withdraw directly.",
    ctaText: "Start Earning Now",
    ctaLink: "/register",
    secondaryText: "Browse Active Tasks",
    secondaryLink: "/login",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    badge: "100% Guaranteed Escrow Payouts",
    stats: "Over $120K+ Distributed"
  },
  {
    tag: "Scalable Enterprise Sourcing",
    title: "Deploy Tasks to Thousands of Verified Global Workers",
    subtitle: "Accelerate data annotation, QA testing, and digital micro-campaigns with a decentralized workforce ready to execute within minutes.",
    ctaText: "Post Your First Task",
    ctaLink: "/register",
    secondaryText: "Buyer Solutions",
    secondaryLink: "/login",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80",
    badge: "Precision Quality Control",
    stats: "Sub-5 Minute Delivery"
  },
  {
    tag: "Frictionless Ecosystem",
    title: "Transparent Ledger with Seamless Instant Withdrawals",
    subtitle: "Experience institutional reliability. Real-time coin conversion, automated escrow verification, and zero hidden platform deduction fees.",
    ctaText: "Join the Network",
    ctaLink: "/register",
    secondaryText: "Platform Security",
    secondaryLink: "/login",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80",
    badge: "Multi-Channel Cashout",
    stats: "bKash, Nagad & Global Rails"
  }
];

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        loop={true}
        className="w-full min-h-[640px] md:min-h-[720px] lg:min-h-[760px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative min-h-[640px] md:min-h-[720px] lg:min-h-[760px] flex items-center">
              {/* Background Image with Cinematic Gradient Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
              </div>

              {/* Slide Content */}
              <div className="max-w-[1570px] mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  {/* Left Column: Copy & Actions */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Live Badge Pill */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md text-indigo-300 text-xs font-bold uppercase tracking-wider shadow-inner">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                      <span>{slide.tag}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
                      {slide.subtitle}
                    </p>

                    {/* Action Triggers */}
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <Link
                        to={user ? "/dashboard" : slide.ctaLink}
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200"
                      >
                        {user ? "Access Dashboard" : slide.ctaText}
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        to={user ? "/dashboard" : slide.secondaryLink}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-850/80 text-slate-200 hover:text-white font-bold text-sm border border-white/15 backdrop-blur-md transition-colors duration-200"
                      >
                        {slide.secondaryText}
                      </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>{slide.badge}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <span>{slide.stats}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Floating Glassmorphic Metric Widget */}
                  <div className="hidden lg:block lg:col-span-5">
                    <div className="p-8 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/40 space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                          Network Activity
                        </span>
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-2xl font-black text-white">99.8%</p>
                          <p className="text-xs text-slate-400 mt-1">Approval Accuracy</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-2xl font-black text-amber-400">10 COINS</p>
                          <p className="text-xs text-slate-400 mt-1">Starter Signup Gift</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 border border-indigo-500/25">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Instant Settlement</p>
                            <p className="text-xs text-slate-300">Reviewed proofs credit directly to your ledger.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
