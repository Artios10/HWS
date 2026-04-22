// App constants
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'LaunchTime';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@launchtime.com';

// Appwrite constants
export const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
export const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
export const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';

export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || '',
  HOSTS: process.env.NEXT_PUBLIC_APPWRITE_HOSTS_COLLECTION_ID || '',
  WALLETS: process.env.NEXT_PUBLIC_APPWRITE_WALLETS_COLLECTION_ID || '',
  COIN_TRANSACTIONS: process.env.NEXT_PUBLIC_APPWRITE_COIN_TRANSACTIONS_COLLECTION_ID || '',
  CALL_SESSIONS: process.env.NEXT_PUBLIC_APPWRITE_CALL_SESSIONS_COLLECTION_ID || '',
  EARNINGS: process.env.NEXT_PUBLIC_APPWRITE_EARNINGS_COLLECTION_ID || '',
  WITHDRAWAL_REQUESTS: process.env.NEXT_PUBLIC_APPWRITE_WITHDRAWAL_REQUESTS_COLLECTION_ID || '',
  REPORTS: process.env.NEXT_PUBLIC_APPWRITE_REPORTS_COLLECTION_ID || '',
  APP_SETTINGS: process.env.NEXT_PUBLIC_APPWRITE_APP_SETTINGS_COLLECTION_ID || '',
};

// Agora constants
export const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';

// Paystack constants
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
export const PAYSTACK_WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET || '';

// Admin constants
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim());

// Platform settings
export const PLATFORM_COMMISSION_PERCENT = parseInt(process.env.PLATFORM_COMMISSION_PERCENT || '10');
export const HOST_EARNING_PERCENT = parseInt(process.env.HOST_EARNING_PERCENT || '90');
export const MINIMUM_WITHDRAWAL_COINS = parseInt(process.env.MINIMUM_WITHDRAWAL_COINS || '1000');

// Default coin packages
export const DEFAULT_COIN_PACKAGES = [
  { id: 'starter', name: 'Starter', coins: 100, price: 500, bonus: 0 },
  { id: 'popular', name: 'Popular', coins: 250, price: 1200, bonus: 25, popular: true },
  { id: 'premium', name: 'Premium', coins: 500, price: 2300, bonus: 50 },
  { id: 'vip', name: 'VIP', coins: 1000, price: 4500, bonus: 100 },
];

// Routes
export const ROUTES = {
  HOME: '/',
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  DISCOVER: '/discover',
  WALLET: '/wallet',
  BUY_COINS: '/buy-coins',
  CALL: '/call',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HOST_DASHBOARD: '/host',
  HOST_EARNINGS: '/host/earnings',
  HOST_WITHDRAWAL: '/host/withdrawal',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_HOSTS: '/admin/hosts',
  ADMIN_TRANSACTIONS: '/admin/transactions',
  ADMIN_WITHDRAWALS: '/admin/withdrawals',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  COMMUNITY_RULES: '/community-rules',
};

// Account types
export const ACCOUNT_TYPES = {
  USER: 'user',
  HOST: 'host',
  ADMIN: 'admin',
} as const;

// Call statuses
export const CALL_STATUSES = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ENDED: 'ended',
} as const;

// Transaction types
export const TRANSACTION_TYPES = {
  PURCHASE: 'purchase',
  SPEND: 'spend',
} as const;

// Transaction statuses
export const TRANSACTION_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Withdrawal statuses
export const WITHDRAWAL_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Report reasons
export const REPORT_REASONS = [
  'Inappropriate behavior',
  'Harassment',
  'Spam',
  'Fake profile',
  'Underage',
  'Other',
];

// Countries (simplified list)
export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Japan',
  'South Korea',
  'Singapore',
  'India',
  'Brazil',
  'Mexico',
  'Argentina',
  'South Africa',
  'Nigeria',
  'Egypt',
  'Kenya',
  'Ghana',
  'Other',
];

// Interests
export const INTERESTS = [
  'Music',
  'Sports',
  'Travel',
  'Food',
  'Movies',
  'Books',
  'Art',
  'Photography',
  'Gaming',
  'Technology',
  'Fitness',
  'Fashion',
  'Nature',
  'Cooking',
  'Dancing',
  'Writing',
  'Photography',
  'Yoga',
  'Meditation',
  'Volunteering',
];