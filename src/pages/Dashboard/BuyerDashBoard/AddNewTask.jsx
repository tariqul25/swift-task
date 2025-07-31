import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Plus, DollarSign } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AddNewTask = () => {
  const { user, coins, fetchUser } = useAuth(); // 🔁 fetchUser for instant update
  const [formData, setFormData] = useState({
    task_title: '',
    task_detail: '',
    required_workers: '',
    payable_amount: '',
    completion_date: '',
    submission_info: '',
    task_image_url: ''
  });
  const axiosSecure=useAxiosSecure()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalPayableAmount =
      parseInt(formData.required_workers) * parseInt(formData.payable_amount);

    if (totalPayableAmount > (coins || 0)) {
      Swal.fire({
        title: 'Insufficient Coins',
        text: 'Not enough coins. Please purchase more.',
        icon: 'warning',
        confirmButtonText: 'Purchase Coins'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/dashboard/purchase';
        }
      });
      return;
    }

    const newTask = {
      ...formData,
      buyer_email: user?.email,
      buyer_name: user?.displayName,
      buyer_id: user?.uid || user?.id,
      total_cost: totalPayableAmount,
      status: 'active',
      created_date: new Date().toISOString(),
    };

    try {
      // ✅ 1. Create Task
      const taskRes = await axiosSecure.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
        newTask
      );

      // ✅ 2. Deduct Coins
      if (taskRes.data.insertedId) {
        await axiosSecure.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/coins/${user?.email}`,
          { coins: coins - totalPayableAmount }
        );
        // ✅ 3. Refetch user to update coin instantly
        if (typeof fetchUser === 'function') {
          await fetchUser();
        }

        Swal.fire({
          icon: 'success',
          title: 'Task Created!',
          text: 'Task created and coins deducted successfully!'
        });
      }
    } catch (err) {
      console.error("Task creation or coin update error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while creating the task.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Add New Task</h1>
        <p className="text-purple-100">Create a new task for workers to complete</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Image URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="task_title" className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
              <input
                type="text"
                id="task_title"
                name="task_title"
                value={formData.task_title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="task_image_url" className="block text-sm font-medium text-gray-700 mb-2">Task Image URL</label>
              <input
                type="url"
                id="task_image_url"
                name="task_image_url"
                value={formData.task_image_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <label htmlFor="task_detail" className="block text-sm font-medium text-gray-700 mb-2">Task Details *</label>
            <textarea
              id="task_detail"
              name="task_detail"
              value={formData.task_detail}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Workers, Pay, Completion */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="required_workers" className="block text-sm font-medium text-gray-700 mb-2">Required Workers *</label>
              <input
                type="number"
                id="required_workers"
                name="required_workers"
                value={formData.required_workers}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="payable_amount" className="block text-sm font-medium text-gray-700 mb-2">Payable Amount *</label>
              <input
                type="number"
                id="payable_amount"
                name="payable_amount"
                value={formData.payable_amount}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="completion_date" className="block text-sm font-medium text-gray-700 mb-2">Completion Date *</label>
              <input
                type="date"
                id="completion_date"
                name="completion_date"
                value={formData.completion_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Submission */}
          <div>
            <label htmlFor="submission_info" className="block text-sm font-medium text-gray-700 mb-2">Submission Info *</label>
            <textarea
              id="submission_info"
              name="submission_info"
              value={formData.submission_info}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Coin Info */}
          {formData.required_workers && formData.payable_amount && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">
                  Total Cost: {parseInt(formData.required_workers) * parseInt(formData.payable_amount)} coins
                </span>
              </div>
              <p className="text-sm text-blue-600 mt-1">Your current balance: {coins || 0} coins</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewTask;
