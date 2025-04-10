import Stripe from 'stripe'
import { NextResponse, NextRequest } from 'next/server'

import { env } from '@/env'

const stripe = new Stripe(env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const response = JSON.parse(payload)

  const sig = req.headers.get('Stripe-Signature')!

  if (!sig) {
    return NextResponse.json({ error: 'Missing Stripe-Signature header' }, { status: 400 })
  }

  const dateTime = new Date(response?.created * 1000).toLocaleDateString()
  const timeString = new Date(response?.created * 1000).toLocaleTimeString()

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, env.STRIPE_WEBHOOK_SECRET!)

    console.log('Webhook received:', event)

    return NextResponse.json(
      {
        message: 'Webhook received successfully',
        event: event.type,
        dateTime: dateTime,
        timeString: timeString,
      },
      { status: 200 }
    )
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Webhook Error: ${err.message}`)
    } else {
      console.log('Webhook Error: An unknown error occurred')
    }
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }
}
