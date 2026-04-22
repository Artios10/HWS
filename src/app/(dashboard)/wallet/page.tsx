'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { db } from '@/lib/appwrite';
import { Wallet, CoinTransaction } from '@/types';
import { formatCoins, formatDate, formatRelativeTime } from '@/utils';
import { Coins, TrendingUp, TrendingDown, Download, Filter } from 'lucide-react';
import Link from 'next/link';

export default function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'purchase' | 'spend'>('all');

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user]);

  const loadWalletData = async () => {
    try {
      const walletData = await db.wallets.get(user!.userId);
      setWallet(walletData);

      const txData = await db.coinTransactions.list([
        `userId=${user!.userId}`,
        'orderBy=$createdAt',
        'orderType=desc',
        'limit=50',
      ]);
      setTransactions(txData.documents);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (tx) => filterType === 'all' || tx.type === filterType
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Wallet
              </h1>
              <Link href="/buy-coins">
                <Button>
                  <Coins className="h-4 w-4 mr-2" />
                  Buy Coins
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Balance Card */}
            <Card className="mb-8 bg-gradient-to-br from-blue-500 to-purple-600 border-0">
              <CardHeader>
                <CardTitle className="text-white text-3xl">
                  {wallet ? formatCoins(wallet.coinBalance) : '0 coins'}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Available balance
                </CardDescription>
              </CardHeader>
              <CardContent className="text-white space-y-4">
                <p className="text-sm opacity-90">
                  Use coins to connect with hosts through video calls. Each minute of calling costs
                  coins based on the host's rate.
                </p>
                <div className="flex gap-3">
                  <Link href="/buy-coins" className="flex-1">
                    <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                      Buy More Coins
                    </Button>
                  </Link>
                  <button className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors">
                    <Download className="h-4 w-4 inline mr-2" />
                    Export History
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      View your coin purchases and spending
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                    >
                      <option value="all">All Transactions</option>
                      <option value="purchase">Purchases</option>
                      <option value="spend">Spent</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No {filterType === 'all' ? 'transactions' : filterType} yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredTransactions.map((tx) => (
                      <div
                        key={tx.$id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                              tx.type === 'purchase'
                                ? 'bg-green-100 dark:bg-green-900'
                                : 'bg-red-100 dark:bg-red-900'
                            }`}
                          >
                            {tx.type === 'purchase' ? (
                              <TrendingUp className={`h-5 w-5 ${tx.type === 'purchase' ? 'text-green-600' : 'text-red-600'}`} />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {tx.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatRelativeTime(tx.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold text-lg ${
                              tx.type === 'purchase'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {tx.type === 'purchase' ? '+' : '-'}{formatCoins(tx.amount)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {tx.status === 'completed' ? '✓' : '⏳'} {tx.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}