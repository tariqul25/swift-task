import React from 'react';
import { Coins, CreditCard } from 'lucide-react';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useAxios from '../../../hooks/useAxios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PurchaseCoins = () => {
  const { user, updateUserCoins, coins,fetchUser } = useAuth();
  const axiosInstance=useAxios()
  const axiosSecure= useAxiosSecure()
  
  const coinPackages = [
    { coins: 10, price: 1, popular: false },
    { coins: 150, price: 10, popular: false },
    { coins: 500, price: 20, popular: true },
    { coins: 1000, price: 35, popular: false }
  ];

  const handlePayment = async (coinPackage) => {
    const { coins: coinsToAdd, price } = coinPackage;

    // Confirm purchase
    const confirm = await Swal.fire({
      title: 'Confirm Purchase',
      text: `Buy ${coinsToAdd} coins for $${price}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    });

    if (!confirm.isConfirmed) return;

    // Show loading popup
    Swal.fire({
      title: 'Processing Payment...',
      timer: 1500,
      didOpen: () => Swal.showLoading()
    });

    try {
      // Save payment info to backend
      await axiosSecure.post(`/api/payments`, {
        email: user.email,
        name: user.displayName,
        coins: coinsToAdd,
        amount: price,
        payment_date: new Date().toISOString(),
        method: 'nagad',
        status: 'successful'
      });
      // Update user's coins
      const updatedCoins = (coins || 0) + coinsToAdd;
      await axiosSecure.patch(`/api/users/coins/${user.email}`, {
        coins: updatedCoins
      });

      // Update local state/context
      updateUserCoins(updatedCoins);
      await fetchUser();

      Swal.fire({
        title: 'Success!',
        text: `${coinsToAdd} coins have been added to your account.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Payment error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Payment failed. Please try again.',
        icon: 'error'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Purchase Coins</h1>
        <p className="text-yellow-100">Buy coins to create tasks and pay workers</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 text-lg font-medium text-gray-700">
            <Coins className="w-6 h-6 text-yellow-600" />
            <span>Current Balance: {coins || 0} coins</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coinPackages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-white border-2 rounded-xl p-6 text-center transition-all hover:shadow-lg ${pkg.popular
                  ? 'border-blue-500 shadow-lg transform scale-105'
                  : 'border-gray-200 hover:border-blue-300'
                }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <Coins className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-gray-900">{pkg.coins}</h3>
                <p className="text-gray-600">Coins</p>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold text-green-600">${pkg.price}</div>
                <p className="text-sm text-gray-500">
                  ${(pkg.price / pkg.coins).toFixed(3)} per coin
                </p>
              </div>

              <button
                onClick={() => handlePayment(pkg)}
                className="w-full py-3 px-4 rounded-lg font-medium bg-yellow-600 text-white hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Purchase</span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Payment Information</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Dummy payment used for simulation.</li>
            <li>• In real app, integrate Stripe checkout.</li>
            <li>• Coin balance updates instantly.</li>
            <li>• Payment info is saved to backend.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCoins;
