import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Withdrawal = () => {
  const { user, coins } = useContext(AuthContext);
  const [paymentSystem, setPaymentSystem] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [withdrawAmountCoins, setWithdrawAmountCoins] = useState('');
  const [withdrawAmountDollar, setWithdrawAmountDollar] = useState(0);
  const axiosSecure = useAxiosSecure();

  // Convert coins to dollar: 20 coins = 1 dollar
  useEffect(() => {
    const amount = parseInt(withdrawAmountCoins);
    if (!isNaN(amount)) {
      setWithdrawAmountDollar((amount / 20).toFixed(2));
    } else {
      setWithdrawAmountDollar(0);
    }
  }, [withdrawAmountCoins]);

  const handleWithdraw = async (e) => {
    e.preventDefault();

    const coinAmount = parseInt(withdrawAmountCoins);
    if (isNaN(coinAmount) || coinAmount < 200) {
      Swal.fire('Invalid Amount', 'You must withdraw at least 200 coins.', 'warning');
      return;
    }

    if (coinAmount > coins) {
      Swal.fire('Not Enough Coins', `You only have ${coins} coins.`, 'warning');
      return;
    }

    const withdrawalData = {
      worker_email: user.email,
      worker_name: user.displayName,
      withdrawal_coin: coinAmount,
      withdrawal_amount: parseFloat((coinAmount / 20).toFixed(2)), // in dollar
      payment_system: paymentSystem,
      account_number: accountNumber,
      withdraw_date: new Date().toISOString(),
      status: 'pending'
    };

    try {
      const res = await axiosSecure.post(`/api/withdrawals`, withdrawalData);
      if (res.data?.result?.insertedId) {
        Swal.fire('Success', 'Your withdrawal request has been submitted.', 'success');
        setWithdrawAmountCoins('');
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
      <h2 className="text-xl font-semibold mb-2">Withdraw Coins</h2>

      <p className="text-gray-700 mb-1">Total Coins: <strong>{coins}</strong></p>
      <p className="text-gray-700 mb-4">Total in USD: <strong>${(coins / 20).toFixed(2)}</strong></p>

      <form onSubmit={handleWithdraw} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Coin to Withdraw</label>
          <input
            type="number"
            value={withdrawAmountCoins}
            onChange={(e) => setWithdrawAmountCoins(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter coin amount (min 200)"
            min={200}
            max={coins}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Withdraw Amount (USD)</label>
          <input
            type="text"
            value={`$${withdrawAmountDollar}`}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
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
            <option value="Rocket">Rocket</option>
            <option value="Nagad">Nagad</option>
            <option value="Bank">Bank</option>
            <option value="Others">Others</option>
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

        {coins >= 200 ? (
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Request Withdrawal
          </button>
        ) : (
          <p className="text-red-500 text-center mt-4 font-medium">Insufficient coin</p>
        )}
      </form>
    </div>
  );
};

export default Withdrawal;

