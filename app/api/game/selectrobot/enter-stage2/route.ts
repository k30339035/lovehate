import { NextRequest, NextResponse } from 'next/server'
import { upsertMinimalUser, getUserPoints, awardUserPoints, DAILY_CHECKIN_REASON } from '@/lib/db'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CORS_ALLOW_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400, headers: corsHeaders })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400, headers: corsHeaders })
    }

    const user = await upsertMinimalUser(email)
    if (!user) {
      return NextResponse.json({ error: 'Failed to create or find user' }, { status: 500, headers: corsHeaders })
    }

    // Check today's play logs
    const now = new Date()
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    const end = new Date(start)
    end.setUTCDate(end.getUTCDate() + 1)
    const startStr = start.toISOString()
    const endStr = end.toISOString()

    const { data: logs, error: logError } = await supabaseAdmin!
      .from('point_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('reason', 'selectrobot_play')
      .gte('created_at', startStr)
      .lt('created_at', endStr)

    if (logError && logError.code !== 'PGRST116') {
      console.error('Error fetching point logs:', logError)
      return NextResponse.json({ error: 'Database check error' }, { status: 500, headers: corsHeaders })
    }

    const playCountToday = logs?.length || 0

    if (playCountToday === 0) {
      // First play today: Free
      const { error: insertError } = await supabaseAdmin!
        .from('point_logs')
        .insert({
          user_id: user.id,
          points_delta: 0,
          reason: 'selectrobot_play',
        })
      
      if (insertError) {
         console.error('Failed to log free play', insertError)
      }

      return NextResponse.json(
        { success: true, message: '오늘 첫 플레이입니다. 무료로 2단계에 진입합니다.', free: true },
        { headers: corsHeaders }
      )
    } else {
      // Subsequent plays: Requires 100 points
      const pointsData = await getUserPoints(user.id)
      const currentPoints = pointsData?.total_points || 0

      if (currentPoints < 100) {
        return NextResponse.json(
          { 
            success: false, 
            error: `포인트가 부족합니다. 최소 100포인트가 필요합니다. (현재: ${currentPoints}점)`,
            currentPoints 
          }, 
          { status: 403, headers: corsHeaders }
        )
      }

      // Deduct 100 points
      await awardUserPoints(user.id, -100, 'selectrobot_play')

      return NextResponse.json(
        { 
          success: true, 
          message: `100 포인트가 차감되었습니다. (잔여: ${currentPoints - 100}점)`,
          free: false,
          deducted: 100,
          remainingPoints: currentPoints - 100
        },
        { headers: corsHeaders }
      )
    }

  } catch (error: any) {
    console.error('SelectRobot enter-stage2 error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
