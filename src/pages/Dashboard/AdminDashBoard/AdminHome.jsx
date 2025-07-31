import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminHome = () => {
  const [stats, setStats] = useState({});
  const [withdrawals, setWithdrawals] = useState([]);
  const axiosSecure= useAxiosSecure()

  // Load Admin Stats
  const fetchStats = async () => {
    const res = await axiosSecure.get(`/api/admin/stats`);
    setStats(res.data);
  };

  // Load Pending Withdrawals
   const fetchPending = async () => {
    try {
      const res = await axiosSecure.get(`/api/pending/withdrawals`);
      setWithdrawals(res.data);
    } catch (err) {
      console.error('Failed to fetch pending withdrawals:', err);
    }
  };

  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Approve this withdrawal and deduct coins from worker?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/api/withdrawals/approve/${id}`);
        Swal.fire('Approved!', 'Withdrawal approved and coins deducted.', 'success');
        fetchPending(); // refresh list
      } catch (err) {
        console.error('Approval failed:', err);
        Swal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };

  useEffect(() => {
    fetchPending();
    fetchStats();
  }, []);




  // Reject withdrawal
  const handleReject = async (id) => {
  const confirm = await Swal.fire({
    title: 'Reject Withdrawal?',
    text: 'Are you sure to reject and delete this request?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Reject',
  });

  if (confirm.isConfirmed) {
    try {
      const res = await axiosSecure.delete(`/api/withdrawals/reject/${id}`);
      if (res.data.success) {
        Swal.fire('Rejected!', 'Withdrawal has been rejected and deleted.', 'success');
        fetchPending(); // Refresh the pending list
      }
    } catch (err) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  }
};



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Workers</h2>
          <p className="text-2xl font-bold text-blue-600">{stats.totalWorkers || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Buyers</h2>
          <p className="text-2xl font-bold text-green-600">{stats.totalBuyers || 0}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Coins</h2>
          <p className="text-2xl font-bold text-yellow-600">{stats.totalCoins || 0}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Payments</h2>
          <p className="text-2xl font-bold text-purple-600">{stats.totalPayments || 0}</p>
        </div>
      </div>

      {/* Withdrawal Requests Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pending Withdrawals</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Worker</th>
                <th className="p-2">Coins</th>
                <th className="p-2">System</th>
                <th className="p-2">Account</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr><td className="p-4 text-center" colSpan="5">No pending requests.</td></tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w._id} className="border-b">
                    <td className="p-2">{w.worker_name} <br /><small>{w.worker_email}</small></td>
                    <td className="p-2">{w.withdrawal_coin}</td>
                    <td className="p-2">{w.payment_system}</td>
                    <td className="p-2">{w.account_number}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => handleApprove(w._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleReject(w._id)}
                      >
                        Reject
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

export default AdminHome;
