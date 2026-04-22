'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 dark:bg-red-900 rounded-full p-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-red-700 dark:text-red-400">
            Payment Failed
          </CardTitle>
          <CardDescription>
            We were unable to process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Details */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {error === 'verification_failed'
                ? 'Payment verification failed. Please try again.'
                : 'Your payment could not be processed. Please check your card details and try again.'}
            </p>
            {reference && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                Reference: {reference}
              </p>
            )}
          </div>

          {/* Troubleshooting */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              What you can do:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Check your card details</li>
              <li>• Ensure sufficient funds</li>
              <li>• Try a different payment method</li>
              <li>• Contact your bank if issue persists</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/buy-coins" className="block">
              <Button className="w-full">
                Try Again
              </Button>
            </Link>
            <Link href="/dashboard" className="block">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Need help?{' '}
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@launchtime.com'}`}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}