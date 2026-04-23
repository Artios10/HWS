import axios from 'axios';
import { PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY } from '@/constants';

// TODO: Replace with your own backend - Payment Processing
// Replace this entire file with your own payment processor
// This file handles all payment operations using Paystack
// You'll need to:
// 1. Choose a payment processor (Stripe, PayPal, Flutterwave, etc.)
// 2. Replace all payment functions with your chosen processor's API
// 3. Update webhook handling for payment confirmations
// 4. Ensure PCI compliance for payment data handling

// TODO: replace with your Paystack secret key on the server only
const paystackSecret = PAYSTACK_SECRET_KEY;

// Server-side Paystack client
export const paystackServer = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${paystackSecret}`,
    'Content-Type': 'application/json',
  },
});

// TODO: Replace with your own backend - Payment Functions
// Replace these functions with your payment processor's API calls

// Initialize transaction
export const initializeTransaction = async (data: {
  email: string;
  amount: number;
  reference?: string;
  callback_url?: string;
  metadata?: any;
}) => {
  try {
    const response = await paystackServer.post('/transaction/initialize', {
      ...data,
      amount: data.amount * 100, // Convert to kobo
    });
    return response.data;
  } catch (error) {
    console.error('Paystack initialize error:', error);
    throw error;
  }
};

// Verify transaction
export const verifyTransaction = async (reference: string) => {
  try {
    const response = await paystackServer.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Paystack verify error:', error);
    throw error;
  }
};

// Get transaction
export const getTransaction = async (id: string) => {
  try {
    const response = await paystackServer.get(`/transaction/${id}`);
    return response.data;
  } catch (error) {
    console.error('Paystack get transaction error:', error);
    throw error;
  }
};

// List transactions
export const listTransactions = async (params?: {
  reference?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
}) => {
  try {
    const response = await paystackServer.get('/transaction', { params });
    return response.data;
  } catch (error) {
    console.error('Paystack list transactions error:', error);
    throw error;
  }
};

// Client-side Paystack (for inline script)
export const paystackPublicKey = PAYSTACK_PUBLIC_KEY;