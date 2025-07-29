import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import { useToaster } from 'react-hot-toast';

const Withdrawals = () => {
  const { user, updateUserCoins } = useAuth();
  const { toast } = useToaster();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [paymentDetails, setPaymentDetails] = useState('');

  const COIN_TO_USD_RATE = 0.1; // 1 coin = $0.10
  const MIN_WITHDRAWAL = 100; // Minimum 100 coins = $10

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockWithdrawals = [
      {
        id: 1,
        amount: 250,
        usdAmount: 25.00,
        method: 'PayPal',
        details: 'user@email.com',
        status: 'completed',
        requestedAt: '2024-01-15T09:30:00Z',
        processedAt: '2024-01-16T14:20:00Z',
        transactionId: 'TXN_001234'
      },
      {
        id: 2,
        amount: 500,
        usdAmount: 50.00,
        method: 'Bank Transfer',
        details: 'Account ending in 1234',
        status: 'pending',
        requestedAt: '2024-01-20T16:45:00Z'
      },
      {
        id: 3,
        amount: 150,
        usdAmount: 15.00,
        method: 'PayPal',
        details: 'user@email.com',
        status: 'rejected',
        requestedAt: '2024-01-18T11:20:00Z',
        processedAt: '2024-01-18T15:30:00Z',
        rejectionReason: 'Invalid PayPal account'
      }
    ];

    setTimeout(() => {
      setWithdrawals(mockWithdrawals);
      setLoading(false);
    }, 1000);
  }, []);

  const handleWithdrawRequest = (e) => {
    e.preventDefault();
    
    const amount = parseInt(withdrawAmount);
    
    if (amount < MIN_WITHDRAWAL) {
      toast({
        title: "Minimum withdrawal amount",
        description: `Minimum withdrawal is ${MIN_WITHDRAWAL} coins ($${MIN_WITHDRAWAL * COIN_TO_USD_RATE}).`,
        variant: "destructive"
      });
      return;
    }
    
    if (amount > user.coins) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough coins for this withdrawal.",
        variant: "destructive"
      });
      return;
    }

    // Create new withdrawal request
    const newWithdrawal = {
      id: withdrawals.length + 1,
      amount: amount,
      usdAmount: amount * COIN_TO_USD_RATE,
      method: paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer',
      details: paymentDetails,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    setWithdrawals([newWithdrawal, ...withdrawals]);
    updateUserCoins(user.coins - amount);
    
    toast({
      title: "Withdrawal requested",
      description: `Your withdrawal of ${amount} coins ($${(amount * COIN_TO_USD_RATE).toFixed(2)}) has been submitted.`,
    });

    // Reset form
    setShowWithdrawForm(false);
    setWithdrawAmount('');
    setPaymentDetails('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalEarnings = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + w.usdAmount, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading withdrawal history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>
        <button
          onClick={() => setShowWithdrawForm(true)}
          disabled={user.coins < MIN_WITHDRAWAL}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Withdrawal</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-xl font-bold text-gray-900">
                {user?.coins || 0} coins
              </p>
              <p className="text-sm text-gray-500">
                ${((user?.coins || 0) * COIN_TO_USD_RATE).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Withdrawn</p>
              <p className="text-xl font-bold text-gray-900">
                ${totalEarnings.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {withdrawals.filter(w => w.status === 'completed').length} transactions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold text-gray-900">
                ${withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.usdAmount, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {withdrawals.filter(w => w.status === 'pending').length} requests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Minimum withdrawal notice */}
      {user.coins < MIN_WITHDRAWAL && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <strong>Note:</strong> Minimum withdrawal amount is {MIN_WITHDRAWAL} coins (${MIN_WITHDRAWAL * COIN_TO_USD_RATE}). 
            You need {MIN_WITHDRAWAL - user.coins} more coins to make a withdrawal.
          </p>
        </div>
      )}

      {/* Withdrawal Form Modal */}
      {showWithdrawForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Request Withdrawal</h2>
              
              <form onSubmit={handleWithdrawRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (coins)
                  </label>
                  <input
                    type="number"
                    min={MIN_WITHDRAWAL}
                    max={user.coins}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Minimum ${MIN_WITHDRAWAL} coins`}
                    required
                  />
                  {withdrawAmount && (
                    <p className="text-sm text-gray-500 mt-1">
                      ≈ ${(parseInt(withdrawAmount) * COIN_TO_USD_RATE).toFixed(2)} USD
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="paypal">PayPal</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {paymentMethod === 'paypal' ? 'PayPal Email' : 'Bank Account Details'}
                  </label>
                  <input
                    type={paymentMethod === 'paypal' ? 'email' : 'text'}
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={paymentMethod === 'paypal' ? 'your-email@example.com' : 'Account number or IBAN'}
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal History */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Withdrawal History</h2>
        </div>
        
        {withdrawals.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No withdrawals yet</h3>
            <p className="text-gray-500">Your withdrawal history will appear here once you make your first request.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {withdrawal.amount} coins
                      </div>
                      <div className="text-sm text-gray-500">
                        ${withdrawal.usdAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{withdrawal.method}</div>
                      <div className="text-sm text-gray-500">{withdrawal.details}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(withdrawal.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(withdrawal.status)}`}>
                          {withdrawal.status}
                        </span>
                      </div>
                      {withdrawal.rejectionReason && (
                        <div className="text-xs text-red-600 mt-1">
                          {withdrawal.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(withdrawal.requestedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {withdrawal.processedAt ? formatDate(withdrawal.processedAt) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Withdrawals;