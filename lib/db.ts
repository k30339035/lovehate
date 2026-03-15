import { supabaseAdmin } from './supabase'

// 데이터베이스 연결 확인
function checkDbConnection() {
  if (!supabaseAdmin) {
    console.warn('Supabase is not configured. Database operations will be skipped.')
    return false
  }
  return true
}

export interface User {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
  is_admin?: boolean
}

export interface UserWithPoints {
  id: string
  email: string
  name: string | null
  is_admin: boolean
  total_points: number
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  plan_name: string
  status: 'active' | 'cancelled' | 'expired'
  current_period_start: string
  current_period_end: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  stripe_payment_intent_id: string
  amount: number
  currency: string
  status: 'succeeded' | 'failed' | 'pending'
  created_at: string
}

export interface UserPoint {
  user_id: string
  total_points: number
  updated_at: string
}

// 사용자 생성 또는 조회
export async function getUserByEmail(email: string): Promise<User | null> {
  if (!checkDbConnection()) return null
  
  const { data, error } = await supabaseAdmin!
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user:', error)
    return null
  }

  return data
}

export async function getUserById(id: string): Promise<User | null> {
  if (!checkDbConnection()) return null
  const { data, error } = await supabaseAdmin!
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user by id:', error)
    return null
  }
  return data
}

