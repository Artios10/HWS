'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth, db } from '@/lib/appwrite';
import { account } from '@/lib/appwrite';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { APP_NAME, COUNTRIES, INTERESTS } from '@/constants';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  accountType: z.enum(['user', 'host'], {
    required_error: 'Please select an account type',
  }),
  age: z.number().min(18, 'You must be at least 18 years old').optional(),
  country: z.string().optional(),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const accountType = watch('accountType');

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    try {
      // Create Appwrite account
      const user = await auth.signUp(data.email, data.password, data.displayName);

      // Create user profile in database
      await db.users.create({
        userId: user.$id,
        email: data.email,
        displayName: data.displayName,
        accountType: data.accountType,
        age: data.age,
        country: data.country,
        interests: [],
        isOnline: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Create wallet for user
      await db.wallets.create({
        userId: user.$id,
        coinBalance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success('Account created successfully! Please check your email for verification.');

      // Redirect to sign in
      router.push('/sign-in?message=Account created successfully. Please sign in.');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join {APP_NAME}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create your account to start connecting
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Fill in your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="form-input"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="displayName" className="form-label">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  {...register('displayName')}
                  className="form-input"
                  placeholder="Enter your display name"
                />
                {errors.displayName && (
                  <p className="form-error">{errors.displayName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="form-input"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="form-error">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="accountType" className="form-label">
                  Account Type
                </label>
                <select
                  id="accountType"
                  {...register('accountType')}
                  className="form-input"
                >
                  <option value="">Select account type</option>
                  <option value="user">User - I want to meet hosts</option>
                  <option value="host">Host - I want to host video calls</option>
                </select>
                {errors.accountType && (
                  <p className="form-error">{errors.accountType.message}</p>
                )}
              </div>

              {accountType === 'user' && (
                <>
                  <div>
                    <label htmlFor="age" className="form-label">
                      Age (Optional)
                    </label>
                    <input
                      id="age"
                      type="number"
                      {...register('age', { valueAsNumber: true })}
                      className="form-input"
                      placeholder="Enter your age"
                      min="18"
                    />
                    {errors.age && (
                      <p className="form-error">{errors.age.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="country" className="form-label">
                      Country (Optional)
                    </label>
                    <select
                      id="country"
                      {...register('country')}
                      className="form-input"
                    >
                      <option value="">Select your country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/sign-in"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}