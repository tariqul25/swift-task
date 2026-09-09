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
  ShieldCheck,
  Eye,
  X,
  Trash2,
  Calendar,
  Wallet,
  FileText,
  DollarSign,
  AlertTriangle
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
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('withdrawals'); // 'withdrawals' or 'tasks'
  const [selectedTask, setSelectedTask] = useState(null);

  const axiosSecure = useAxiosSecure();

  const fetchStats = async () => {
    try {
      const res = await axiosSecure.get(`/api/admin/stats`);
      setStats(res.data || {});
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await axiosSecure.get(`/api/pending/withdrawals`);
      setWithdrawals(res.data || []);
    } catch (err) {
      console.error('Failed to fetch pending withdrawals:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axiosSecure.get(`/api/tasks`);
      setTasks(res.data || []);
    } catch (err) {
      console.error('Failed to fetch buyer tasks:', err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.allSettled([fetchStats(), fetchWithdrawals(), fetchTasks()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- Withdrawal Handlers (Admin Approves/Rejects Worker Cashouts) ---
  const handleApproveWithdrawal = async (id, workerName, amount) => {
    const confirm = await Swal.fire({
      title: 'Approve Payout?',
      text: `Confirm payout to ${workerName} for $${amount}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Confirm Payout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10B981',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/api/withdrawals/approve/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'Withdrawal Approved!',
          text: `Payment of $${amount} has been approved and marked successful.`,
          timer: 2000,
          showConfirmButton: false,
        });
        fetchWithdrawals();
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
      text: `Are you sure you want to reject the withdrawal for ${workerName}? The deducted coins will be refunded back to the worker.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject & Refund',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/api/withdrawals/reject/${id}`);
        if (res.data?.success) {
          Swal.fire({
            icon: 'info',
            title: 'Withdrawal Rejected',
            text: 'Request has been rejected and coins were refunded to the worker.',
            timer: 2000,
            showConfirmButton: false,
          });
          fetchWithdrawals();
          fetchStats();
        }
      } catch (err) {
        console.error('Rejection failed:', err);
        Swal.fire('Error', 'Failed to reject request.', 'error');
      }
    }
  };

  // --- Task Handlers (Admin Manages/Deletes Buyer Tasks) ---
  const handleDeleteTask = async (taskId, title) => {
    const confirm = await Swal.fire({
      title: 'Delete Buyer Task?',
      text: `Are you sure you want to permanently remove "${title}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Task',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/api/tasks/${taskId}`);
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        if (selectedTask?._id === taskId) setSelectedTask(null);
        Swal.fire({
          icon: 'success',
          title: 'Task Removed',
          text: 'Buyer task has been deleted from platform.',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchStats();
      } catch (err) {
        console.error('Failed to delete task:', err);
        Swal.fire('Error', 'Failed to delete task.', 'error');
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
      badge: 'Work Providers',
    },
    {
      title: 'Buyer Tasks Posted',
      value: stats.totalTasks || 0,
      icon: CheckCircle2,
      bgLight: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      badge: 'Active Work Pool',
    },
    {
      title: 'Payments Processed',
      value: stats.totalPayments || 0,
      icon: CreditCard,
      bgLight: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      badge: 'Total Revenue Orders',
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
            Admin Management Portal
          </h1>
          <p className="mt-2 text-white/80 text-sm leading-relaxed">
            Approve worker withdrawal requests and supervise tasks posted by buyers across the platform.
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

      {/* Main Management Section */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header & Tabs */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Operations & Approvals Center
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage pending worker withdrawals and supervise tasks posted by buyers.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            {/* Tab 1: Withdrawal Requests */}
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'withdrawals'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Worker Withdrawals</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  withdrawals.length > 0
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {withdrawals.length}
              </span>
            </button>

            {/* Tab 2: Buyer Tasks Pool */}
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Buyer Work Posts</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  tasks.length > 0
                    ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tasks.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab 1 Content: Worker Withdrawal Requests */}
        {activeTab === 'withdrawals' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Worker Details</th>
                  <th className="py-3.5 px-6 font-semibold">Coins Requested</th>
                  <th className="py-3.5 px-6 font-semibold">USD Payout Amount</th>
                  <th className="py-3.5 px-6 font-semibold">Payout Gateway</th>
                  <th className="py-3.5 px-6 font-semibold">Account / Phone Number</th>
                  <th className="py-3.5 px-6 font-semibold">Request Date</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-14 text-center text-slate-400 dark:text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2.5 opacity-80" />
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          Withdrawal queue is clear!
                        </p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm">
                          When workers request cashouts, they will appear here for you to approve payment or reject and refund coins.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((w) => {
                    const dollarVal = w.withdrawal_amount
                      ? Number(w.withdrawal_amount).toFixed(2)
                      : (Number(w.withdrawal_coin || 0) / 20).toFixed(2);
                    return (
                      <tr
                        key={w._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {w.worker_name || 'Worker'}
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            {w.worker_email}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                            <Coins className="w-3.5 h-3.5" />
                            {Number(w.withdrawal_coin || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400">
                          ${dollarVal}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60">
                            {w.payment_system || 'bKash'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {w.account_number}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {w.withdraw_date
                            ? new Date(w.withdraw_date).toLocaleDateString()
                            : 'Recent'}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleApproveWithdrawal(
                                w._id,
                                w.worker_name || w.worker_email,
                                dollarVal
                              )
                            }
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve Payout
                          </button>
                          <button
                            onClick={() =>
                              handleRejectWithdrawal(
                                w._id,
                                w.worker_name || w.worker_email
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject & Refund
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2 Content: Buyer Tasks Pool (Only Buyer Posted Work Shows Here) */}
        {activeTab === 'tasks' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Task Title</th>
                  <th className="py-3.5 px-6 font-semibold">Posted By (Buyer)</th>
                  <th className="py-3.5 px-6 font-semibold">Reward / Worker</th>
                  <th className="py-3.5 px-6 font-semibold">Workers Needed</th>
                  <th className="py-3.5 px-6 font-semibold">Deadline</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-14 text-center text-slate-400 dark:text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Briefcase className="w-12 h-12 text-indigo-400 mb-2.5 opacity-80" />
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          No buyer tasks found!
                        </p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm">
                          When buyers create and post micro-tasks, they will be listed here for administrative oversight.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                          {task.task_title}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                          {task.task_detail}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                          {task.buyer_name || 'Buyer'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {task.buyer_email || task.user_email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                          <Coins className="w-3.5 h-3.5" />
                          {task.payable_amount}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          {task.required_workers} slots
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {task.completion_date || 'No deadline'}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id, task.task_title)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-800/60 transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Delete Buyer Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
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

      {/* Buyer Task Inspection Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Buyer Task Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Task Title
                </label>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedTask.task_title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block">Reward per Worker</span>
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                    <Coins className="w-3.5 h-3.5" />
                    {selectedTask.payable_amount} Coins
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block">Worker Slots</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {selectedTask.required_workers} positions
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Posted By Buyer
                </label>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 font-mono">
                  {selectedTask.buyer_name || 'Buyer'} ({selectedTask.buyer_email || selectedTask.user_email})
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Completion Deadline
                </label>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {selectedTask.completion_date || 'No deadline specified'}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Task Detail & Instructions
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedTask.task_detail || 'No description provided.'}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Submission Requirement
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedTask.submission_info || 'Provide screenshot or text proof.'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleDeleteTask(selectedTask._id, selectedTask.task_title)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
