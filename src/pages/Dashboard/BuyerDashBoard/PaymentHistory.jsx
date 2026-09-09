import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle2, Clock, Coins, Receipt } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/api/payments/${user.email}`)
        .then(res => {
          setPayments(res.data || []);
        })
        .catch(error => {
          console.error("Error fetching payments:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [user?.email]);

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === 'success' || s === 'successful' || s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Successful
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
        <Clock className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-primary" />
            Payment History & Invoices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official records for coin purchases and deposits into SwiftTasks escrow.
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Transaction ID</th>
                <th className="py-3.5 px-6 font-semibold">Coins Credited</th>
                <th className="py-3.5 px-6 font-semibold">Amount (USD)</th>
                <th className="py-3.5 px-6 font-semibold">Method</th>
                <th className="py-3.5 px-6 font-semibold">Date</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="mt-3 text-xs">Loading transaction records...</p>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No payment history found. Purchase coins to see receipts here.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-slate-600 dark:text-slate-400">
                      {payment._id}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Coins className="w-3.5 h-3.5" />
                        +{payment.coins}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                      ${payment.amount}.00
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-400 capitalize">
                      {payment.method || 'Card'}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(payment.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
