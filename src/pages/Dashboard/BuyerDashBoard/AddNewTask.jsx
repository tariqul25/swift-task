import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';

const AddNewTask = () => {
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();

  const [formData, setFormData] = useState({
    task_title: '',
    task_description: '',
    task_category: '',
    required_workers: '',
    reward_per_worker: '',
    task_image_url: '',
    completion_date: '', // added here
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadedImageUrl = formData.task_image_url;

    if (imageFile) {
      const imageData = new FormData();
      imageData.append('image', imageFile);
      try {
        const imgbbAPIKey = import.meta.env.VITE_API_KEY;
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, imageData);
        uploadedImageUrl = res.data?.data?.url;
      } catch (err) {
        console.error('Image Upload Failed:', err);
        Swal.fire({
          icon: 'error',
          title: 'Image Upload Failed',
          text: 'Please try again or provide an image URL instead.',
        });
        setLoading(false);
        return;
      }
    }

    const totalCost = Number(formData.reward_per_worker) * Number(formData.required_workers);

    const newTask = {
      ...formData,
      task_image_url: uploadedImageUrl,
      buyer_email: user?.email,
      buyer_name: user?.displayName,
      buyer_id: user?.uid || user?.id,
      total_cost: totalCost,
      status: 'active',
      created_date: new Date().toISOString(),
    };

    try {
      const res = await axiosInstance.post('/api/tasks', newTask);
      if (res.data?.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Task Created',
          text: 'Your task was successfully created!',
        });
        setFormData({
          task_title: '',
          task_description: '',
          task_category: '',
          required_workers: '',
          reward_per_worker: '',
          completion_date: '', // reset
        });
        setImageFile(null);
      }
    } catch (error) {
      console.error('Task creation failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while creating the task.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Add New Task</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Task Title</label>
          <input
            type="text"
            name="task_title"
            value={formData.task_title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="task_category"
            value={formData.task_category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Task Description</label>
          <textarea
            name="task_description"
            value={formData.task_description}
            onChange={handleInputChange}
            rows="4"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Required Workers</label>
          <input
            type="number"
            name="required_workers"
            value={formData.required_workers}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reward per Worker</label>
          <input
            type="number"
            name="reward_per_worker"
            value={formData.reward_per_worker}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Completion Date</label>
          <input
            type="date"
            name="completion_date"
            value={formData.completion_date}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Task Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        

        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewTask;
