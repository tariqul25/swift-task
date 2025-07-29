import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle, Clock } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAxios from '../../../hooks/useAxios';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const axiosInstance=useAxios()
  useEffect(() => {
    if (user?.email) {
      axiosInstance.get(`/api/payments/${user.email}`)
        .then(res => {
          setPayments(res.data);
        })
        .catch(error => {
          console.error("Error fetching payments:", error);
        });
    }
  }, [user?.email]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Payment History</h1>
        <p className="text-blue-100">View all your coin purchase transactions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
        </div>
        <div className="p-6">
          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No payment history found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coins</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm text-gray-800">{payment._id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${payment.amount}</td>
                      <td className="px-6 py-4 text-sm text-yellow-700 font-medium flex items-center">
                        <CreditCard className="w-4 h-4 mr-1" /> {payment.coins}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 capitalize">{payment.method}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1">{payment.status}</span>
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

export default PaymentHistory;
