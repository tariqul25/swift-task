import React, { useState, useEffect } from 'react';
import { Coins, Users, CalendarCheck } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import useAxios from '../../../hooks/useAxios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [submittedTaskIds, setSubmittedTaskIds] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios()
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    axiosSecure
      .get(`/api/tasks`)
      .then(res => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching tasks:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure.get(`/api/submitted-task-ids/${user.email}`)
      .then(res => {
        setSubmittedTaskIds(res.data); // ⬅️ this must be set correctly
      })
      .catch(err => console.error('Failed to fetch submitted IDs:', err));
  }, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const doc = {
      task_id: selectedTask._id,
      task_title: selectedTask.task_title,
      payable_amount: selectedTask.payable_amount,
      buyer_name: selectedTask.buyer_name,
      buyer_email: selectedTask.buyer_email,
      worker_email: user.email,
      worker_name: user.displayName || user.name || 'Unknown Worker',
      submission_details: submissionDetails,
      current_date: new Date().toISOString(),
      status: 'pending'
    };
    try {
      await axiosSecure.post(`/api/apply-task`, doc);
      setSubmittedTaskIds(prev => [...prev, selectedTask._id]);
      setSelectedTask(null);
      setSubmissionDetails('');

      Swal.fire({
        icon: 'success',
        title: 'Submitted!',
        text: 'Task submitted successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Submission failed:', err);
      Swal.fire({
        icon: 'success',
        title: 'Error!',
        text: 'Error Found',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  const displayTasks = tasks.filter(t => !submittedTaskIds.includes(t._id));
  // console.log(displayTasks);

  if (!displayTasks.length) {
    return <div>No available tasks at the moment.</div>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayTasks.map(task => (
        <div key={task._id} className="bg-white p-6 rounded shadow">
          <h3 className="font-bold text-lg">{task.task_title}</h3>
          <p>Buyer: {task.buyer_name}</p>
          <p>Deadline: {task.completion_date}</p>
          <p>Payable: {task.payable_amount} coins</p>
          <p>Required Workers: {task.required_workers}</p>
          <button onClick={() => setSelectedTask(task)} className="mt-3 bg-blue-500 text-white px-4 py-2 rounded">View Details</button>
        </div>
      ))}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded shadow">
            <button className="text-right w-full" onClick={() => setSelectedTask(null)}>close</button>
            <h2 className="text-xl font-bold mb-2">{selectedTask.task_title}</h2>
            <p><strong>Buyer:</strong> {selectedTask.buyer_name}</p>
            <p><strong>Deadline:</strong> {selectedTask.completion_date}</p>
            <p><strong>Payable:</strong> {selectedTask.payable_amount}</p>
            <p><strong>Description:</strong> {selectedTask.task_detail}</p>

            <form onSubmit={handleSubmit} className="mt-4">
              <textarea
                required
                rows="4"
                value={submissionDetails}
                onChange={e => setSubmissionDetails(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Submission details..."
              />
              <button type="submit" className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Submit Work</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
