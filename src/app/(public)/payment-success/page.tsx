'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle, Coins, Home, Download } from 'lucide-react';
import { formatCoins } from '@/utils';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const coins = searchParams.get('coins') || '0';
  const reference = searchParams.get('reference') || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-700 dark:text-green-400">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your coins have been added to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success Details */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Coins Added:</span>
              <span className="font-bold text-lg text-green-600">{formatCoins(parseInt(coins))}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Reference:</span>
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                {reference.substring(0, 20)}...
              </code>
            </div>
          </div>

          {/* What's Next */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              You can now:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <Coins className="h-4 w-4 mr-2 text-blue-600" />
                Start video calls with hosts
              </li>
              <li className="flex items-center">
                <Download className="h-4 w-4 mr-2 text-blue-600" />
                View your transaction history
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/discover" className="block">
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Start Video Calling
              </Button>
            </Link>
            <Link href="/wallet" className="block">
              <Button variant="outline" className="w-full">
                View Wallet
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            A confirmation email has been sent to your email address. Your coins will be available immediately.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}