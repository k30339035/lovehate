import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getDailyCheckinDates, hasCheckedInToday } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    const year = parseInt(request.nextUrl.searchParams.get('year') || String(new Date().getFullYear()), 10)
    const month = parseInt(request.nextUrl.searchParams.get('month') || String(new Date().getMonth() + 1), 10)
    if (month < 1 || month > 12) {
      return NextResponse.json({ error: 'Invalid month' }, { status: 400 })
    }

    const [dates, todayClaimed] = await Promise.all([
      getDailyCheckinDates(user.id, year, month),
      hasCheckedInToday(user.id),
    ])

    return NextResponse.json({
      dates,
      todayClaimed,
      pointsPerDay: 10,
    })
  } catch (error) {
    console.error('Daily checkin status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
