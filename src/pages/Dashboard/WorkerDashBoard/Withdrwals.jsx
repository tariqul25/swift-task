import React, { useContext, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';

const Withdrawal = () => {
  const { user, coins } = useContext(AuthContext);
  const [paymentSystem, setPaymentSystem] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleWithdraw = async (e) => {
    e.preventDefault();

    const amount = parseInt(withdrawAmount);

    if (isNaN(amount) || amount < 200) {
      Swal.fire('Invalid Amount', 'You must withdraw at least 200 coins.', 'warning');
      return;
    }

    if (amount > coins) {
      Swal.fire('Not Enough Coins', `You only have ${coins} coins.`, 'warning');
      return;
    }

    const withdrawalData = {
      worker_email: user.email,
      worker_name: user.displayName,
      withdrawal_coin: amount,
      payment_system: paymentSystem,
      account_number: accountNumber,
      withdraw_date: new Date().toISOString(),
      status: 'pending'
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/withdrawals`, withdrawalData);
      if (res.data?.result?.insertedId) {
        Swal.fire('Success', 'Your withdrawal request has been submitted.', 'success');
        setWithdrawAmount('');
        setAccountNumber('');
        setPaymentSystem('');
      }
    } catch (error) {
      console.error('Withdrawal failed:', error);
      Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-4">Withdraw Coins</h2>
      <p className="mb-4 text-gray-700">Available Coins: <strong>{coins}</strong></p>

      <form onSubmit={handleWithdraw} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Withdrawal Amount</label>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter coin amount (min 200)"
            min={200}
            max={coins}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Payment System</label>
          <select
            value={paymentSystem}
            onChange={(e) => setPaymentSystem(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Bank">Bank</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Account Number</label>
          <input
            type="text"
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter your account number"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Request Withdrawal
        </button>
      </form>
    </div>
  );
};

export default Withdrawal;
