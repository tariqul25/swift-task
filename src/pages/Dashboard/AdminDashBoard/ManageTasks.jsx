import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);


  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

 const handleDeleteTask = async (taskId) => {
  try {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}`);
    setTasks(tasks.filter(task => task._id !== taskId));
    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Task deleted successfully',
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error('Failed to delete task', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to delete task',
    });
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Tasks</h1>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Title</th>
            <th className="border px-4 py-2 text-left">Description</th>
            <th className="border px-4 py-2 text-left">Reward</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">No tasks found.</td>
            </tr>
          )}
          {tasks.map(task => (
            <tr key={task._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{task.task_title}</td>
              <td className="border px-4 py-2">{task.task_detail}</td>
              <td className="border px-4 py-2">{task.total_cost}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTasks;
