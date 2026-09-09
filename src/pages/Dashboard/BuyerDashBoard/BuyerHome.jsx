import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
  Briefcase,
  Users,
  Coins,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

const BuyerHome = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    totalPayments: 0,
  });
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch buyer stats
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/api/buyer-stats?email=${user.email}`)
        .then((res) => {
          setStats(res.data || {});
        })
        .catch((err) => console.error('Stats fetch error:', err));
    }
  }, [user]);

  // Fetch pending worker submissions
  const fetchSubmissions = () => {
    if (!user?.email) return;
    axiosSecure.get(`/api/worker-submission/pending/${user.email}`)
      .then((res) => {
        setSubmissions(res.data || []);
      })
      .catch((err) => console.error('Submission fetch error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  // Approve Submission
  const handleApprove = async (submissionId, workerEmail, coinsAmount) => {
    const confirm = await Swal.fire({
      title: 'Approve Submission?',
      text: `Approve work and credit ${coinsAmount} coins to ${workerEmail}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve Work',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10B981',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/api/submissions/approve/${submissionId}`, {
          workerEmail,
          coins: coinsAmount,
        });
        if (res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Approved!',
            text: 'Coins have been disbursed to worker.',
            timer: 1500,
            showConfirmButton: false,
          });
          setSubmissions((prev) => prev.filter((s) => s._id !== submissionId));
          if (selectedSubmission?._id === submissionId) setSelectedSubmission(null);
        }
      } catch (err) {
        console.error('Approval failed:', err);
        Swal.fire('Error', 'Failed to approve submission.', 'error');
      }
    }
  };

  // Reject Submission
  const handleReject = async (submissionId, taskId) => {
    const confirm = await Swal.fire({
      title: 'Reject Submission?',
      text: 'Rejecting this submission will open up a worker slot again.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject Work',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(
          `/api/submissions/reject/${submissionId}`,
          { taskId }
        );

        if (res.data?.success) {
          Swal.fire({
            icon: 'info',
            title: 'Submission Rejected',
            timer: 1500,
            showConfirmButton: false,
          });
          setSubmissions((prev) => prev.filter((s) => s._id !== submissionId));
          if (selectedSubmission?._id === submissionId) setSelectedSubmission(null);
        } else {
          Swal.fire('Error', res.data?.message || 'Failed to reject submission.', 'error');
        }
      } catch (err) {
        console.error('Rejection failed:', err);
        Swal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-3">
            <Briefcase className="w-3.5 h-3.5 text-amber-300" />
            Employer Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Buyer Dashboard Overview
          </h1>
          <p className="mt-2 text-white/80 text-sm leading-relaxed">
            Manage your campaigns, inspect worker submissions, and disburse coin payments.
          </p>
        </div>
      </div>

      {/* Buyer Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Tasks Posted</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.totalTasks || 0}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Submissions to Review</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {submissions.length}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Coins Spent</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {Number(stats.totalPayments || 0).toLocaleString()} <span className="text-sm font-normal text-slate-400">coins</span>
            </p>
          </div>
        </div>
      </div>

      {/* Submissions Review Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Pending Submissions Awaiting Approval
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Validate proof of work submitted by freelance workers.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Worker</th>
                <th className="py-3.5 px-6 font-semibold">Task Title</th>
                <th className="py-3.5 px-6 font-semibold">Payable Reward</th>
                <th className="py-3.5 px-6 font-semibold">Submission Proof</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-80" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">All caught up!</p>
                    <p className="text-xs text-slate-400 mt-0.5">No pending worker submissions to review at this moment.</p>
                  </td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {s.worker_name || 'Worker'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {s.worker_email}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {s.task_title}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Coins className="w-3.5 h-3.5" />
                        {s.payable_amount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedSubmission(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Proof</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleApprove(s._id, s.worker_email, s.payable_amount)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(s._id, s.task_id)}
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

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg relative shadow-2xl">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Submission Proof Details
            </h3>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p><strong>Worker:</strong> {selectedSubmission.worker_name} ({selectedSubmission.worker_email})</p>
              <p><strong>Task Title:</strong> {selectedSubmission.task_title}</p>
              <p><strong>Reward Amount:</strong> {selectedSubmission.payable_amount} Coins</p>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Worker's Submitted Proof:</p>
                <p className="text-slate-900 dark:text-white whitespace-pre-line text-sm leading-relaxed">
                  {selectedSubmission.submission_details || 'No detailed proof text provided.'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleReject(selectedSubmission._id, selectedSubmission.task_id)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedSubmission._id, selectedSubmission.worker_email, selectedSubmission.payable_amount)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Approve & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerHome;
