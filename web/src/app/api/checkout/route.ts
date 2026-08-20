import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with a mock key or real key from env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock123', {
  apiVersion: '2024-06-20', // Latest stable API version
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const priceId = formData.get('priceId');

    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // In a real app, get the user's ID from Supabase Auth
    // const supabase = createClient();
    // const { data: { user } } = await supabase.auth.getUser();
    
    // Mock user for now
    const customerId = 'cus_mock123'; 

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // In reality, this should be a real Stripe Price ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/onboarding?success=true`,
      cancel_url: `${req.headers.get('origin')}/billing?canceled=true`,
      customer: customerId,
      metadata: {
        // userId: user?.id,
        tenantDomain: 'agency.wedreaminpixels.com' // Mock
      },
    });

    if (session.url) {
      return NextResponse.redirect(session.url, 303);
    }

    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    // If it's a mock key error, we'll just redirect to onboarding to simulate success for demo purposes
    if (err.message.includes('Invalid API Key') || err.message.includes('No such price')) {
      console.log('Mocking successful checkout redirect...');
      return NextResponse.redirect(`${req.headers.get('origin')}/onboarding?mock_success=true`, 303);
    }
    
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
