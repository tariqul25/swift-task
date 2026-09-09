import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Users2,
  TrendingUp,
  Award,
  Clock,
  Coins,
  ArrowRight,
  CheckCircle2,
  UserPlus,
  Search,
  CheckSquare,
  PlusCircle,
  Eye,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router';

const ExtraSection = () => {
  const [activeTab, setActiveTab] = useState('worker');

  const features = [
    {
      icon: ShieldCheck,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50 dark:bg-blue-950/40",
      textLight: "text-blue-600 dark:text-blue-400",
      title: "Bank-Grade Escrow Security",
      desc: "Every buyer task deposit is held safely in escrow. Workers are guaranteed coin payouts once submissions meet task instructions."
    },
    {
      icon: Zap,
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50 dark:bg-amber-950/40",
      textLight: "text-amber-600 dark:text-amber-400",
      title: "Instant Coin Credit & Payouts",
      desc: "Approved submissions credit coins instantly to your balance. Withdraw straight to bKash, Nagad, Rocket, or Bank within 24 hours."
    },
    {
      icon: Users2,
      color: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-50 dark:bg-purple-950/40",
      textLight: "text-purple-600 dark:text-purple-400",
      title: "Global Distributed Workforce",
      desc: "Connect with tens of thousands of active workers ready to perform testing, feedback, social engagement, and digital tasks around the clock."
    }
  ];

  const stats = [
    { value: "50,000+", label: "Registered Workers", sub: "Active worldwide" },
    { value: "120,000+", label: "Tasks Completed", sub: "99.4% satisfaction" },
    { value: "$2.5M+", label: "Worker Payouts", sub: "Direct disbursement" },
    { value: "4.9 / 5", label: "Trust Score", sub: "From 15k+ reviews" }
  ];

  const workerSteps = [
    {
      step: "01",
      icon: UserPlus,
      title: "Create Free Account",
      desc: "Register in 30 seconds and receive 10 complimentary bonus coins immediately."
    },
    {
      step: "02",
      icon: Search,
      title: "Browse Live Tasks",
      desc: "Explore hundreds of available micro-tasks matching your skills and schedule."
    },
    {
      step: "03",
      icon: CheckSquare,
      title: "Submit & Get Paid",
      desc: "Upload proof of completion and receive your coins instantly upon buyer approval."
    }
  ];

  const buyerSteps = [
    {
      step: "01",
      icon: PlusCircle,
      title: "Purchase Coins & Deposit",
      desc: "Buy coins effortlessly at competitive packages starting at just $1."
    },
    {
      step: "02",
      icon: Eye,
      title: "Publish Custom Tasks",
      desc: "Specify exact worker count, required proofs, and reward amount per submission."
    },
    {
      step: "03",
      icon: CreditCard,
      title: "Review & Approve",
      desc: "Inspect worker submissions in your dashboard with one-click approval & rejection."
    }
  ];

  return (
    <div className="space-y-24 py-12 bg-white dark:bg-slate-950 transition-colors">
      {/* 1. Value Proposition Grid */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-3">
            <Award className="w-3.5 h-3.5" />
            Industry Standard Platform
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Choose <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">SwiftTasks</span>?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Engineered for reliability, transparent escrow accounting, and instant global micro-earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, index) => (
            <div
              key={index}
              className="relative group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${f.bgLight} ${f.textLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {f.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. High-Impact Stats Banner */}
      <section className="container mx-auto px-4">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-purple-700 p-8 sm:p-12 text-white shadow-2xl overflow-hidden">
          {/* Background circles */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 rounded-full bg-black/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            {stats.map((s, idx) => (
              <div key={idx} className={idx > 0 ? "pt-6 md:pt-0 md:pl-6" : ""}>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-1">
                  {s.value}
                </div>
                <div className="text-base sm:text-lg font-semibold text-white/90">
                  {s.label}
                </div>
                <div className="text-xs text-white/70 mt-1">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works Interactive Section */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-3">
            <Clock className="w-3.5 h-3.5" />
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Whether you want to earn money as a worker or hire workforce as a buyer, getting started takes less than a minute.
          </p>

          {/* Toggle Tab */}
          <div className="inline-flex items-center p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mt-8 shadow-inner">
            <button
              onClick={() => setActiveTab('worker')}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'worker'
                  ? 'bg-white dark:bg-slate-800 text-primary dark:text-primary-light shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              For Workers
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'buyer'
                  ? 'bg-white dark:bg-slate-800 text-primary dark:text-primary-light shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              For Task Buyers
            </button>
          </div>
        </div>

        {/* Dynamic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {(activeTab === 'worker' ? workerSteps : buyerSteps).map((st, i) => (
            <div
              key={i}
              className="relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-primary/40 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light flex items-center justify-center font-bold">
                  <st.icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-slate-300 dark:text-slate-700 select-none">
                  {st.step}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {st.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-16 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ExtraSection;
