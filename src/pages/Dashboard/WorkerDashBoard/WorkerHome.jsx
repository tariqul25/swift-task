import React, { useState, useEffect } from 'react';
import {
  Clock,
  Coins,
  FileText,
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Eye,
  X,
  Calendar,
  User,
  Mail,
  Filter
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
    approvedSubmissions: [],
    pendingList: [],
    allSubmissions: [],
  });
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'earnings'
  const [selectedSub, setSelectedSub] = useState(null);
  const [loading, setLoading] = useState(true);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/api/worker-stats/${user.email}`)
      .then(res => {
        const data = res.data || {};
        setStats({
          totalSubmissions: data.totalSubmissions || 0,
          pendingSubmissions: data.pendingSubmissions || 0,
          totalEarning: data.totalEarning || 0,
          approvedSubmissions: data.approvedSubmissions || [],
          pendingList: data.pendingList || [],
          allSubmissions: data.allSubmissions || data.approvedSubmissions || [],
        });
      })
      .catch(err => console.error('Failed to load worker stats', err))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Pending Approval
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Determine which list to display based on activeTab
  let displayList = stats.allSubmissions;
  let tabTitle = 'All Submissions History';
  let tabSubtitle = 'Showing all task submissions submitted by you.';
  let tabBadgeColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400';

  if (activeTab === 'pending') {
    displayList = stats.pendingList && stats.pendingList.length > 0
      ? stats.pendingList
      : stats.allSubmissions.filter(s => s.status === 'pending');
    tabTitle = 'Pending Approvals Awaiting Review';
    tabSubtitle = 'Submissions awaiting buyer verification and payment release.';
    tabBadgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
  } else if (activeTab === 'earnings') {
    displayList = stats.approvedSubmissions && stats.approvedSubmissions.length > 0
      ? stats.approvedSubmissions
      : stats.allSubmissions.filter(s => s.status === 'approved');
    tabTitle = 'Approved Submissions & Coin Earnings';
    tabSubtitle = 'Verified submissions that successfully credited coins to your wallet.';
    tabBadgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  }

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
            Click any metric card below to filter and inspect your total submissions, pending approvals, and coin earnings.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Link
              to="/dashboard/task-list"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-md hover:bg-slate-100 transition-colors"
            >
              <span>Browse Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/dashboard/my-submission"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs backdrop-blur-md transition-colors"
            >
              <span>All Submissions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Stats Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Interactive Overview (Click to View Items Below)
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
            Active: {activeTab === 'all' ? 'All Submissions' : activeTab === 'pending' ? 'Pending Approvals' : 'Total Earnings'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Total Submissions */}
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border text-left transition-all cursor-pointer group relative overflow-hidden ${
              activeTab === 'all'
                ? 'border-blue-500 shadow-lg shadow-blue-500/15 ring-2 ring-blue-500/30 -translate-y-0.5'
                : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-900/60 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {activeTab === 'all' ? 'Viewing' : 'Click to View'}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Submissions</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {stats.totalSubmissions || 0}
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-2 flex items-center gap-1">
              <span>View full list</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </p>
          </button>

          {/* Card 2: Pending Approvals */}
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border text-left transition-all cursor-pointer group relative overflow-hidden ${
              activeTab === 'pending'
                ? 'border-amber-500 shadow-lg shadow-amber-500/15 ring-2 ring-amber-500/30 -translate-y-0.5'
                : 'border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-900/60 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'pending' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {activeTab === 'pending' ? 'Viewing' : 'Click to View'}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Approvals</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {stats.pendingSubmissions || 0}
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-2 flex items-center gap-1">
              <span>View pending reviews</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </p>
          </button>

          {/* Card 3: Total Earnings */}
          <button
            type="button"
            onClick={() => setActiveTab('earnings')}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border text-left transition-all cursor-pointer group relative overflow-hidden ${
              activeTab === 'earnings'
                ? 'border-emerald-500 shadow-lg shadow-emerald-500/15 ring-2 ring-emerald-500/30 -translate-y-0.5'
                : 'border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-900/60 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Coins className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'earnings' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {activeTab === 'earnings' ? 'Viewing' : 'Click to View'}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Earnings</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {Number(stats.totalEarning || 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">coins</span>
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
              <span>View approved earnings</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </p>
          </button>
        </div>
      </div>

      {/* Dynamic Submissions Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${tabBadgeColor}`}>
                {activeTab === 'pending' ? <Clock className="w-5 h-5" /> : activeTab === 'earnings' ? <Coins className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {tabTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {tabSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {displayList.length} Items Found
            </span>
            <Link
              to="/dashboard/my-submission"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Task Title</th>
                <th className="py-3.5 px-6 font-semibold">Reward Credited</th>
                <th className="py-3.5 px-6 font-semibold">Buyer Name</th>
                <th className="py-3.5 px-6 font-semibold">Submitted Date</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {displayList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-14 text-center text-slate-400">
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600 opacity-60" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No records in this category
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {activeTab === 'pending'
                        ? 'You have no pending approvals awaiting review.'
                        : activeTab === 'earnings'
                        ? 'No approved earnings yet. Complete tasks to get rewarded!'
                        : 'No task submissions found.'}
                    </p>
                  </td>
                </tr>
              ) : (
                displayList.map((sub, index) => (
                  <tr
                    key={sub._id || index}
                    onClick={() => setSelectedSub(sub)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white max-w-xs truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {sub.task_title}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Coins className="w-3.5 h-3.5" />
                        {sub.payable_amount} coins
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      {sub.buyer_name || 'Buyer'}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(sub.current_date)}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSub(sub);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-500" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Details Modal */}
      {selectedSub && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Submission Details
                  </h3>
                  <p className="text-[11px] text-slate-400">Review status and submitted proof</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Task Title
                </span>
                <p className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedSub.task_title}
                </p>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                selectedSub.status === 'approved'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300'
                  : selectedSub.status === 'rejected'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300'
              }`}>
                <div className="flex items-center gap-3">
                  {selectedSub.status === 'approved' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  ) : selectedSub.status === 'rejected' ? (
                    <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  ) : (
                    <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  )}
                  <div>
                    <span className="text-xs font-bold block uppercase tracking-wider">
                      Status: {selectedSub.status || 'Pending Review'}
                    </span>
                    <span className="text-[11px] opacity-80">
                      {selectedSub.status === 'approved'
                        ? 'Great work! Coins have been credited to your wallet balance.'
                        : selectedSub.status === 'rejected'
                        ? 'The buyer has rejected this submission.'
                        : 'Awaiting buyer review. You will receive an alert once approved.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block mb-1">Reward Value</span>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    {selectedSub.payable_amount} Coins (${(Number(selectedSub.payable_amount || 0) / 20).toFixed(2)})
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block mb-1">Submitted On</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDate(selectedSub.current_date)}
                  </span>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Task Buyer</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedSub.buyer_name || 'Buyer'}
                  </span>
                </div>
                {selectedSub.buyer_email && (
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {selectedSub.buyer_email}
                  </span>
                )}
              </div>

              {/* Proof of Work */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Your Submitted Proof of Work
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-mono">
                  {selectedSub.submission_details || 'No text proof provided.'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedSub(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerHome;
