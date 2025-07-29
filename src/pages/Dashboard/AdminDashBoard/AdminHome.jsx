import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  Coins, 
  DollarSign,
  Check,
  Trash2,
  Edit
} from 'lucide-react';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';

const AdminHome = () => {
  const { user,role} = useAuth();
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayments: 0
  });
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    setStats({
      totalWorkers: 1250,
      totalBuyers: 340,
      totalCoins: 25000,
      totalPayments: 15000
    });

    setWithdrawalRequests([
      {
        id: 1,
        workerName: "John Doe",
        workerEmail: "john@example.com",
        withdrawalAmount: 50,
        withdrawalCoins: 1000,
        paymentSystem: "PayPal",
        accountNumber: "john.doe@paypal.com",
        date: "2024-01-15",
        status: "pending"
      },
      {
        id: 2,
        workerName: "Jane Smith",
        workerEmail: "jane@example.com",
        withdrawalAmount: 25,
        withdrawalCoins: 500,
        paymentSystem: "Bank Transfer",
        accountNumber: "****1234",
        date: "2024-01-14",
        status: "pending"
      }
    ]);

    setUsers([
      {
        id: 1,
        displayName: "Alice Johnson",
        email: "alice@example.com",
        photoURL: "/placeholder.svg",
        role: "worker",
        coins: 450
      },
      {
        id: 2,
        displayName: "Bob Smith",
        email: "bob@example.com",
        photoURL: "/placeholder.svg",
        role: "buyer",
        coins: 1200
      },
      {
        id: 3,
        displayName: "Carol Davis",
        email: "carol@example.com",
        photoURL: "/placeholder.svg",
        role: "worker",
        coins: 320
      }
    ]);
  }, []);

  const handleApproveWithdrawal = (requestId) => {
    const request = withdrawalRequests.find(r => r.id === requestId);
    if (request) {
      setWithdrawalRequests(withdrawalRequests.filter(r => r.id !== requestId));
      Swal.fire({
        title: 'Success!',
        text: `Withdrawal approved! $${request.withdrawalAmount} has been processed for ${request.workerName}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  

  const handleUpdateRole = (userId, newRole) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    Swal.fire({
      title: 'Success!',
      text: 'User role updated successfully',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-purple-100">Manage platform operations and users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Workers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Buyers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBuyers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Coins className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Coins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCoins.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalPayments.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Requests */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Withdrawal Requests</h2>
        </div>
        <div className="p-6">
          {withdrawalRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Check className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No pending withdrawal requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Worker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {withdrawalRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {request.workerName}
                        </div>
                        <div className="text-sm text-gray-500">{request.workerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${request.withdrawalAmount}</div>
                        <div className="text-sm text-gray-500">{request.withdrawalCoins} coins</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.paymentSystem}</div>
                        <div className="text-sm text-gray-500">{request.accountNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleApproveWithdrawal(request.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          Approve
                        </button>
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

export default AdminHome;
