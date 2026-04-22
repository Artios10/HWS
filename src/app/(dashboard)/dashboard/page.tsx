'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { db } from '@/lib/appwrite';
import { Wallet, CallSession } from '@/types';
import { formatCoins, formatCurrency } from '@/utils';
import { Video, Coins, Clock, TrendingUp, Users, Settings } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [recentCalls, setRecentCalls] = useState<CallSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load wallet
      const walletData = await db.wallets.get(user!.userId);
      setWallet(walletData);

      // Load recent calls
      const calls = await db.callSessions.list([
        `userId=${user!.userId}`,
        'orderBy=$createdAt',
        'orderType=desc',
        'limit=5',
      ]);
      setRecentCalls(calls.documents);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
                Dashboard
              </h1>
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" size="sm">
                    Settings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.displayName}!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Ready to connect with amazing people?
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Coin Balance</CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {wallet ? formatCoins(wallet.coinBalance) : '0 coins'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available for calls
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentCalls.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Calls made this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Coins Spent</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCoins(recentCalls.reduce((total, call) => total + (call.coinsSpent || 0), 0))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Find Hosts</CardTitle>
                  <CardDescription>
                    Browse available hosts and start a conversation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/discover">
                    <Button className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Discover Hosts
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Buy Coins</CardTitle>
                  <CardDescription>
                    Top up your balance to keep the conversations going
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/buy-coins">
                    <Button variant="outline" className="w-full">
                      <Coins className="h-4 w-4 mr-2" />
                      Buy Coins
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Recent Calls */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Calls</CardTitle>
                <CardDescription>
                  Your recent video call history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentCalls.length === 0 ? (
                  <div className="text-center py-8">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No calls yet. Start by discovering hosts!
                    </p>
                    <Link href="/discover" className="mt-4 inline-block">
                      <Button>Browse Hosts</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentCalls.map((call) => (
                      <div key={call.$id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                            <Video className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Call with Host
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(call.startTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatCoins(call.coinsSpent || 0)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {call.durationMinutes ? `${call.durationMinutes} min` : 'In progress'}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-4">
                      <Link href="/call-history">
                        <Button variant="outline">View All Calls</Button>
                      </Link>
                    </div>
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