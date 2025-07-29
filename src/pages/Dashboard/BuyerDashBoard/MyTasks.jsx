import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';

const MyTasks = () => {
  const { user, updateUserCoins } = use(AuthContext)
  console.log(user);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/user/${user.email}`);
      // Sort by descending completion_date
      const sorted = res.data.sort((a, b) => new Date(b.completion_date) - new Date(a.completion_date));
      setTasks(sorted);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchTasks();
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${editingTask._id}`, {
        task_title: editingTask.task_title,
        task_detail: editingTask.task_detail,
        submission_info: editingTask.submission_info,
      });
      Swal.fire('Updated!', 'Task has been updated.', 'success');
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
      Swal.fire('Error!', 'Failed to update task.', 'error');
    }
  };

  const handleDelete = async (task) => {
  const confirm = await Swal.fire({
    title: 'Are you sure?',
    text: 'This will delete the task!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!'
  });

  if (!confirm.isConfirmed) return;

  try {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${task._id}`);

    Swal.fire('Deleted!', 'Task has been deleted.', 'success');
    fetchTasks();
  } catch (err) {
    console.error(err);
    Swal.fire('Error!', 'Failed to delete task.', 'error');
  }
};


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">My Posted Tasks</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Deadline</th>
              <th className="px-4 py-2">Workers</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id} className="border-t text-center">
                <td className="px-4 py-2">{task.task_title}</td>
                <td className="px-4 py-2">{task.completion_date}</td>
                <td className="px-4 py-2">{task.required_workers}</td>
                <td className="px-4 py-2">{task.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(task)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold">Edit Task</h3>
            <input
              type="text"
              className="w-full border px-3 py-2"
              value={editingTask.task_title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, task_title: e.target.value })
              }
              placeholder="Title"
            />
            <textarea
              className="w-full border px-3 py-2"
              value={editingTask.task_detail}
              onChange={(e) =>
                setEditingTask({ ...editingTask, task_detail: e.target.value })
              }
              placeholder="Details"
            ></textarea>
            <input
              type="text"
              className="w-full border px-3 py-2"
              value={editingTask.submission_info}
              onChange={(e) =>
                setEditingTask({ ...editingTask, submission_info: e.target.value })
              }
              placeholder="Submission Info"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
