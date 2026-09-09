import React, { useState, useEffect } from 'react';
import {
  Clock,
  Coins,
  FileText,
  Award,
  CheckCircle2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const WorkerHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalEarning: 0,
    approvedSubmissions: []
  });
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure.get(`/api/worker-stats/${user.email}`)
      .then(res => setStats(res.data || { totalSubmissions: 0, pendingSubmissions: 0, totalEarning: 0, approvedSubmissions: [] }))
      .catch(err => console.error("Failed to load worker stats", err));
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-3">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            Verified Worker Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome Back, {user?.displayName || user?.name || 'Talent'}!
          </h1>
          <p className="mt-2 text-white/80 text-sm leading-relaxed">
            Ready to explore fresh micro-tasks and earn coins? Check available opportunities or track your submission approvals below.
          </p>
          <div className="mt-4">
            <Link
              to="/dashboard/task-list"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-primary font-bold text-xs shadow-md hover:bg-slate-100 transition-colors"
            >
              <span>Browse Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Submissions</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.totalSubmissions || 0}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Approvals</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.pendingSubmissions || 0}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Earnings</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {Number(stats.totalEarning || 0).toLocaleString()} <span className="text-sm font-normal text-slate-400">coins</span>
            </p>
          </div>
        </div>
      </div>

      {/* Approved Submissions Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Approved Submissions</h2>
          </div>
          <Link
            to="/dashboard/my-submission"
            className="text-xs font-semibold text-primary dark:text-primary-light hover:underline"
          >
            View All Submissions →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Task Title</th>
                <th className="py-3.5 px-6 font-semibold">Reward Credited</th>
                <th className="py-3.5 px-6 font-semibold">Buyer Name</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {(!stats.approvedSubmissions || stats.approvedSubmissions.length === 0) ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm">No approved submissions yet</p>
                    <p className="text-xs text-slate-400 mt-1">Complete available tasks to start earning coins!</p>
                  </td>
                </tr>
              ) : (
                stats.approvedSubmissions.map((sub, index) => (
                  <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                      {sub.task_title}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        <Coins className="w-3.5 h-3.5" />
                        {sub.payable_amount} coins
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      {sub.buyer_name || 'Buyer'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approved
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkerHome;
