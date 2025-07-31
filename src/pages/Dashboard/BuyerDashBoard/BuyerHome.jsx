import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import Swal from 'sweetalert2';
import useAxios from '../../../hooks/useAxios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const BuyerHome = () => {
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const axiosSecure=useAxiosSecure()

  const [stats, setStats] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Fetch buyer stats
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/api/buyer-stats?email=${user.email}`)
        .then((res) => {
          setStats(res.data);
        })
        .catch((err) => console.error('Stats fetch error:', err));
    }
  }, [user]);

  // Fetch pending submissions
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/api/worker-submission/pending/${user?.email}`)
        .then((res) => {
          setSubmissions(res.data);
        })
        .catch((err) => console.error('Submission fetch error:', err));
    }
  }, [user]);

  // Approve Submission
  const handleApprove = async (submissionId, workerEmail, coins) => {
    try {
      const res = await axiosSecure.patch(`/api/submissions/approve/${submissionId}`, {
        workerEmail,
        coins,
      });
      if (res.data.success) {
        Swal.fire('Approved!', 'Submission has been approved.', 'success');
        // Filter out the approved submission
        setSubmissions(submissions.filter((s) => s._id !== submissionId));
      }
    } catch (err) {
      Swal.fire('Error!', 'Failed to approve submission.', 'error');
    }
  };

  // Reject Submission
  const handleReject = async (submissionId, taskId) => {
    try {
      const res = await axiosSecure.delete(`/api/submissions/reject/${submissionId}`, {
        taskId,
      });

      if (res.data.success) {
        Swal.fire('Rejected!', 'Submission has been rejected.', 'info');
        setSubmissions(submissions.filter((s) => s._id !== submissionId));
      }
    } catch (err) {
      Swal.fire('Error!', 'Failed to reject submission.', 'error');
    }
  };

  return (
    <div className="p-4">
      {/* Buyer Stats */}
      <div className="grid md:grid-cols-3 gap-4 text-center mt-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border">
          <h2 className="text-lg font-bold text-gray-700">Total Tasks Added</h2>
          <p className="text-2xl font-extrabold text-blue-600">{stats.totalTasks || 0}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border">
          <h2 className="text-lg font-bold text-gray-700">Pending Workers</h2>
          <p className="text-2xl font-extrabold text-yellow-500">{stats.pendingTasks || 0}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border">
          <h2 className="text-lg font-bold text-gray-700">Total Coins Paid</h2>
          <p className="text-2xl font-extrabold text-green-600">{stats.totalPayments || 0}</p>
        </div>
      </div>

      {/* Pending Submissions Table */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Task Submissions to Review</h2>
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th>Worker Name</th>
                <th>Task Title</th>
                <th>Payable</th>
                <th>Submission</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s._id}>
                  <td>{s.buyer_name}</td>
                  <td>{s.task_title}</td>
                  <td>{s.payable_amount}</td>
                  <td>
                    <button
                      onClick={() => setSelectedSubmission(s)}
                      className="btn btn-sm btn-outline btn-info"
                    >
                      View
                    </button>
                  </td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleApprove(s._id, s.worker_email, s.payable_amount)}
                      className="btn btn-sm btn-success"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(s._id, s.task_id)}
                      className="btn btn-sm btn-error"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No pending submissions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-2 right-2 text-gray-600"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4">Submission Detail</h3>
            <p><strong>Worker Name:</strong> {selectedSubmission.worker_name}</p>
            <p><strong>Task Title:</strong> {selectedSubmission.task_title}</p>
            <p><strong>Payable:</strong> {selectedSubmission.payable_amount}</p>
            <p><strong>Submission Text:</strong> {selectedSubmission.submission_details || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerHome;
