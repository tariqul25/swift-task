import React, { useState, useEffect, useContext } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext'; // adjust path as needed

const MySubmissions = () => {
  const { user } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return; // wait until user is loaded

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/submissions/${user.email}`)
      .then(res => {
        setSubmissions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch submissions:', err);
        setLoading(false);
      });
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
        <p className="text-gray-500 mt-4">Loading submissions...</p>
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div className="text-center py-10 text-gray-600">
        <p>You have no submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Submissions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task Title
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buyer Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted On
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payable Amount
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submission Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((sub) => (
              <tr key={sub._id || sub.task_id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sub.task_title}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sub.buyer_name}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(sub.current_date)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sub.payable_amount} coins</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(sub.status)}`}>
                    {getStatusIcon(sub.status)}
                    <span className="ml-1">{sub.status}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 max-w-xs truncate">
                  {sub.submission_details || 'No details provided'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MySubmissions;
