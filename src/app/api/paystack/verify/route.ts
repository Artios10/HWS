import { verifyTransaction } from '@/lib/paystack';
import { db } from '@/lib/appwrite';
import { PLATFORM_COMMISSION_PERCENT } from '@/constants';

// TODO: Replace with your own backend - Payment Verification API Route
// This API route handles payment verification and coin crediting
// You'll need to:
// 1. Replace Paystack verification with your payment processor's webhook/callback
// 2. Update database operations to use your backend
// 3. Implement proper transaction handling and rollback on failures
// 4. Handle duplicate webhook calls to prevent double crediting

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const userId = searchParams.get('userId');
    const coins = searchParams.get('coins');

    if (!reference || !userId || !coins) {
      return new Response('Missing parameters', { status: 400 });
    }

    // TODO: Replace with your own backend - Payment Verification
    // Replace this Paystack verification with your payment processor's verification
    const response = await verifyTransaction(reference);

    if (!response.status) {
      return new Response('Payment verification failed', { status: 400 });
    }

    const paymentData = response.data;

    // Check if payment was successful
    if (paymentData.status !== 'success') {
      // TODO: Replace with your own backend - Failed Transaction Handling
      // Update transaction status in your database
      try {
        const txns = await db.coinTransactions.list([
          `reference=${reference}`,
        ]);
        if (txns.documents.length > 0) {
          await db.coinTransactions.update(txns.documents[0].$id, {
            status: 'failed',
          });
        }
      } catch (error) {
        console.error('Error updating failed transaction:', error);
      }

      return new Response('Payment not successful', { status: 400 });
    }

    // TODO: Replace with your own backend - Coin Crediting Logic
    // Credit coins to user wallet in your database
    try {
      // Get current wallet
      const wallet = await db.wallets.get(userId);

      // Update wallet with new coin balance
      const coinsToAdd = parseInt(coins);
      const newBalance = wallet.coinBalance + coinsToAdd;

      await db.wallets.update(userId, {
        coinBalance: newBalance,
        updatedAt: new Date().toISOString(),
      });

      // Create/update transaction record
      const txns = await db.coinTransactions.list([
        `reference=${reference}`,
      ]);

      if (txns.documents.length > 0) {
        await db.coinTransactions.update(txns.documents[0].$id, {
          status: 'completed',
        });
      } else {
        await db.coinTransactions.create({
          userId,
          type: 'purchase',
          amount: coinsToAdd,
          description: 'Coin purchase via Paystack',
          reference,
          status: 'completed',
          createdAt: new Date().toISOString(),
        });
      }

      // TODO: Send confirmation email to user
      // TODO: Update admin dashboard with payment record

      // Redirect to success page
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?coins=${coinsToAdd}&reference=${reference}`,
        302
      );
    } catch (error: any) {
      console.error('Error crediting coins:', error);

      // Update transaction as failed
      try {
        const txns = await db.coinTransactions.list([
          `reference=${reference}`,
        ]);
        if (txns.documents.length > 0) {
          await db.coinTransactions.update(txns.documents[0].$id, {
            status: 'failed',
          });
        }
      } catch (updateError) {
        console.error('Error updating transaction status:', updateError);
      }

      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed?reference=${reference}`,
        302
      );
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed?error=verification_failed`,
      302
    );
  }
}

// Webhook endpoint for Paystack to verify payments
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-paystack-signature');

    // TODO: Verify webhook signature with Paystack webhook secret
    // const expectedSignature = crypto
    //   .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
    //   .update(JSON.stringify(body))
    //   .digest('hex');
    // if (signature !== expectedSignature) {
    //   return Response.json({ error: 'Invalid signature' }, { status: 403 });
    // }

    const event = body.event;
    const data = body.data;

    if (event === 'charge.success') {
      const { reference, customer, metadata, amount } = data;
      const userId = metadata?.userId;
      const coins = metadata?.coins;

      if (!userId || !coins) {
        console.error('Invalid webhook data:', body);
        return Response.json({ error: 'Invalid metadata' }, { status: 400 });
      }

      // Credit coins to user
      try {
        const wallet = await db.wallets.get(userId);
        const newBalance = wallet.coinBalance + coins;

        await db.wallets.update(userId, {
          coinBalance: newBalance,
          updatedAt: new Date().toISOString(),
        });

        // Update or create transaction
        const txns = await db.coinTransactions.list([
          `reference=${reference}`,
        ]);

        if (txns.documents.length > 0) {
          await db.coinTransactions.update(txns.documents[0].$id, {
            status: 'completed',
          });
        } else {
          await db.coinTransactions.create({
            userId,
            type: 'purchase',
            amount: coins,
            description: 'Coin purchase via Paystack',
            reference,
            status: 'completed',
            createdAt: new Date().toISOString(),
          });
        }

        console.log(`Coins credited: ${coins} to user ${userId}`);
      } catch (error) {
        console.error('Error crediting coins from webhook:', error);
        return Response.json(
          { error: 'Failed to credit coins' },
          { status: 500 }
        );
      }
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}