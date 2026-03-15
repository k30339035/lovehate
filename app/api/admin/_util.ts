import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUserById, type User } from '@/lib/db'

const SEED_ADMIN_EMAIL = 'stwo.kim@gmail.com'

/** 요청자가 관리자인지 확인. 관리자면 User 반환, 아니면 null. */
export async function getAdminUser(request: NextRequest): Promise<{ user: User } | null> {
  if (!supabaseAdmin) return null
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  if (!token) return null

  const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !authUser) return null

  const dbUser = await getUserById(authUser.id)
  if (!dbUser) return null

  const isAllowed =
    (dbUser.email && dbUser.email.toLowerCase() === SEED_ADMIN_EMAIL.toLowerCase()) ||
    dbUser.is_admin === true

  if (!isAllowed) return null
  return { user: dbUser }
}
