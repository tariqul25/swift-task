import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { CreditCard, Coins, DollarSign, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const Withdrawal = () => {
  const { user, coins, fetchUser } = useContext(AuthContext);
  const [paymentSystem, setPaymentSystem] = useState('bKash');
  const [accountNumber, setAccountNumber] = useState('');
  const [withdrawAmountCoins, setWithdrawAmountCoins] = useState('');
  const [withdrawAmountDollar, setWithdrawAmountDollar] = useState(0);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

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
      status: 'pending'
    };

    try {
      const res = await axiosSecure.post(`/api/withdrawals`, withdrawalData);
      if (res.data?.result?.insertedId || res.data?.message) {
        Swal.fire({
          icon: 'success',
          title: 'Withdrawal Submitted!',
          text: 'Your request has been placed in the admin approval queue. Coins will disburse upon review.',
          timer: 2500,
          showConfirmButton: false,
        });
        setWithdrawAmountCoins('');
        setAccountNumber('');
        if (typeof fetchUser === 'function') {
          await fetchUser();
        }
      }
    } catch (error) {
      console.error('Withdrawal failed:', error);
      Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit">
          <ShieldCheck className="w-3.5 h-3.5" />
          Direct Escrow Payouts
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">Withdraw Earnings</h1>
        <p className="mt-1 text-white/80 text-xs sm:text-sm">
          Convert your hard-earned coins directly to mobile financial services or bank accounts.
        </p>

        {/* Balance Glance */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <p className="text-xs text-white/70">Current Coin Balance</p>
            <p className="text-xl font-black mt-0.5">{coins || 0} Coins</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <p className="text-xs text-white/70">Estimated Value</p>
            <p className="text-xl font-black mt-0.5">${((coins || 0) / 20).toFixed(2)} USD</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">20 coins = $1.00 USD (Min: 200)</p>
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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-3">
            {(coins || 0) >= 200 ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{loading ? 'Processing...' : 'Submit Withdrawal Request'}</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3 text-rose-700 dark:text-rose-400 text-xs font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>You need at least 200 coins to request a withdrawal. Complete more micro-tasks to unlock payouts!</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Withdrawal;
