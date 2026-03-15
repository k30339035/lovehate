import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import {
  getUserByEmail,
  createUser,
  saveSubscription,
  cancelSubscription,
} from '@/lib/db'

export const dynamic = 'force-dynamic'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe secret key not configured' },
      { status: 500 }
    )
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // 결제 성공 처리
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Stripe에서 고객 정보 가져오기
      const customerId = session.customer as string
      const customer = await stripe.customers.retrieve(customerId)

      if (typeof customer === 'object' && !customer.deleted && customer.email) {
        // 사용자 조회 또는 생성
        let user = await getUserByEmail(customer.email)

        if (!user) {
          user = await createUser(
            customer.email,
            typeof customer.name === 'string' ? customer.name : undefined
          )
        }

        if (user && session.subscription) {
          // 구독 정보 가져오기
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          // 데이터베이스에 구독 정보 저장
          await saveSubscription(
            user.id,
            customerId,
            subscription.id,
            session.metadata?.planName || 'Unknown',
            subscription.status === 'active' ? 'active' : 'cancelled',
            new Date((subscription as any).current_period_start * 1000),
            new Date((subscription as any).current_period_end * 1000)
          )

          console.log('Subscription saved to database:', subscription.id)
        }
      }
    } catch (error: any) {
      console.error('Error processing checkout session:', error)
    }
  }

  // 구독 업데이트 처리
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription

    try {
      const customerId = subscription.customer as string
      const customer = await stripe.customers.retrieve(customerId)

      if (typeof customer === 'object' && !customer.deleted && customer.email) {
        const user = await getUserByEmail(customer.email)

        if (user) {
          await saveSubscription(
            user.id,
            customerId,
            subscription.id,
            subscription.metadata?.planName || 'Unknown',
            subscription.status === 'active' ? 'active' : 'cancelled',
            new Date((subscription as any).current_period_start * 1000),
            new Date((subscription as any).current_period_end * 1000)
          )
        }
      }
    } catch (error: any) {
      console.error('Error updating subscription:', error)
    }
  }

  // 구독 취소 처리
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription

    try {
      await cancelSubscription(subscription.id)
      console.log('Subscription cancelled in database:', subscription.id)
    } catch (error: any) {
      console.error('Error cancelling subscription:', error)
    }
  }

  return NextResponse.json({ received: true })
}


