import React, { useState, useEffect, useContext } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, FileText, ChevronLeft, ChevronRight, Coins } from 'lucide-react';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MySubmissions = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    axiosSecure
      .get(`/api/submissions/${user.email}?page=${currentPage}&limit=${submissionsPerPage}`)
      .then(res => {
        setSubmissions(res.data?.submissions || []);
        setTotalPages(Math.ceil((res.data?.totalCount || 0) / submissionsPerPage) || 1);
      })
      .catch(err => {
        console.error('Failed to fetch submissions:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, currentPage]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-primary" />
            My Task Submissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track validation statuses and coin payouts from buyer reviews.
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Task Title</th>
                <th className="py-3.5 px-6 font-semibold">Buyer Name</th>
                <th className="py-3.5 px-6 font-semibold">Submitted On</th>
                <th className="py-3.5 px-6 font-semibold">Payable Reward</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold">Submission Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="mt-3 text-xs">Loading submission records...</p>
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No submissions found. Browse tasks to get started!
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub._id || sub.task_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {sub.task_title}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      {sub.buyer_name || 'Buyer'}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(sub.current_date)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Coins className="w-3.5 h-3.5" />
                        {sub.payable_amount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate font-mono">
                      {sub.submission_details || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;
