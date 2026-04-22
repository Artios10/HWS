// User types
export interface User {
  $id?: string;
  userId: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  age?: number;
  country?: string;
  interests: string[];
  accountType: 'user' | 'host';
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Host {
  $id?: string;
  userId: string;
  hostPhoto?: string;
  intro: string;
  ratePerMinute: number;
  isOnline: boolean;
  description?: string;
  earnings: number;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  $id?: string;
  userId: string;
  coinBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CoinTransaction {
  $id?: string;
  userId: string;
  type: 'purchase' | 'spend';
  amount: number;
  description: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface CallSession {
  $id?: string;
  sessionId: string;
  hostId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  coinsSpent?: number;
  status: 'active' | 'completed' | 'ended';
  createdAt: string;
}

export interface Earnings {
  $id?: string;
  hostId: string;
  callSessionId: string;
  amount: number;
  platformFee: number;
  netEarnings: number;
  status: 'pending' | 'paid';
  createdAt: string;
}

export interface WithdrawalRequest {
  $id?: string;
  hostId: string;
  amount: number;
  paymentMethod: string;
  paymentDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  processedAt?: string;
  createdAt: string;
}

export interface Report {
  $id?: string;
  reporterId: string;
  reportedId: string;
  type: 'user' | 'host';
  reason: string;
  description?: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface AppSettings {
  $id?: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean';
  updatedAt: string;
}

// Form types
export interface SignUpForm {
  email: string;
  password: string;
  displayName: string;
  accountType: 'user' | 'host';
  age?: number;
  country?: string;
}

export interface SignInForm {
  email: string;
  password: string;
}

export interface ProfileForm {
  displayName: string;
  bio?: string;
  age?: number;
  country?: string;
  interests: string[];
}

export interface HostProfileForm {
  intro: string;
  ratePerMinute: number;
  description?: string;
}

export interface WithdrawalForm {
  amount: number;
  paymentMethod: string;
  paymentDetails: string;
}

export interface ReportForm {
  reason: string;
  description?: string;
}

// API types
export interface PaystackInitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    amount: number;
    currency: string;
    transaction_date: string;
    status: string;
    reference: string;
    domain: string;
    metadata: any;
    gateway_response: string;
    message: string;
    channel: string;
    ip_address: string;
    log: any;
    fees: number;
    authorization: any;
    customer: any;
    plan: any;
  };
}

// Agora types
export interface AgoraTokenResponse {
  token: string;
  channel: string;
  uid: number;
}

// Coin packages
export interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  bonus?: number;
  popular?: boolean;
}

// App settings
export interface PlatformSettings {
  platformCommissionPercent: number;
  hostEarningPercent: number;
  minimumWithdrawalCoins: number;
  coinPackages: CoinPackage[];
}