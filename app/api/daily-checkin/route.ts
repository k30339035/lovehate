import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hasCheckedInToday, awardUserPoints, DAILY_CHECKIN_REASON, DAILY_CHECKIN_POINTS } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '')
    if (!token || !supabaseAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    const already = await hasCheckedInToday(user.id)
    if (already) {
      return NextResponse.json({
        success: false,
        alreadyClaimed: true,
        message: '오늘은 이미 출석했습니다.',
      })
    }

    const result = await awardUserPoints(user.id, DAILY_CHECKIN_POINTS, DAILY_CHECKIN_REASON)
    if (!result) {
      return NextResponse.json({ error: 'Failed to award points' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      alreadyClaimed: false,
      points: DAILY_CHECKIN_POINTS,
      totalPoints: result.total_points,
    })
  } catch (error) {
    console.error('Daily checkin claim error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
