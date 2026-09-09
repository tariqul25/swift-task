import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
  Users,
  Briefcase,
  Coins,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Eye,
  X,
  Send,
  Calendar,
  User,
  Mail
} from 'lucide-react';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayments: 0,
    totalTasks: 0,
  });
  const [withdrawals, setWithdrawals] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' or 'withdrawals'
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const axiosSecure = useAxiosSecure();

  const fetchStats = async () => {
    try {
      const res = await axiosSecure.get(`/api/admin/stats`);
      setStats(res.data || {});
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  };

  const fetchPending = async () => {
    try {
      const [withRes, subRes] = await Promise.allSettled([
        axiosSecure.get(`/api/pending/withdrawals`),
        axiosSecure.get(`/api/admin/pending-submissions`),
      ]);

      const wData = withRes.status === 'fulfilled' ? withRes.value.data || [] : [];
      const sData = subRes.status === 'fulfilled' ? subRes.value.data || [] : [];

      setWithdrawals(wData);
      setSubmissions(sData);

      // Default to whichever has pending items
      if (sData.length > 0 && wData.length === 0) {
        setActiveTab('submissions');
      } else if (wData.length > 0 && sData.length === 0) {
        setActiveTab('withdrawals');
      }
    } catch (err) {
      console.error('Failed to fetch pending items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPending();
  }, []);

  // --- Withdrawal Handlers ---
  const handleApproveWithdrawal = async (id, workerName, amount) => {
    const confirm = await Swal.fire({
      title: 'Approve Payout?',
      text: `Confirm payment payout to ${workerName} for $${amount}? Worker coins will be deducted automatically.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Confirm Payout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10B981',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/api/withdrawals/approve/${id}`);
        Swal.fire('Approved!', 'Withdrawal marked as successful and coins deducted.', 'success');
        fetchPending();
        fetchStats();
      } catch (err) {
        console.error('Approval failed:', err);
        Swal.fire('Error', 'Failed to approve withdrawal.', 'error');
      }
    }
  };

  const handleRejectWithdrawal = async (id, workerName) => {
    const confirm = await Swal.fire({
      title: 'Reject Withdrawal?',
      text: `Are you sure you want to reject the withdrawal request for ${workerName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/api/withdrawals/reject/${id}`);
        if (res.data?.success) {
          Swal.fire('Rejected', 'Withdrawal request has been removed.', 'success');
          fetchPending();
        }
      } catch (err) {
        console.error('Rejection failed:', err);
        Swal.fire('Error', 'Failed to reject request.', 'error');
      }
    }
  };

  // --- Submission Handlers ---
  const handleApproveSubmission = async (sub) => {
    const confirm = await Swal.fire({
      title: 'Approve Submission?',
      text: `Approve "${sub.task_title}" by ${sub.worker_name || sub.worker_email}? ${sub.payable_amount} coins will be credited to the worker.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve & Reward',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10B981',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/api/submissions/approve/${sub._id}`, {
          workerEmail: sub.worker_email,
          coins: sub.payable_amount,
        });
        Swal.fire('Approved!', 'Submission approved and reward coins granted to worker.', 'success');
        setSelectedSubmission(null);
        fetchPending();
        fetchStats();
      } catch (err) {
        console.error('Submission approval failed:', err);
        Swal.fire('Error', 'Failed to approve submission.', 'error');
      }
    }
  };

  const handleRejectSubmission = async (sub) => {
    const confirm = await Swal.fire({
      title: 'Reject Submission?',
      text: `Reject "${sub.task_title}" submission by ${sub.worker_name || sub.worker_email}? Task vacancy will be restored for other workers.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/api/submissions/reject/${sub._id}`, {
          taskId: sub.task_id,
        });
        Swal.fire('Rejected', 'Submission rejected and task slot restored.', 'success');
        setSelectedSubmission(null);
        fetchPending();
        fetchStats();
      } catch (err) {
        console.error('Submission rejection failed:', err);
        Swal.fire('Error', 'Failed to reject submission.', 'error');
      }
    }
  };

  const statCards = [
    {
      title: 'Active Workers',
      value: stats.totalWorkers || 0,
      icon: Users,
      bgLight: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      badge: 'Registered Talent',
    },
    {
      title: 'Active Buyers',
      value: stats.totalBuyers || 0,
      icon: Briefcase,
      bgLight: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      badge: 'Task Posters',
    },
    {
      title: 'Total Tasks Created',
      value: stats.totalTasks || 0,
      icon: CheckCircle2,
      bgLight: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      badge: 'Platform Pool',
    },
    {
      title: 'Payments Processed',
      value: stats.totalPayments || 0,
      icon: CreditCard,
      bgLight: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      badge: 'Coin Orders',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            Executive Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            System Control Center
          </h1>
          <p className="mt-2 text-white/80 text-sm leading-relaxed">
            Monitor real-time network activity, review worker submissions, and oversee escrow payouts.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.bgLight}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {Number(card.value).toLocaleString()}
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {card.badge}
            </div>
          </div>
        ))}
      </div>

      {/* Pending Queues Section */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header & Tabs */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Pending Approvals & Review Center
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review and act on pending task submissions and worker cashout requests.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'submissions'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Task Submissions</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                submissions.length > 0
                  ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {submissions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'withdrawals'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>Withdrawal Requests</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                withdrawals.length > 0
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {withdrawals.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content: Task Submissions */}
        {activeTab === 'submissions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Worker Details</th>
                  <th className="py-3.5 px-6 font-semibold">Task Title</th>
                  <th className="py-3.5 px-6 font-semibold">Payable Coins</th>
                  <th className="py-3.5 px-6 font-semibold">Buyer Email</th>
                  <th className="py-3.5 px-6 font-semibold">Submitted Date</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 dark:text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2 opacity-80" />
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          No pending submissions!
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          All worker submissions have been reviewed and approved or rejected.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {sub.worker_name || 'Worker'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {sub.worker_email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-slate-800 dark:text-slate-200 max-w-[220px] truncate block" title={sub.task_title}>
                          {sub.task_title}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 font-extrabold text-amber-600 dark:text-amber-400">
                          <Coins className="w-3.5 h-3.5" />
                          {sub.payable_amount}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400">
                        {sub.buyer_email || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {sub.current_date ? new Date(sub.current_date).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleApproveSubmission(sub)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectSubmission(sub)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Withdrawal Requests */}
        {activeTab === 'withdrawals' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Worker Details</th>
                  <th className="py-3.5 px-6 font-semibold">Coins Requested</th>
                  <th className="py-3.5 px-6 font-semibold">USD Value</th>
                  <th className="py-3.5 px-6 font-semibold">Payout Gateway</th>
                  <th className="py-3.5 px-6 font-semibold">Account Details</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 dark:text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2 opacity-80" />
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Withdrawal queue is clear!
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          No pending worker cashout requests awaiting approval.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((w) => (
                    <tr key={w._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {w.worker_name || 'Worker'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {w.worker_email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                          <Coins className="w-3.5 h-3.5" />
                          {w.withdrawal_coin}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-emerald-600 dark:text-emerald-400">
                        ${w.withdrawal_amount ? Number(w.withdrawal_amount).toFixed(2) : (w.withdrawal_coin / 20).toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {w.payment_system}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {w.account_number}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleApproveWithdrawal(w._id, w.worker_name, w.withdrawal_amount || (w.withdrawal_coin / 20).toFixed(2))}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                        >
                          Approve (Payment Success)
                        </button>
                        <button
                          onClick={() => handleRejectWithdrawal(w._id, w.worker_name)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Worker Submission Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Task Title</label>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedSubmission.task_title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block">Worker Name</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {selectedSubmission.worker_name || 'Worker'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block">Reward Coins</span>
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    {selectedSubmission.payable_amount}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Worker Email</label>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 font-mono">
                  {selectedSubmission.worker_email}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Buyer Email</label>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 font-mono">
                  {selectedSubmission.buyer_email || 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Submitted Proof / Work</label>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedSubmission.submission_details || 'No details provided.'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => handleRejectSubmission(selectedSubmission)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Reject Submission
              </button>
              <button
                onClick={() => handleApproveSubmission(selectedSubmission)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Approve & Pay Coins
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
