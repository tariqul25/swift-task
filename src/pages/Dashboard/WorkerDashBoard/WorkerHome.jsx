import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  DollarSign, 
  FileText, 
  Award, 
  CheckCircle 
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';

const WorkerHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalEarning: 0,
    approvedSubmissions: []
  });

  useEffect(() => {
    if (!user?.email) return;

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/worker-stats/${user.email}`)
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to load stats", err));
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.displayName}!</h1>
        <p className="text-blue-100">Ready to earn more coins today?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card icon={<FileText className="w-6 h-6 text-blue-600" />} label="Total Submissions" value={stats.totalSubmissions} bg="bg-blue-100" />
        <Card icon={<Clock className="w-6 h-6 text-yellow-600" />} label="Pending Submissions" value={stats.pendingSubmissions} bg="bg-yellow-100" />
        <Card icon={<DollarSign className="w-6 h-6 text-green-600" />} label="Total Earnings" value={`$${stats.totalEarning}`} bg="bg-green-100" />
      </div>

      {/* Approved Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b flex items-center">
          <Award className="w-6 h-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Recent Approved Submissions</h2>
        </div>
        <div className="p-6">
          {stats.approvedSubmissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No approved submissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <HeaderCell>Task Title</HeaderCell>
                    <HeaderCell>Amount</HeaderCell>
                    <HeaderCell>Buyer</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.approvedSubmissions.map((sub, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <Cell>{sub.task_title}</Cell>
                      <Cell>${sub.payable_amount}</Cell>
                      <Cell>{sub.buyer_name}</Cell>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Approved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const Card = ({ icon, label, value, bg }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center">
      <div className={`p-3 ${bg} rounded-full`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const HeaderCell = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>
);

const Cell = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{children}</td>
);

export default WorkerHome;
