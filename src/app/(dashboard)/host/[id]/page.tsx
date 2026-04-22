'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { db } from '@/lib/appwrite';
import { Host, Wallet } from '@/types';
import { formatCoins } from '@/utils';
import { Video, Star, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HostProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const hostId = params.id as string;

  const [host, setHost] = useState<Host | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hostId && user) {
      loadHostData();
      loadWallet();
    }
  }, [hostId, user]);

  const loadHostData = async () => {
    try {
      const hostData = await db.hosts.get(hostId);
      setHost(hostData);
    } catch (error) {
      console.error('Error loading host:', error);
      toast.error('Failed to load host profile');
    } finally {
      setIsLoading(false);
    }
  };

  const loadWallet = async () => {
    try {
      const walletData = await db.wallets.get(user!.userId);
      setWallet(walletData);
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!host) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Host not found
              </h1>
              <Link href="/discover">
                <Button>Back to Discover</Button>
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handleStartCall = async () => {
    // Check if user has minimum coins
    if (!wallet || wallet.coinBalance < host.ratePerMinute) {
      toast.error('Insufficient coins. Please buy coins first.');
      router.push('/buy-coins');
      return;
    }

    // Start call - create session and navigate to call page
    try {
      const callSessionData = {
        sessionId: `call_${Date.now()}`,
        hostId: host.$id,
        userId: user!.userId,
        startTime: new Date().toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      const session = await db.callSessions.create(callSessionData);
      toast.success('Call session created. Starting video call...');
      router.push(`/call/${session.$id}`);
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start call');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Link href="/discover" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Discover
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Host Info */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        {host.hostPhoto ? (
                          <img
                            src={host.hostPhoto}
                            alt={host.intro}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-3xl font-bold">
                              {host.intro.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-3xl">{host.intro}</CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className={`w-3 h-3 rounded-full ${host.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {host.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">4.8</span>
                              <span className="text-xs text-gray-500">(245 reviews)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Video className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium">1,230 calls</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* About */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {host.description || 'No description provided'}
                    </p>
                  </CardContent>
                </Card>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Rate per minute</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {formatCoins(host.ratePerMinute)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Video className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Response time</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          ~2 min
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Call Action Sidebar */}
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Ready to Connect?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Your coin balance
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {wallet ? formatCoins(wallet.coinBalance) : '0 coins'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Costs {formatCoins(host.ratePerMinute)} per minute
                      </p>
                    </div>

                    {wallet && wallet.coinBalance < host.ratePerMinute ? (
                      <div>
                        <p className="text-sm text-red-600 dark:text-red-400 mb-3 font-medium">
                          ⚠️ Not enough coins to start a call
                        </p>
                        <Link href="/buy-coins" className="block">
                          <Button className="w-full" variant="default">
                            Buy Coins Now
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={handleStartCall}
                        disabled={!host.isOnline}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {host.isOnline ? 'Start Video Call' : 'Host is Offline'}
                      </Button>
                    )}

                    <Button variant="outline" className="w-full">
                      Report Profile
                    </Button>

                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <p>✓ Verified Profile</p>
                      <p>✓ SSL Encrypted Calls</p>
                      <p>✓ 24/7 Support Available</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}