import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock123', {
  apiVersion: '2024-06-20' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock123';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      // Fallback for mock environments (accept the event anyway if it's a test)
      if (process.env.NODE_ENV === 'development') {
        event = JSON.parse(body);
      } else {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
      }
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout session ${session.id} completed!`);
        
        // 1. Get the userId or tenantDomain from session.metadata
        const metadata = session.metadata;
        
        // 2. Update the database to set subscription_status = 'active'
        console.log(`Upgrading subscription for tenant: ${metadata?.tenantDomain}`);
        
        // Mock update:
        // await db.from('tenants').update({ subscription_status: 'active', tier: 'Pro' }).eq('domain', metadata?.tenantDomain);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription ${subscription.id} deleted.`);
        // Handle cancellation
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
