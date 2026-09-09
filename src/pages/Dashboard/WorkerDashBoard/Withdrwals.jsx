import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
  CreditCard,
  Coins,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  History
} from 'lucide-react';

const Withdrawal = () => {
  const { user, coins, fetchUser, updateUserCoins } = useContext(AuthContext);
  const [paymentSystem, setPaymentSystem] = useState('bKash');
  const [accountNumber, setAccountNumber] = useState('');
  const [withdrawAmountCoins, setWithdrawAmountCoins] = useState('');
  const [withdrawAmountDollar, setWithdrawAmountDollar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [withdrawalsHistory, setWithdrawalsHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const axiosSecure = useAxiosSecure();

  const fetchHistory = async () => {
    if (!user?.email) return;
    setLoadingHistory(true);
    try {
      const res = await axiosSecure.get(`/api/withdrawals/${user.email}`);
      setWithdrawalsHistory(res.data || []);
    } catch (err) {
      console.error('Failed to fetch withdrawal history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.email]);

  useEffect(() => {
    const amount = parseInt(withdrawAmountCoins);
    if (!isNaN(amount) && amount > 0) {
      setWithdrawAmountDollar((amount / 20).toFixed(2));
    } else {
      setWithdrawAmountDollar(0);
    }
  }, [withdrawAmountCoins]);

  const handleWithdraw = async (e) => {
    e.preventDefault();

    const coinAmount = parseInt(withdrawAmountCoins);
    if (isNaN(coinAmount) || coinAmount < 200) {
      Swal.fire('Invalid Amount', 'Minimum withdrawal is 200 coins ($10.00).', 'warning');
      return;
    }

    if (coinAmount > (coins || 0)) {
      Swal.fire('Insufficient Coins', `You currently have ${coins || 0} coins.`, 'warning');
      return;
    }

    setLoading(true);
    const withdrawalData = {
      worker_email: user.email,
      worker_name: user.displayName || user.name || 'Worker',
      withdrawal_coin: Number(coinAmount),
      withdrawal_amount: parseFloat((coinAmount / 20).toFixed(2)),
      payment_system: paymentSystem,
      account_number: accountNumber,
      withdraw_date: new Date().toISOString(),
      status: 'pending',
    };

    try {
      const res = await axiosSecure.post(`/api/withdrawals`, withdrawalData);
      if (res.data?.result?.insertedId || res.data?.message || res.data?.success) {
        const remaining =
          typeof res.data?.remainingCoins === 'number'
            ? res.data.remainingCoins
            : Math.max(0, (coins || 0) - coinAmount);

        // Immediately deduct from client-side state so it's reflected in real-time
        if (typeof updateUserCoins === 'function') {
          updateUserCoins(remaining);
        }
        if (typeof fetchUser === 'function') {
          await fetchUser();
        }

        Swal.fire({
          icon: 'success',
          title: 'Withdrawal Submitted!',
          text: `${coinAmount} coins have been deducted from your account and placed in the payout queue.`,
          timer: 2500,
          showConfirmButton: false,
        });

        setWithdrawAmountCoins('');
        setAccountNumber('');
        fetchHistory();
      }
    } catch (error) {
      console.error('Withdrawal failed:', error);
      Swal.fire(
        'Error',
        error.response?.data?.error || error.response?.data?.message || 'Something went wrong. Please try again later.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit">
          <ShieldCheck className="w-3.5 h-3.5" />
          Direct Escrow Payouts
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">Withdraw Earnings</h1>
        <p className="mt-1 text-white/80 text-xs sm:text-sm">
          Convert your hard-earned coins directly to mobile financial services or bank accounts. Coins are held in escrow upon request submission.
        </p>

        {/* Balance Glance */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <p className="text-xs text-white/70">Current Available Coins</p>
            <p className="text-xl sm:text-2xl font-black mt-0.5">{coins || 0} Coins</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <p className="text-xs text-white/70">Estimated Value</p>
            <p className="text-xl sm:text-2xl font-black mt-0.5">${((coins || 0) / 20).toFixed(2)} USD</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          New Payout Request
        </h2>

        <form onSubmit={handleWithdraw} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Coins to Withdraw *
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  value={withdrawAmountCoins}
                  onChange={(e) => setWithdrawAmountCoins(e.target.value)}
                  required
                  min={200}
                  max={coins || 0}
                  placeholder="Min 200 coins"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">20 coins = $1.00 USD (Min: 200 coins)</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Equivalent USD Amount
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={`$${withdrawAmountDollar} USD`}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Payment Gateway *
              </label>
              <select
                value={paymentSystem}
                onChange={(e) => setPaymentSystem(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="bKash">bKash (Personal/Agent)</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Bank">Bank Wire Transfer</option>
                <option value="Others">Other Wallets</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Account / Mobile Number *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g., 017XXXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3">
            {(coins || 0) >= 200 ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>{loading ? 'Processing Escrow Request...' : 'Submit Withdrawal Request'}</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3 text-rose-700 dark:text-rose-400 text-xs font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>
                  You need at least 200 coins to request a withdrawal (Current: {coins || 0} coins). Complete micro-tasks to earn more coins!
                </span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Withdrawal History Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Your Payout History
        </h3>

        {withdrawalsHistory.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No withdrawal requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Date</th>
                  <th className="py-3 px-4">Coins Deducted</th>
                  <th className="py-3 px-4">USD Amount</th>
                  <th className="py-3 px-4">Gateway</th>
                  <th className="py-3 px-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {withdrawalsHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-300">
                      {item.withdraw_date ? new Date(item.withdraw_date).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      {item.withdrawal_coin}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      ${Number(item.withdrawal_amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {item.payment_system} ({item.account_number})
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Approved & Paid
                        </span>
                      ) : item.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                          <XCircle className="w-3 h-3" /> Rejected (Refunded)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
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

export default Withdrawal;
