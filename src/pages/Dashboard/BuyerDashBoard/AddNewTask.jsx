import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Plus, Coins, Calendar, Users, FileText, Image as ImageIcon, ArrowRight } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router';

const AddNewTask = () => {
  const { user, coins, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    task_title: '',
    task_detail: '',
    required_workers: '',
    payable_amount: '',
    completion_date: '',
    submission_info: '',
    task_image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'required_workers' || name === 'payable_amount') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const totalPayableAmount =
    (parseInt(formData.required_workers) || 0) * (parseInt(formData.payable_amount) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (totalPayableAmount <= 0) {
      Swal.fire('Invalid Input', 'Required workers and payable amount must be greater than zero.', 'warning');
      return;
    }

    if (totalPayableAmount > (coins || 0)) {
      Swal.fire({
        title: 'Insufficient Coins',
        text: `This task requires ${totalPayableAmount} coins, but your balance is ${coins || 0} coins. Please top up your wallet.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Purchase Coins Now',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/dashboard/purchase');
        }
      });
      return;
    }

    setLoading(true);
    const newTask = {
      ...formData,
      buyer_email: user?.email,
      buyer_name: user?.displayName || user?.name || 'Buyer',
      buyer_id: user?.uid || user?.id,
      total_cost: totalPayableAmount,
      status: 'active',
      created_date: new Date().toISOString(),
    };

    try {
      // 1. Create Task
      const taskRes = await axiosSecure.post(`/api/tasks`, newTask);

      // 2. Deduct Coins
      if (taskRes.data?.insertedId || taskRes.status === 201) {
        await axiosSecure.patch(
          `/api/users/coins/${user?.email}`,
          { coins: (coins || 0) - totalPayableAmount }
        );

        if (typeof fetchUser === 'function') {
          await fetchUser();
        }

        Swal.fire({
          icon: 'success',
          title: 'Task Created & Funded!',
          text: `Task published and ${totalPayableAmount} coins deposited into escrow.`,
          timer: 2000,
          showConfirmButton: false,
        });

        navigate('/dashboard/my-tasks');
      }
    } catch (err) {
      console.error("Task creation error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while publishing the task.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-black">Publish New Campaign</h1>
        <p className="mt-1 text-white/80 text-xs sm:text-sm">
          Distribute your tasks to thousands of active workers with automatic escrow payouts.
        </p>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Image URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                name="task_title"
                value={formData.task_title}
                onChange={handleChange}
                placeholder="e.g., Download App & Leave Honest Review"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Task Cover Image URL (Optional)
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  name="task_image_url"
                  value={formData.task_image_url}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Detailed Task Instructions *
            </label>
            <textarea
              name="task_detail"
              value={formData.task_detail}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Step-by-step requirements for workers to follow..."
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Numerical Config: Workers, Pay, Completion */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Required Workers *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  name="required_workers"
                  value={formData.required_workers}
                  onChange={handleChange}
                  min={1}
                  required
                  placeholder="e.g. 50"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Coins Per Worker *
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  name="payable_amount"
                  value={formData.payable_amount}
                  onChange={handleChange}
                  min={1}
                  required
                  placeholder="e.g. 10"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Completion Deadline *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  name="completion_date"
                  value={formData.completion_date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Submission Info */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Submission Proof Requirements *
            </label>
            <textarea
              name="submission_info"
              value={formData.submission_info}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Specify what proof worker must submit (e.g., screenshot link, username, order ID)..."
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Escrow Cost Card */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                  Total Escrow Cost: {totalPayableAmount} Coins (${(totalPayableAmount / 20).toFixed(2)})
                </span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Your available balance: {coins || 0} Coins
              </p>
            </div>
            {totalPayableAmount > (coins || 0) && (
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Insufficient coins (need {totalPayableAmount - (coins || 0)} more)
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-xl shadow-primary/25 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>{loading ? 'Publishing Task...' : 'Publish Task to Marketplace'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewTask;