export async function createUser(email: string, name?: string): Promise<User | null> {
  if (!checkDbConnection()) return null
  
  const { data, error } = await supabaseAdmin!
    .from('users')
    .insert({
      email,
      name,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return null
  }

  return data
}

// 최소 정보 회원 upsert (email 필수, name 선택)
export async function upsertMinimalUser(email: string, name?: string): Promise<User | null> {
  if (!checkDbConnection()) return null

  const { data, error } = await supabaseAdmin!
    .from('users')
    .upsert(
      {
        email,
        name: name?.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    )
    .select()
    .single()

  if (error) {
    console.error('Error upserting user:', error)
    return null
  }

  return data
}

// Supabase Auth 가입 후 public.users 동기화 (id = auth.users.id)
export async function upsertUserFromAuth(
  id: string,
  email: string,
  name?: string
): Promise<User | null> {
  if (!checkDbConnection()) return null

  const { data, error } = await supabaseAdmin!
    .from('users')
    .upsert(
      {
        id,
        email,
        name: name?.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select()
    .single()

  if (error) {
    console.error('Error upserting user from auth:', error)
    return null
  }

  return data
}

// 포인트 적립 및 로그 기록
export async function awardUserPoints(
  userId: string,
  points: number,
  reason: string
): Promise<UserPoint | null> {
  if (!checkDbConnection()) return null

  if (!Number.isInteger(points) || points <= 0) {
    return null
  }

  const { data: currentPointRow, error: fetchPointError } = await supabaseAdmin!
    .from('user_points')
    .select('total_points')
    .eq('user_id', userId)
    .single()

  if (fetchPointError && fetchPointError.code !== 'PGRST116') {
    console.error('Error fetching user points:', fetchPointError)
    return null
  }

  const currentPoints = currentPointRow?.total_points ?? 0
  const nextPoints = currentPoints + points

  const { data: pointRow, error: upsertPointError } = await supabaseAdmin!
    .from('user_points')
    .upsert(
      {
        user_id: userId,
        total_points: nextPoints,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (upsertPointError) {
    console.error('Error upserting user points:', upsertPointError)
    return null
  }

  const { error: logError } = await supabaseAdmin!
    .from('point_logs')
    .insert({
      user_id: userId,
      points_delta: points,
      reason,
    })

  if (logError) {
    console.error('Error writing point log:', logError)
    return null
  }

  return pointRow
}

export async function getUserPoints(userId: string): Promise<UserPoint | null> {
  if (!checkDbConnection()) return null

  const { data, error } = await supabaseAdmin!
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user points:', error)
    return null
  }

  return data ?? {
    user_id: userId,
    total_points: 0,
    updated_at: new Date().toISOString(),
  }
}

export const DAILY_CHECKIN_REASON = 'daily_checkin'
export const DAILY_CHECKIN_POINTS = 10

/** 해당 월에 출석한 날짜 목록 (YYYY-MM-DD) */
export async function getDailyCheckinDates(
  userId: string,
  year: number,
  month: number
): Promise<string[]> {
  if (!checkDbConnection()) return []
  const start = new Date(Date.UTC(year, month - 1, 1))
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))
  const startStr = start.toISOString()
  const endStr = end.toISOString()

  const { data, error } = await supabaseAdmin!
    .from('point_logs')
    .select('created_at')
    .eq('user_id', userId)
    .eq('reason', DAILY_CHECKIN_REASON)
    .gte('created_at', startStr)
    .lte('created_at', endStr)

  if (error) {
    console.error('Error fetching checkin dates:', error)
    return []
  }

  const dates = new Set<string>()
  for (const row of data || []) {
    const d = new Date(row.created_at)
    dates.add(
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
    )
  }
  return Array.from(dates).sort()
}

/** 오늘 이미 출석했는지 */
export async function hasCheckedInToday(userId: string): Promise<boolean> {
  if (!checkDbConnection()) return false
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 1)
  const startStr = start.toISOString()
  const endStr = end.toISOString()

  const { data, error } = await supabaseAdmin!
    .from('point_logs')
    .select('id')
    .eq('user_id', userId)
    .eq('reason', DAILY_CHECKIN_REASON)
    .gte('created_at', startStr)
    .lt('created_at', endStr)
    .limit(1)

  if (error) {
    console.error('Error checking today checkin:', error)
    return false
  }
  return (data?.length ?? 0) > 0
}

/** 관리자: 모든 사용자와 포인트 목록 */
export async function listUsersWithPoints(): Promise<UserWithPoints[]> {
  if (!checkDbConnection()) return []
  const { data: users, error: usersError } = await supabaseAdmin!
    .from('users')
    .select('id, email, name, is_admin')
    .order('created_at', { ascending: false })

  if (usersError || !users?.length) return []

  const { data: pointsRows, error: pointsError } = await supabaseAdmin!
    .from('user_points')
    .select('user_id, total_points')

  const pointsMap = new Map<string, number>()
  if (!pointsError && pointsRows) {
    for (const row of pointsRows) {
      pointsMap.set(row.user_id, row.total_points ?? 0)
    }
  }

  return users.map((u) => ({
    id: u.id,
    email: u.email ?? '',
    name: u.name ?? null,
    is_admin: !!u.is_admin,
    total_points: pointsMap.get(u.id) ?? 0,
  }))
}

const ADMIN_ADJUST_REASON = 'admin_adjust'

/** 관리자: 사용자 포인트를 지정한 값으로 설정 (테스트용) */
export async function setUserPoints(userId: string, totalPoints: number): Promise<UserPoint | null> {
  if (!checkDbConnection()) return null
  if (!Number.isInteger(totalPoints) || totalPoints < 0) return null

  const current = await getUserPoints(userId)
  const currentTotal = current?.total_points ?? 0
  const delta = totalPoints - currentTotal

  const { data: pointRow, error: upsertError } = await supabaseAdmin!
    .from('user_points')
    .upsert(
      {
        user_id: userId,
        total_points: totalPoints,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (upsertError) {
    console.error('Error setting user points:', upsertError)
    return null
  }

  if (delta !== 0) {
    await supabaseAdmin!.from('point_logs').insert({
      user_id: userId,
      points_delta: delta,
      reason: ADMIN_ADJUST_REASON,
    })
  }

  return pointRow
}

/** 관리자: 사용자 admin 여부 설정 */
export async function setUserAdmin(userId: string, isAdmin: boolean): Promise<User | null> {
  if (!checkDbConnection()) return null
  const { data, error } = await supabaseAdmin!
    .from('users')
    .update({
      is_admin: isAdmin,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()
  if (error) {
    console.error('Error setting user admin:', error)
    return null
  }
  return data
}

// 구독 저장
export async function saveSubscription(
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  planName: string,
  status: 'active' | 'cancelled' | 'expired',
  currentPeriodStart: Date,
  currentPeriodEnd: Date
): Promise<Subscription | null> {
  if (!checkDbConnection()) return null
  
  // 기존 구독이 있는지 확인
  const { data: existing } = await supabaseAdmin!
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .single()

  if (existing) {
    // 업데이트
    const { data, error } = await supabaseAdmin!
      .from('subscriptions')
      .update({
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        plan_name: planName,
        status,
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating subscription:', error)
      return null
    }

    return data
  } else {
    // 새로 생성
    const { data, error } = await supabaseAdmin!
      .from('subscriptions')
      .insert({
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        plan_name: planName,
        status,
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating subscription:', error)
      return null
    }

    return data
  }
}

// 구독 취소
export async function cancelSubscription(
  stripeSubscriptionId: string
): Promise<boolean> {
  if (!checkDbConnection()) return false
  
  const { error } = await supabaseAdmin!
    .from('subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', stripeSubscriptionId)

  if (error) {
    console.error('Error cancelling subscription:', error)
    return false
  }

  return true
}

// 사용자 ID로 구독 조회
export async function getSubscriptionByUserId(
  userId: string
): Promise<Subscription | null> {
  if (!checkDbConnection()) return null
  
  const { data, error } = await supabaseAdmin!
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching subscription:', error)
    return null
  }

  return data
}
