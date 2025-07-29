import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';

const BuyerStats = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState([]);

  useEffect(() => {
  if (user?.email) {
  axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/buyer-stats?email=${user.email}`)
    .then((res) => {
      console.log(res.data);
      setStats(res.data);
    })
    .catch((err) => {
      console.error('Error fetching buyer stats:', err);
    });
  }
}, [user]);


  return (
    <div className="grid md:grid-cols-3 gap-4 text-center mt-6">
      <div className="bg-white rounded-2xl shadow-md p-6 border">
        <h2 className="text-lg font-bold text-gray-700">Total Tasks Added</h2>
        <p className="text-2xl font-extrabold text-blue-600">{stats.totalTasks}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border">
        <h2 className="text-lg font-bold text-gray-700">Pending Tasks</h2>
        <p className="text-2xl font-extrabold text-yellow-500">{stats.pendingTasks}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border">
        <h2 className="text-lg font-bold text-gray-700">Total Coins Paid</h2>
        <p className="text-2xl font-extrabold text-green-600">{stats.totalPayments}</p>
      </div>
    </div>
  );
};

export default BuyerStats;
