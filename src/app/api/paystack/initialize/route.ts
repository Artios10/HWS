import { initializeTransaction } from '@/lib/paystack';
import { db } from '@/lib/appwrite';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount, coins, userId, packageId } = body;

    // Validate input
    if (!email || !amount || !coins || !userId || !packageId) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Replace with your actual Paystack callback URL
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/verify?userId=${userId}&coins=${coins}`;

    // Initialize Paystack transaction
    const response = await initializeTransaction({
      email,
      amount,
      reference: `launchtime_${userId}_${Date.now()}`,
      callback_url: callbackUrl,
      metadata: {
        userId,
        coins,
        packageId,
      },
    });

    if (!response.status) {
      return Response.json(
        { error: 'Failed to initialize payment' },
        { status: 400 }
      );
    }

    // Create pending transaction record
    try {
      await db.coinTransactions.create({
        userId,
        type: 'purchase',
        amount: coins,
        description: `Coin package purchase - ${packageId}`,
        reference: response.data.reference,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating transaction record:', error);
      // Continue anyway - transaction will be created on verification
    }

    return Response.json({
      success: true,
      authorizationUrl: response.data.authorization_url,
      accessCode: response.data.access_code,
      reference: response.data.reference,
    });
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}