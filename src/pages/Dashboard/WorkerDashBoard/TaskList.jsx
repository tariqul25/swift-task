import React, { useState, useEffect } from 'react';
import { Coins, Users, CalendarCheck } from 'lucide-react';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittedTasks, setSubmittedTasks] = useState([]); // <-- সাবমিট করা টাস্ক আইডি গুলো রাখবে
  const { user } = useAuth()

  useEffect(() => {
    axios.get('https://swift-tasks-zeta.vercel.app/api/tasks')
      .then(res => {
        const filtered = res.data.filter(task => task.required_workers > 0);
        setTasks(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching tasks:', err);
        setLoading(false);
      });
  }, []);

  // ইউজারের সাবমিশন গুলো লোড করার জন্য (API থেকে)
  useEffect(() => {
    if (!user?.email) return;

    axios.get(`https://swift-tasks-zeta.vercel.app/api/${user.email}`)
      .then(res => {
        // ধরলাম response হবে array of submissions
        const taskIds = res.data.map(sub => sub.task_id);
        setSubmittedTasks(taskIds);
      })
      .catch(err => console.error('Error loading submissions:', err));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to submit a task.');

    const submission = {
      task_id: selectedTask._id,
      task_title: selectedTask.task_title,
      payable_amount: selectedTask.payable_amount,
      buyer_name: selectedTask.buyer_name,
      buyer_email: selectedTask.buyer_email,
      worker_email: user.email,
      worker_name: user.displayName || 'Unknown Worker',
      submission_details: submissionDetails,
      current_date: new Date().toISOString(),
      status: 'pending',
    };

    try {
      await axios.post(`https://swift-tasks-zeta.vercel.app/api/apply-task`, submission);
      alert('Submission sent successfully!');
      setSubmittedTasks(prev => [...prev, selectedTask._id]); // নতুন সাবমিশন আইডি add করলাম
      setSelectedTask(null);
      setSubmissionDetails('');
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Something went wrong.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
        <p className="text-gray-500 mt-4">Loading tasks...</p>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="text-center py-10 text-gray-600">
        <p>No tasks available right now.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 py-8">
        {tasks.map(task => (
          <div key={task._id} className="bg-white shadow rounded-xl p-6 border hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{task.task_title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold text-gray-700">Buyer:</span> {task.buyer_name}
            </p>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-blue-500" />
                <span><strong>Deadline:</strong> {task.completion_date || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span><strong>Payable:</strong> {task.payable_amount} coins</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span><strong>Required Workers:</strong> {task.required_workers}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedTask(task)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white max-w-lg w-full rounded-xl p-6 shadow-lg relative">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Task Details</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Title:</strong> {selectedTask.task_title}</p>
              <p><strong>Buyer:</strong> {selectedTask.buyer_name}</p>
              <p><strong>Buyer Email:</strong> {selectedTask.buyer_email}</p>
              <p><strong>Worker Email:</strong> {user.email}</p>
              <p><strong>Deadline:</strong> {selectedTask.completion_date || 'N/A'}</p>
              <p><strong>Payable:</strong> {selectedTask.payable_amount} coins</p>
              <p><strong>Required Workers:</strong> {selectedTask.required_workers}</p>
              <p><strong>Description:</strong> {selectedTask.task_detail || 'No description'}</p>
            </div>

            {/* Disable form if user already submitted this task */}
            {submittedTasks.includes(selectedTask._id) ? (
              <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded">
                You have already submitted this task.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block text-sm font-semibold">Submission Details:</label>
                <textarea
                  required
                  rows="4"
                  value={submissionDetails}
                  onChange={(e) => setSubmissionDetails(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Describe your work or provide a link..."
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Submit Work
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
