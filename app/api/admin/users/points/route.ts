import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/app/api/admin/_util'
import { setUserPoints } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const admin = await getAdminUser(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const userId = body?.userId
    const totalPoints = typeof body?.totalPoints === 'number' ? body.totalPoints : undefined

    if (!userId || totalPoints === undefined || totalPoints < 0) {
      return NextResponse.json(
        { error: 'userId and totalPoints (number >= 0) required' },
        { status: 400 }
      )
    }

    const result = await setUserPoints(userId, Math.floor(totalPoints))
    if (!result) {
      return NextResponse.json({ error: 'Failed to update points' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      totalPoints: result.total_points,
    })
  } catch (error) {
    console.error('Admin set points error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
