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
  AlertCircle
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
  const [loading, setLoading] = useState(true);
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
      const res = await axiosSecure.get(`/api/pending/withdrawals`);
      setWithdrawals(res.data || []);
    } catch (err) {
      console.error('Failed to fetch pending withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPending();
  }, []);

  const handleApprove = async (id, workerName, amount) => {
    const confirm = await Swal.fire({
      title: 'Approve Withdrawal?',
      text: `Approve payout for ${workerName} ($${amount})? Worker coins will be deducted automatically.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve Payout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10B981',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/api/withdrawals/approve/${id}`);
        Swal.fire('Approved!', 'Withdrawal approved successfully.', 'success');
        fetchPending();
        fetchStats();
      } catch (err) {
        console.error('Approval failed:', err);
        Swal.fire('Error', 'Something went wrong while approving.', 'error');
      }
    }
  };

  const handleReject = async (id, workerName) => {
    const confirm = await Swal.fire({
      title: 'Reject Request?',
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
        if (res.data.success) {
          Swal.fire('Rejected', 'Withdrawal request has been removed.', 'success');
          fetchPending();
        }
      } catch (err) {
        console.error('Rejection failed:', err);
        Swal.fire('Error', 'Failed to reject request.', 'error');
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
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            Executive Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            System Control Center
          </h1>
          <p className="mt-2 text-white/80 text-sm leading-relaxed">
            Monitor real-time network activity, manage escrow payouts, and oversee user roles.
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

      {/* Pending Withdrawals Queue */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Pending Worker Withdrawal Requests
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review and disburse escrow funds for worker coin cashouts.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            {withdrawals.length} Pending Requests
          </span>
        </div>

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
                        Queue is completely clear!
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        No pending withdrawal requests awaiting approval.
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
                        onClick={() => handleApprove(w._id, w.worker_name, w.withdrawal_amount || (w.withdrawal_coin / 20).toFixed(2))}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(w._id, w.worker_name)}
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
      </div>
    </div>
  );
};

export default AdminHome;
