'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { db } from '@/lib/appwrite';
import { DEFAULT_COIN_PACKAGES } from '@/constants';
import { formatCurrency, formatCoins } from '@/utils';
import { Coins, Check, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BuyCoinsPage() {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(DEFAULT_COIN_PACKAGES[1].id);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const handleCheckout = async () => {
    if (!selectedPackage || !email) {
      toast.error('Please select a package and verify your email');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with your actual Paystack public key
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        toast.error('Payment system not configured');
        setIsLoading(false);
        return;
      }

      const pkg = DEFAULT_COIN_PACKAGES.find((p) => p.id === selectedPackage);
      if (!pkg) {
        toast.error('Invalid package selected');
        setIsLoading(false);
        return;
      }

      // Initialize transaction on backend
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: pkg.price, // in Naira
          coins: pkg.coins + (pkg.bonus || 0),
          userId: user!.userId,
          packageId: pkg.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to initialize payment');
        setIsLoading(false);
        return;
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorizationUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred during checkout');
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Buy Coins
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Info Banner */}
            <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-900 dark:text-blue-100">
                  💡 How Coins Work
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800 dark:text-blue-200 space-y-2">
                <p>
                  • Each host has a per-minute rate in coins
                </p>
                <p>
                  • Coins are deducted during video calls
                </p>
                <p>
                  • When you run out of coins, the call ends automatically
                </p>
                <p>
                  • Unused coins never expire
                </p>
              </CardContent>
            </Card>

            {/* Coin Packages */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Package
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {DEFAULT_COIN_PACKAGES.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`cursor-pointer transition-all ${
                      selectedPackage === pkg.id
                        ? 'ring-2 ring-blue-500 shadow-lg'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && (
                      <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block absolute top-4 right-4">
                        POPULAR
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {formatCoins(pkg.coins)}
                        </p>
                        {pkg.bonus && pkg.bonus > 0 && (
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                            + {formatCoins(pkg.bonus)} bonus
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(pkg.price)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatCurrency(pkg.price / (pkg.coins + (pkg.bonus || 0)))} per coin
                        </p>
                      </div>
                      {selectedPackage === pkg.id && (
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                          <Check className="h-4 w-4 mr-2" />
                          Selected
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Checkout Section */}
            <Card>
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
                <CardDescription>
                  Review your purchase details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{email}</p>
                  </div>

                  {DEFAULT_COIN_PACKAGES.map((pkg) => {
                    if (pkg.id === selectedPackage) {
                      return (
                        <div key={pkg.id}>
                          <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {pkg.name} Package
                              </p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {formatCoins(pkg.coins)}
                                {pkg.bonus && pkg.bonus > 0 ? ` + ${formatCoins(pkg.bonus)} bonus` : ''}
                              </p>
                            </div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency(pkg.price)}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-300 dark:border-gray-600 font-bold">
                    <span>Total</span>
                    <span className="text-lg">
                      {DEFAULT_COIN_PACKAGES.find((p) => p.id === selectedPackage)
                        ? formatCurrency(
                            DEFAULT_COIN_PACKAGES.find((p) => p.id === selectedPackage)!.price
                          )
                        : formatCurrency(0)}
                    </span>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <p className="font-medium">Secure Payment</p>
                    <p>Your payment is processed securely by Paystack</p>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading || !selectedPackage}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Coins className="h-5 w-5 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  By clicking "Proceed to Payment", you agree to our Terms of Service and acknowledge that coins are non-refundable.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}