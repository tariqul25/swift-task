import React, { useState } from 'react';
import { Coins, CreditCard, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PurchaseCoins = () => {
  const { user, updateUserCoins, coins, fetchUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [processingPkg, setProcessingPkg] = useState(null);

  const coinPackages = [
    { coins: 20, price: 1, popular: false, badge: 'Starter' },
    { coins: 150, price: 7, popular: false, badge: 'Standard' },
    { coins: 500, price: 20, popular: true, badge: 'Most Popular' },
    { coins: 1200, price: 45, popular: false, badge: 'Enterprise' }
  ];

  const handlePayment = async (coinPackage) => {
    const { coins: coinsToAdd, price } = coinPackage;

    const confirm = await Swal.fire({
      title: 'Confirm Coin Purchase',
      text: `Purchase ${coinsToAdd} coins for $${price}.00 USD?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Proceed to Payment',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563EB',
    });

    if (!confirm.isConfirmed) return;

    setProcessingPkg(coinsToAdd);

    Swal.fire({
      title: 'Securing Escrow Transaction...',
      text: 'Simulating instant bank-grade gateway checkout',
      timer: 1200,
      didOpen: () => Swal.showLoading(),
      showConfirmButton: false,
    });

    try {
      // 1. Record payment in database
      await axiosSecure.post(`/api/payments`, {
        email: user.email,
        name: user.displayName || user.name || 'Buyer',
        coins: coinsToAdd,
        amount: price,
        payment_date: new Date().toISOString(),
        method: 'Card',
        status: 'success'
      });

      // 2. Increment user coins in backend
      const newTotal = (coins || 0) + coinsToAdd;
      await axiosSecure.patch(`/api/users/coins/${user.email}`, {
        coins: newTotal
      });

      // 3. Update state
      if (typeof updateUserCoins === 'function') {
        updateUserCoins(newTotal);
      }
      if (typeof fetchUser === 'function') {
        await fetchUser();
      }

      Swal.fire({
        title: 'Payment Successful!',
        text: `${coinsToAdd} coins have been added to your balance.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Payment error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Transaction failed. Please try again.',
        icon: 'error'
      });
    } finally {
      setProcessingPkg(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-3">
            <Coins className="w-3.5 h-3.5" />
            Wallet Deposit
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Purchase Coins</h1>
          <p className="mt-1 text-white/85 text-xs sm:text-sm">
            Top up your balance to post new micro-tasks and fund worker escrow pools.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right min-w-[140px]">
          <p className="text-xs text-white/70">Current Balance</p>
          <p className="text-2xl font-black mt-0.5">{coins || 0} Coins</p>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {coinPackages.map((pkg, index) => (
          <div
            key={index}
            className={`relative p-8 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between ${
              pkg.popular
                ? 'border-primary shadow-xl shadow-primary/10 ring-2 ring-primary/20 transform lg:-translate-y-2'
                : 'border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary text-white shadow-md">
                  <Sparkles className="w-3 h-3" />
                  {pkg.badge}
                </span>
              </div>
            )}

            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-5">
                <Coins className="w-7 h-7 fill-current" />
              </div>

              <div className="text-center mb-6">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                  {pkg.coins}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                  Swift Coins
                </p>
                <div className="mt-4 text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  ${pkg.price}
                  <span className="text-xs text-slate-400 font-normal"> / USD</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  ${(pkg.price / pkg.coins).toFixed(3)} per coin
                </p>
              </div>
            </div>

            <button
              onClick={() => handlePayment(pkg)}
              disabled={processingPkg === pkg.coins}
              className={`w-full py-3 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                pkg.popular
                  ? 'bg-primary hover:bg-primary-hover text-white shadow-primary/25'
                  : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{processingPkg === pkg.coins ? 'Processing...' : 'Buy Coins'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Escrow Guarantee Notice */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
        <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0" />
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            100% Escrow Protection Guaranteed
          </h4>
          <p className="mt-0.5 leading-relaxed">
            Coins are safely credited to your wallet immediately. Unused coins for cancelled or incomplete tasks can be reclaimed at any time without fees.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCoins;
