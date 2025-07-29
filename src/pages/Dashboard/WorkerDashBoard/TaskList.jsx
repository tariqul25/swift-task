// import React, { useState, useEffect } from 'react';
// import { Coins, Users, CalendarCheck } from 'lucide-react';
// import axios from 'axios';
// import useAuth from '../../../hooks/useAuth';

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [submissionDetails, setSubmissionDetails] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [submittedTasks, setSubmittedTasks] = useState([]);
//   const { user } = useAuth();

//   // Load all tasks
//   useEffect(() => {
//     axios.get('https://swift-tasks-zeta.vercel.app/api/tasks')
//       .then(res => {
//         const filtered = res.data.filter(task => task.required_workers > 0);
//         setTasks(filtered);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Error fetching tasks:', err);
//         setLoading(false);
//       });
//   }, []);

//   // Load worker submissions
//   useEffect(() => {
//     if (!user?.email) return;
//     axios.get(`https://swift-tasks-zeta.vercel.app/api/${user.email}`)
//       .then(res => {
//         const taskIds = res.data.map(sub => sub.task_id);
//         setSubmittedTasks(taskIds);
//       })
//       .catch(err => console.error('Error loading submissions:', err));
//   }, [user]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user) return alert('Please login to submit a task.');

//     const submission = {
//       task_id: selectedTask._id,
//       task_title: selectedTask.task_title,
//       payable_amount: selectedTask.payable_amount,
//       buyer_name: selectedTask.buyer_name,
//       buyer_email: selectedTask.buyer_email,
//       worker_email: user.email,
//       worker_name: user.displayName || 'Unknown Worker',
//       submission_details: submissionDetails,
//       current_date: new Date().toISOString(),
//       status: 'pending',
//     };

//     try {
//       await axios.post('https://swift-tasks-zeta.vercel.app/api/apply-task', submission);
//       alert('Submission successful!');
//       setSubmittedTasks(prev => [...prev, selectedTask._id]);
//       setSelectedTask(null);
//       setSubmissionDetails('');
//     } catch (err) {
//       console.error('Submission failed:', err);
//       alert('Something went wrong.');
//     }
//   };

//   const filteredTasks = tasks.filter(task => !submittedTasks.includes(task._id));

//   if (loading) {
//     return (
//       <div className="text-center py-10">
//         <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
//         <p className="text-gray-500 mt-4">Loading tasks...</p>
//       </div>
//     );
//   }

//   if (!filteredTasks.length) {
//     return (
//       <div className="text-center py-10 text-gray-600">
//         <p>No tasks available right now.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 py-8">
//         {filteredTasks.map(task => (
//           <div key={task._id} className="bg-white shadow rounded-xl p-6 border hover:shadow-lg transition">
//             <h2 className="text-xl font-bold text-gray-800 mb-2">{task.task_title}</h2>
//             <p className="text-sm text-gray-500 mb-2">
//               <span className="font-semibold text-gray-700">Buyer:</span> {task.buyer_name}
//             </p>
//             <div className="text-sm text-gray-600 space-y-2">
//               <div className="flex items-center gap-2">
//                 <CalendarCheck className="w-4 h-4 text-blue-500" />
//                 <span><strong>Deadline:</strong> {task.completion_date || 'N/A'}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Coins className="w-4 h-4 text-yellow-500" />
//                 <span><strong>Payable:</strong> {task.payable_amount} coins</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Users className="w-4 h-4 text-green-600" />
//                 <span><strong>Required Workers:</strong> {task.required_workers}</span>
//               </div>
//             </div>
//             <button
//               onClick={() => setSelectedTask(task)}
//               className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               View Details
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {selectedTask && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
//           <div className="bg-white max-w-lg w-full rounded-xl p-6 shadow-lg relative">
//             <button
//               onClick={() => setSelectedTask(null)}
//               className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
//             >
//               &times;
//             </button>
//             <h2 className="text-2xl font-bold mb-4">Task Details</h2>
//             <div className="text-gray-700 space-y-2">
//               <p><strong>Title:</strong> {selectedTask.task_title}</p>
//               <p><strong>Buyer:</strong> {selectedTask.buyer_name}</p>
//               <p><strong>Buyer Email:</strong> {selectedTask.buyer_email}</p>
//               <p><strong>Worker Email:</strong> {user.email}</p>
//               <p><strong>Deadline:</strong> {selectedTask.completion_date || 'N/A'}</p>
//               <p><strong>Payable:</strong> {selectedTask.payable_amount} coins</p>
//               <p><strong>Required Workers:</strong> {selectedTask.required_workers}</p>
//               <p><strong>Description:</strong> {selectedTask.task_detail || 'No description'}</p>
//             </div>

//             {/* Submission Form */}
//             <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//               <label className="block text-sm font-semibold">Submission Details:</label>
//               <textarea
//                 required
//                 rows="4"
//                 value={submissionDetails}
//                 onChange={(e) => setSubmissionDetails(e.target.value)}
//                 className="w-full border rounded-md px-3 py-2 text-sm"
//                 placeholder="Describe your work or provide a link..."
//               />
//               <button
//                 type="submit"
//                 className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//               >
//                 Submit Work
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskList;



import React, { useState, useEffect } from 'react';
import { Coins, Users, CalendarCheck } from 'lucide-react';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [submittedTaskIds, setSubmittedTaskIds] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [loading, setLoading] = useState(true);
  console.log(tasks);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`)
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

  axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/submitted-task-ids/${user.email}`)
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
      worker_name: user.displayName || 'Unknown Worker',
      submission_details: submissionDetails,
      current_date: new Date().toISOString(),
      status: 'pending'
    };
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/apply-task`, doc);
      setSubmittedTaskIds(prev => [...prev, selectedTask._id]);
      setSelectedTask(null);
      setSubmissionDetails('');
      alert('Submission sent!');
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Error submitting.');
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  const displayTasks = tasks.filter(t => !submittedTaskIds.includes(t._id));
  console.log(displayTasks);

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
