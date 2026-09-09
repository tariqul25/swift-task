import React, { useEffect, useState } from 'react';
import { Trophy, Coins, Star, Sparkles, Award, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import useAxios from '../../../hooks/useAxios';

const curatedWorkers = [
  {
    name: 'Ayesha Akter',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    coins: 14850,
    tasksCompleted: 218,
    rating: 4.9,
    badge: 'Master Contributor',
    specialty: 'Data Labeling & Translation'
  },
  {
    name: 'Tanvir Hasan',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    coins: 12420,
    tasksCompleted: 184,
    rating: 4.9,
    badge: 'Top Tier QA',
    specialty: 'Mobile App Usability'
  },
  {
    name: 'Farzana Jahan',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    coins: 11180,
    tasksCompleted: 165,
    rating: 4.8,
    badge: 'Verification Pro',
    specialty: 'Content Moderation'
  },
  {
    name: 'Mizanur Rahman',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    coins: 9850,
    tasksCompleted: 142,
    rating: 4.8,
    badge: 'Lead Auditor',
    specialty: 'Digital Research'
  },
  {
    name: 'Sadia Khatun',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
    coins: 8920,
    tasksCompleted: 130,
    rating: 4.7,
    badge: 'Senior Worker',
    specialty: 'Transcription Specialist'
  },
  {
    name: 'Rakibul Islam',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
    coins: 7890,
    tasksCompleted: 119,
    rating: 4.7,
    badge: 'Active Achiever',
    specialty: 'SEO Validation'
  }
];

const TopWorker = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();

  useEffect(() => {
    axiosInstance
      .get('/api/top-workers')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Merge API data with curated portraits if missing
          const merged = res.data.map((w, idx) => ({
            name: w.name || curatedWorkers[idx]?.name || 'Verified Contributor',
            photo: w.photo || curatedWorkers[idx]?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
            coins: w.coins || curatedWorkers[idx]?.coins || 1000,
            tasksCompleted: curatedWorkers[idx]?.tasksCompleted || 85,
            rating: curatedWorkers[idx]?.rating || 4.8,
            badge: curatedWorkers[idx]?.badge || 'Certified Worker',
            specialty: curatedWorkers[idx]?.specialty || 'Micro-Task Execution'
          }));
          setWorkers(merged);
        } else {
          setWorkers(curatedWorkers);
        }
      })
      .catch(() => {
        setWorkers(curatedWorkers);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/60 relative">
      <div className="max-w-[1570px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Hall of Excellence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Top Performing Global Contributors
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mt-3">
              Recognizing our highest-earning, most disciplined workers who consistently deliver verified quality and swift turnaround times.
            </p>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group"
          >
            <span>Start Earning on SwiftTasks</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Worker Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workers.map((worker, index) => {
            const rank = index + 1;
            const rankStyle =
              rank === 1
                ? 'from-amber-400 to-yellow-600 text-white shadow-amber-500/30'
                : rank === 2
                ? 'from-slate-300 to-slate-500 text-white shadow-slate-400/30'
                : rank === 3
                ? 'from-amber-700 to-yellow-800 text-white shadow-amber-700/30'
                : 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-200';

            return (
              <div
                key={index}
                className="group relative rounded-3xl bg-white dark:bg-slate-900/90 p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-950/5 hover:shadow-2xl hover:shadow-indigo-950/20 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Rank and Rating */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${rankStyle} flex items-center justify-center font-black text-xs shadow-md`}
                      >
                        #{rank}
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                        {worker.badge}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{worker.rating}</span>
                    </div>
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <img
                        src={worker.photo}
                        alt={worker.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/25 group-hover:ring-indigo-500 transition-all duration-300 shadow-md"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {worker.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        {worker.specialty}
                      </p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 mb-6">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                        Total Coins
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {worker.coins.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                        Tasks Completed
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {worker.tasksCompleted} Proofs
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      100% Payout Reliability
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Active Daily</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopWorker;
