import React, { useEffect, useState } from 'react';
import { Trash2, ListChecks, Coins, Calendar, Users, FileText } from 'lucide-react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const fetchTasks = async () => {
    try {
      const res = await axiosSecure.get(`/api/tasks`);
      setTasks(res.data || []);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteTask = async (taskId, title) => {
    const confirm = await Swal.fire({
      title: 'Delete Task?',
      text: `Are you sure you want to remove "${title}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Task',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/api/tasks/${taskId}`);
        setTasks(prev => prev.filter(t => t._id !== taskId));
        Swal.fire({
          icon: 'success',
          title: 'Task Deleted',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Failed to delete task', error);
        Swal.fire('Error', 'Failed to delete task', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ListChecks className="w-6 h-6 text-primary" />
            Manage Active Task Pool
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Audit public worker tasks, inspect descriptions, and remove non-compliant listings.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light text-xs font-bold">
          {tasks.length} Total Tasks
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Task Title</th>
                <th className="py-3.5 px-6 font-semibold">Buyer</th>
                <th className="py-3.5 px-6 font-semibold">Reward / Slot</th>
                <th className="py-3.5 px-6 font-semibold">Workers</th>
                <th className="py-3.5 px-6 font-semibold">Deadline</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No active tasks currently listed.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                        {task.task_title}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                        {task.task_detail}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs font-medium text-slate-900 dark:text-white">
                        {task.buyer_name || 'Buyer'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {task.buyer_email}
                      </div>
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
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {task.completion_date || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteTask(task._id, task.task_title)}
                        className="p-2 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-colors cursor-pointer"
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
    </div>
  );
};

export default ManageTasks;
