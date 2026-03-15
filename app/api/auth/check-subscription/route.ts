import { NextRequest, NextResponse } from 'next/server'
import { getSubscriptionByUserId, getUserByEmail } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
 
    // 사용자 조회
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 구독 정보 조회
    const subscription = await getSubscriptionByUserId(user.id)

    return NextResponse.json({
      success: true,
      hasSubscription: !!subscription,
      subscription: subscription
        ? {
            planName: subscription.plan_name,
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end,
          }
        : null,
    })
  } catch (error: any) {
    console.error('Check subscription error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
