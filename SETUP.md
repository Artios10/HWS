# LaunchTime Setup Guide

This guide will help you set up LaunchTime from scratch. Follow each step carefully to get your video-call dating app ready for launch.

## Prerequisites

- Node.js 18+ and npm
- A domain name for production
- Accounts for external services

## 1. External Accounts Setup

### Appwrite Setup
1. Go to [Appwrite Cloud](https://cloud.appwrite.io) and create an account
2. Create a new project called "LaunchTime"
3. Add your domain to the platforms (for production, add your domain; for development, add http://localhost:3000)
4. Go to Database > Create Database called "LaunchTimeDB"
5. Create the following collections with these attributes:

#### Users Collection
- **Collection ID**: users
- **Permissions**: Read: Any, Write: Users
- Attributes:
  - `userId` (string, required) - Appwrite user ID
  - `email` (string, required)
  - `displayName` (string, required)
  - `bio` (string)
  - `avatarUrl` (string)
  - `age` (number)
  - `country` (string)
  - `interests` (string[]) - array of strings
  - `accountType` (string, required) - "user" or "host"
  - `isOnline` (boolean, default: false)
  - `createdAt` (datetime, required)
  - `updatedAt` (datetime, required)

#### Hosts Collection
- **Collection ID**: hosts
- **Permissions**: Read: Any, Write: Users
- Attributes:
  - `userId` (string, required)
  - `hostPhoto` (string)
  - `intro` (string, required)
  - `ratePerMinute` (number, required) - coins per minute
  - `isOnline` (boolean, default: false)
  - `description` (string)
  - `earnings` (number, default: 0)
  - `createdAt` (datetime, required)
  - `updatedAt` (datetime, required)

#### Wallets Collection
- **Collection ID**: wallets
- **Permissions**: Read: Users, Write: Users
- Attributes:
  - `userId` (string, required)
  - `coinBalance` (number, required, default: 0)
  - `createdAt` (datetime, required)
  - `updatedAt` (datetime, required)

#### Coin Transactions Collection
- **Collection ID**: coin_transactions
- **Permissions**: Read: Users, Write: Server
- Attributes:
  - `userId` (string, required)
  - `type` (string, required) - "purchase" or "spend"
  - `amount` (number, required)
  - `description` (string, required)
  - `reference` (string) - payment reference
  - `status` (string, required) - "pending", "completed", "failed"
  - `createdAt` (datetime, required)

#### Call Sessions Collection
- **Collection ID**: call_sessions
- **Permissions**: Read: Users, Write: Server
- Attributes:
  - `sessionId` (string, required)
  - `hostId` (string, required)
  - `userId` (string, required)
  - `startTime` (datetime, required)
  - `endTime` (datetime)
  - `durationMinutes` (number)
  - `coinsSpent` (number)
  - `status` (string, required) - "active", "completed", "ended"
  - `createdAt` (datetime, required)

#### Earnings Collection
- **Collection ID**: earnings
- **Permissions**: Read: Users, Write: Server
- Attributes:
  - `hostId` (string, required)
  - `callSessionId` (string, required)
  - `amount` (number, required)
  - `platformFee` (number, required)
  - `netEarnings` (number, required)
  - `status` (string, required) - "pending", "paid"
  - `createdAt` (datetime, required)

#### Withdrawal Requests Collection
- **Collection ID**: withdrawal_requests
- **Permissions**: Read: Users, Write: Users (for creation), Server (for updates)
- Attributes:
  - `hostId` (string, required)
  - `amount` (number, required)
  - `paymentMethod` (string, required)
  - `paymentDetails` (string, required)
  - `status` (string, required) - "pending", "approved", "rejected"
  - `processedAt` (datetime)
  - `createdAt` (datetime, required)

#### Reports Collection
- **Collection ID**: reports
- **Permissions**: Read: Server, Write: Users
- Attributes:
  - `reporterId` (string, required)
  - `reportedId` (string, required)
  - `type` (string, required) - "user" or "host"
  - `reason` (string, required)
  - `description` (string)
  - `status` (string, required) - "open", "resolved"
  - `createdAt` (datetime, required)

#### App Settings Collection
- **Collection ID**: app_settings
- **Permissions**: Read: Any, Write: Server
- Attributes:
  - `key` (string, required)
  - `value` (string, required)
  - `type` (string, required) - "string", "number", "boolean"
  - `updatedAt` (datetime, required)

6. Create indexes as needed (e.g., on userId for queries)
7. Note down all the IDs from the collections

### Agora Setup
1. Go to [Agora Console](https://console.agora.io)
2. Create a new project called "LaunchTime"
3. Get your App ID and App Certificate
4. For production, set up token server (you can use Appwrite functions for this)

### Paystack Setup
1. Go to [Paystack](https://dashboard.paystack.com) and create an account
2. Get your Public Key and Secret Key
3. Set up webhook URL: `https://yourdomain.com/api/paystack/webhook`
4. Note the webhook secret

## 2. Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in all the values from your accounts
3. For production, set NEXT_PUBLIC_APP_URL to your domain

## 3. Install Dependencies

```bash
npm install
```

## 4. Run the App

```bash
npm run dev
```

## 5. Seed Data (Optional)

Run the seed script to add demo data:

```bash
npm run seed
```

## 6. Deployment

### Vercel Deployment
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Domain Setup
- Point your domain to Vercel
- Update Appwrite platforms with your domain
- Update Paystack webhook URL

## 7. Launch Checklist

- [ ] Replace all TODO comments with your values
- [ ] Test authentication flow
- [ ] Test coin purchases
- [ ] Test video calls
- [ ] Test admin panel
- [ ] Update legal pages
- [ ] Set up monitoring
- [ ] Test on mobile devices
- [ ] Update app name and branding
- [ ] Configure commission rates
- [ ] Set up customer support

## 8. Post-Launch

- Monitor Appwrite usage
- Check Paystack transactions
- Handle withdrawal requests manually initially
- Update app settings as needed