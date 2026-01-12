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
