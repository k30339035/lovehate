import { NextRequest, NextResponse } from 'next/server'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/app/api/admin/_util'
import { listUsersWithPoints } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const admin = await getAdminUser(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = await listUsersWithPoints()
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Admin list users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
