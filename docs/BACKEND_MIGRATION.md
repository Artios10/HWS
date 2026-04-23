# Backend Migration Guide

This guide outlines all the places in the codebase where you need to replace external services with your own backend implementation.

## 🔄 Services to Replace

### 1. Database & Authentication (Appwrite)
**Files to modify:**
- `src/lib/appwrite.ts` - Replace entire file with your backend API calls
- `src/constants/index.ts` - Update environment variables
- `src/hooks/useAuth.ts` - Replace authentication logic
- `.env.example` - Update environment variables

**What to implement:**
- User registration/login/logout
- Database CRUD operations for all entities (users, hosts, wallets, transactions, etc.)
- File storage operations
- Session management

### 2. Payment Processing (Paystack)
**Files to modify:**
- `src/lib/paystack.ts` - Replace with your payment processor
- `src/app/api/paystack/initialize/route.ts` - Payment initialization API
- `src/app/api/paystack/verify/route.ts` - Payment verification API
- `src/constants/index.ts` - Update payment constants
- `.env.example` - Update payment environment variables

**What to implement:**
- Payment initialization
- Payment verification/webhooks
- Transaction recording
- Coin crediting logic

### 3. Video Calling (Agora)
**Files to modify:**
- `src/lib/agora.ts` - Replace with your video calling service
- `src/constants/index.ts` - Update video service constants
- `.env.example` - Update video service credentials

**What to implement:**
- Video call token generation
- Room/channel creation
- Video call lifecycle management

## 📋 Step-by-Step Migration

### Step 1: Choose Your Services
1. **Database:** Supabase, Firebase, PlanetScale + Prisma, MongoDB, PostgreSQL
2. **Authentication:** NextAuth.js, Supabase Auth, Firebase Auth, custom JWT
3. **Payments:** Stripe, PayPal, Flutterwave, local payment processors
4. **Video:** Twilio Video, Daily.co, 100ms, custom WebRTC

### Step 2: Set Up Environment Variables
Update `.env.example` and create `.env.local` with your service credentials.

### Step 3: Implement Database Layer
Replace `src/lib/appwrite.ts` with your database operations:
```typescript
// Example with Supabase
export const db = {
  users: {
    get: (userId: string) => supabase.from('users').select('*').eq('id', userId).single(),
    create: (data: any) => supabase.from('users').insert(data).select().single(),
    // ... other operations
  },
  // ... other collections
};
```

### Step 4: Implement Authentication
Replace authentication logic in `src/hooks/useAuth.ts` and auth helpers.

### Step 5: Implement Payments
Replace Paystack integration with your payment processor's API.

### Step 6: Implement Video Calling
Replace Agora with your video calling service.

### Step 7: Update API Routes
Modify all API routes in `src/app/api/` to use your new services.

## ⚠️ Important Notes

- **Security:** Ensure proper API key management and never expose secrets to the client
- **Error Handling:** Implement comprehensive error handling for all operations
- **Data Validation:** Use Zod schemas for data validation
- **Testing:** Test all payment flows and video calls thoroughly
- **Compliance:** Ensure PCI compliance for payment handling

## 🔧 Development Tips

1. Start with authentication and basic user management
2. Implement payments next (critical for monetization)
3. Add video calling functionality
4. Test end-to-end user flows
5. Implement proper error boundaries and loading states

## 📞 Support

If you need help with any specific service integration, check the official documentation for your chosen services or ask for specific implementation guidance.</content>
<parameter name="filePath">/workspaces/HWS/BACKEND_MIGRATION.md