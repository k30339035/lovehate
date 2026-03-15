import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/app/api/admin/_util'
import { setUserAdmin } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const admin = await getAdminUser(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const userId = body?.userId
    const isAdmin = typeof body?.isAdmin === 'boolean' ? body.isAdmin : undefined

    if (!userId || isAdmin === undefined) {
      return NextResponse.json(
        { error: 'userId and isAdmin (boolean) required' },
        { status: 400 }
      )
    }

    const result = await setUserAdmin(userId, isAdmin)
    if (!result) {
      return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      is_admin: result.is_admin ?? false,
    })
  } catch (error) {
    console.error('Admin set role error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
