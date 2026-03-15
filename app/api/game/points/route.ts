import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, getUserPoints } from '@/lib/db'

export const dynamic = 'force-dynamic'

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CORS_ALLOW_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400, headers: corsHeaders })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          user: null,
          points: {
            total: 0,
          },
        },
        { headers: corsHeaders }
      )
    }

    const pointRow = await getUserPoints(user.id)

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
        },
        points: {
          total: pointRow?.total_points ?? 0,
        },
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Get points error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
