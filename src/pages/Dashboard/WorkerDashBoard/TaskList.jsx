import React, { useState, useEffect } from 'react';
import {
  Coins,
  Users,
  CalendarCheck,
  Clock,
  CheckCircle,
  X,
  ArrowRight,
  Briefcase,
  Eye,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import Loading from '../../../Loading';

const TaskList = () => {
  const { user, fetchUser, updateUserCoins } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'available', 'submitted'
  const axiosSecure = useAxiosSecure();

  const fetchTasks = async () => {
    try {
      const res = await axiosSecure.get(`/api/tasks`);
      setTasks(res.data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    if (!user?.email) return;
    try {
      const res = await axiosSecure.get(`/api/submitted-task-ids/${user.email}`);
      setUserSubmissions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch user submissions:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [user?.email]);

  const getUserSubmission = (taskId) => {
    return userSubmissions.find((s) => {
      const subTaskId = typeof s === 'string' ? s : (s.task_id || s._id);
      return String(subTaskId) === String(taskId);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionDetails.trim()) {
      Swal.fire('Required', 'Please enter your proof of task completion.', 'warning');
      return;
    }

    setSubmitting(true);
    const doc = {
      task_id: selectedTask._id,
      task_title: selectedTask.task_title,
      payable_amount: Number(selectedTask.payable_amount),
      buyer_name: selectedTask.buyer_name,
      buyer_email: selectedTask.buyer_email,
      worker_email: user.email,
      worker_name: user.displayName || user.name || 'Worker',
      submission_details: submissionDetails,
      current_date: new Date().toISOString(),
      status: 'pending',
    };

    try {
      await axiosSecure.post(`/api/apply-task`, doc);
      // Update local submissions list
      setUserSubmissions((prev) => [
        ...prev.filter((s) => (s.task_id || s._id || s) !== selectedTask._id),
        doc,
      ]);

      // Decrement required slots locally
      setTasks((prev) =>
        prev.map((t) =>
          t._id === selectedTask._id
            ? { ...t, required_workers: Math.max(0, (Number(t.required_workers) || 1) - 1) }
            : t
        )
      );

      setSelectedTask(null);
      setSubmissionDetails('');

      Swal.fire({
        icon: 'success',
        title: 'Work Submitted Successfully!',
        text: 'Your submission is now pending buyer approval. Coins will be credited once approved.',
        timer: 2500,
        showConfirmButton: false,
      });

      if (typeof fetchUser === 'function') {
        fetchUser();
      }
    } catch (err) {
      console.error('Submission failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to submit task proof. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  // Filter tasks based on real submission records
  const availableTasks = tasks.filter((t) => {
    const sub = getUserSubmission(t._id);
    const isSubmittedAndActive = sub && sub.status !== 'rejected';
    return !isSubmittedAndActive && Number(t.required_workers || 0) > 0;
  });

  const submittedTasks = tasks.filter((t) => {
    const sub = getUserSubmission(t._id);
    return !!sub;
  });

  let displayTasks = tasks;
  if (filterTab === 'available') displayTasks = availableTasks;
  else if (filterTab === 'submitted') displayTasks = submittedTasks;

  const activeSubForSelected = selectedTask ? getUserSubmission(selectedTask._id) : null;
  const isSelectedAlreadySubmitted =
    activeSubForSelected && activeSubForSelected.status !== 'rejected';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Task Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse available micro-tasks, submit required proof, and earn instant coin payouts upon review.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilterTab('available')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              filterTab === 'available'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Available ({availableTasks.length})
          </button>
          <button
            onClick={() => setFilterTab('submitted')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              filterTab === 'submitted'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Submitted by You ({submittedTasks.length})
          </button>
        </div>
      </div>

      {/* Task Grid */}
      {displayTasks.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-3 opacity-80" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Tasks in this View</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filterTab === 'submitted'
              ? 'You have not submitted work for any tasks yet.'
              : 'All available task slots have been claimed. Check back soon for new buyer postings!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTasks.map((task) => {
            const userSub = getUserSubmission(task._id);
            const status = userSub?.status;

            return (
              <div
                key={task._id}
                className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group ${
                  status === 'approved'
                    ? 'border-emerald-400/40 dark:border-emerald-500/30'
                    : status === 'pending'
                    ? 'border-amber-400/40 dark:border-amber-500/30'
                    : status === 'rejected'
                    ? 'border-rose-400/40 dark:border-rose-500/30'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                <div>
                  {/* Status Banner */}
                  {status === 'approved' ? (
                    <div className="mb-3 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Approved & Paid (+{task.payable_amount} Coins)
                      </span>
                      <span className="text-[10px] opacity-75">{task.required_workers} slots left</span>
                    </div>
                  ) : status === 'pending' ? (
                    <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        You Submitted (Pending Review)
                      </span>
                      <span className="text-[10px] opacity-75">{task.required_workers} slots left</span>
                    </div>
                  ) : status === 'rejected' ? (
                    <div className="mb-3 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400">
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        Rejected (Re-apply Available)
                      </span>
                      <span className="text-[10px] opacity-75">{task.required_workers} slots left</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80">
                        <Coins className="w-3.5 h-3.5 fill-current" />
                        {task.payable_amount} Coins
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                        <Users className="w-3.5 h-3.5" />
                        {task.required_workers} slots open
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {task.task_title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed">
                    {task.task_detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: {task.completion_date}</span>
                    </div>
                    <p className="mt-0.5 font-medium truncate max-w-[120px] text-slate-700 dark:text-slate-300">
                      {task.buyer_name || 'Buyer'}
                    </p>
                  </div>

                  {status === 'approved' ? (
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Approved Work</span>
                    </button>
                  ) : status === 'pending' ? (
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>View Submission</span>
                    </button>
                  ) : status === 'rejected' ? (
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Re-apply & Submit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Apply & Submit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog for Task Detail & Submission */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 mb-3">
              <Coins className="w-3.5 h-3.5 fill-current" />
              Reward: {selectedTask.payable_amount} Coins (${(Number(selectedTask.payable_amount || 0) / 20).toFixed(2)})
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {selectedTask.task_title}
            </h2>

            {/* Check current user submission status */}
            {activeSubForSelected?.status === 'approved' ? (
              <div className="space-y-4 my-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                      Work Approved & Coins Disbursed!
                    </span>
                    <span className="text-[11px] text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed block mt-0.5">
                      Your submission was reviewed and approved. <strong>+{selectedTask.payable_amount} coins</strong> have been credited to your profile balance!
                    </span>
                  </div>
                </div>

                {activeSubForSelected.submission_details && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Your Submitted Proof:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {activeSubForSelected.submission_details}
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <p><strong>Buyer:</strong> {selectedTask.buyer_name} ({selectedTask.buyer_email})</p>
                  <p><strong>Task Deadline:</strong> {selectedTask.completion_date}</p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Link
                    to="/dashboard/my-submission"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Check in My Submissions
                  </Link>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : activeSubForSelected?.status === 'pending' ? (
              <div className="space-y-4 my-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                  <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
                      Submission Received (Pending Review)
                    </span>
                    <span className="text-[11px] text-amber-700/90 dark:text-amber-400/90 leading-relaxed block mt-0.5">
                      You have already submitted your work for this task. The buyer or platform admin is reviewing your submission. You will receive coins once approved.
                    </span>
                  </div>
                </div>

                {activeSubForSelected.submission_details && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Your Submitted Proof:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {activeSubForSelected.submission_details}
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <p><strong>Buyer:</strong> {selectedTask.buyer_name} ({selectedTask.buyer_email})</p>
                  <p><strong>Remaining Slots for Others:</strong> {selectedTask.required_workers} workers</p>
                  <p><strong>Deadline:</strong> {selectedTask.completion_date}</p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Link
                    to="/dashboard/my-submission"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Check in My Submissions
                  </Link>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                {activeSubForSelected?.status === 'rejected' && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block">
                        Previous Submission Was Rejected
                      </span>
                      <span className="text-[11px] text-rose-700/90 dark:text-rose-400/90 leading-relaxed block mt-0.5">
                        Your previous submission was not accepted. Please review the instructions carefully and submit improved proof below.
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
                  <p><strong>Buyer:</strong> {selectedTask.buyer_name} ({selectedTask.buyer_email})</p>
                  <p><strong>Deadline:</strong> {selectedTask.completion_date}</p>
                  <p><strong>Available Slots:</strong> {selectedTask.required_workers} workers</p>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white mb-1">Instructions:</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line text-xs">
                      {selectedTask.task_detail}
                    </p>
                  </div>
                  {selectedTask.submission_info && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <p className="font-semibold text-slate-900 dark:text-white mb-1">Required Proof:</p>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                        {selectedTask.submission_info}
                      </p>
                    </div>
                  )}
                </div>

                {/* Submission Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Proof of Work / Submission Details *
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={submissionDetails}
                      onChange={(e) => setSubmissionDetails(e.target.value)}
                      className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                      placeholder="Paste links, screenshots URLs, or proof text as requested by the buyer..."
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTask(null)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {submitting ? 'Submitting...' : 'Submit Work'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
