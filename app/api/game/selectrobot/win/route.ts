import { NextRequest, NextResponse } from 'next/server'
import { awardUserPoints, upsertMinimalUser } from '@/lib/db'

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
    const { email, name, points } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400, headers: corsHeaders })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400, headers: corsHeaders })
    }

    const awardedPoints = Number.isInteger(points) && points > 0 ? points : 100

    const user = await upsertMinimalUser(email, name)
    if (!user) {
      return NextResponse.json({ error: 'Failed to create or find user' }, { status: 500, headers: corsHeaders })
    }

    const pointRow = await awardUserPoints(user.id, awardedPoints, 'selectrobot_win')
    if (!pointRow) {
      return NextResponse.json({ error: 'Failed to award points' }, { status: 500, headers: corsHeaders })
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
        },
        points: {
          awarded: awardedPoints,
          total: pointRow.total_points,
        },
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('SelectRobot win error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
