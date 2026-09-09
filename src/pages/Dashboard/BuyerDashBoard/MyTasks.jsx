import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { ListFilter, Edit3, Trash2, X, Coins, Users, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router';

const MyTasks = () => {
  const { user, updateUserCoins } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const fetchTasks = async () => {
    if (!user?.email) return;
    try {
      const res = await axiosSecure.get(`/api/tasks/user/${user.email}`);
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.completion_date) - new Date(a.completion_date)
      );
      setTasks(sorted);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.patch(`/api/tasks/${editingTask._id}`, {
        task_title: editingTask.task_title,
        task_detail: editingTask.task_detail,
        submission_info: editingTask.submission_info,
      });
      Swal.fire({
        icon: 'success',
        title: 'Task Updated!',
        timer: 1500,
        showConfirmButton: false,
      });
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
      Swal.fire('Error!', 'Failed to update task.', 'error');
    }
  };

  const handleDelete = async (task) => {
    const confirm = await Swal.fire({
      title: 'Delete Task?',
      text: `Are you sure you want to cancel and delete "${task.task_title}"? Unused escrow coins will be refunded.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Task',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/api/tasks/${task._id}`);
      Swal.fire('Deleted!', 'Task deleted and remaining coins refunded.', 'success');
      if (typeof updateUserCoins === 'function') {
        updateUserCoins();
      }
      fetchTasks();
    } catch (err) {
      console.error(err);
      Swal.fire('Error!', 'Failed to delete task.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ListFilter className="w-6 h-6 text-primary" />
            My Posted Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track active task slots, edit guidelines, or cancel campaigns.
          </p>
        </div>
        <Link
          to="/dashboard/add-task"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Task</span>
        </Link>
      </div>

      {/* Tasks Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Task Title</th>
                <th className="py-3.5 px-6 font-semibold">Deadline</th>
                <th className="py-3.5 px-6 font-semibold">Reward / Slot</th>
                <th className="py-3.5 px-6 font-semibold">Worker Slots</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="mt-3 text-xs">Loading posted tasks...</p>
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    You haven't posted any tasks yet. Click "Post New Task" above to get started!
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                        {task.task_title}
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                        {task.task_detail}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {task.completion_date || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Coins className="w-3.5 h-3.5" />
                        {task.payable_amount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        {task.required_workers}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 capitalize">
                        {task.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit Task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setEditingTask(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Edit Campaign Details
            </h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editingTask.task_title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, task_title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Task Details *
                </label>
                <textarea
                  rows="4"
                  required
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editingTask.task_detail}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, task_detail: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Submission Info / Required Proof
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editingTask.submission_info || ''}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, submission_info: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
