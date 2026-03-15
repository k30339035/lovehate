'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase'

const SESSION_TIMEOUT_KEY = 'sessionTimeoutMinutes'
const DEFAULT_SESSION_TIMEOUT = 15

/** localStorage에서 자동 로그아웃 시간(분) 읽기. 0이면 사용 안 함. */
export function getSessionTimeoutMinutes(): number {
  if (typeof window === 'undefined') return DEFAULT_SESSION_TIMEOUT
  try {
    const v = localStorage.getItem(SESSION_TIMEOUT_KEY)
    if (v === null) return DEFAULT_SESSION_TIMEOUT
    const n = parseInt(v, 10)
    if ([0, 15, 30, 60].includes(n)) return n
    return DEFAULT_SESSION_TIMEOUT
  } catch {
    return DEFAULT_SESSION_TIMEOUT
  }
}

export function setSessionTimeoutMinutes(minutes: number): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SESSION_TIMEOUT_KEY, String(minutes))
  } catch {}
}

export interface AuthUser {
  id: string
  email: string
  name: string | null
  is_admin?: boolean
}

export interface AuthState {
  user: AuthUser | null
  points: number
  loading: boolean
  signOut: () => Promise<void>
  refreshPoints: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  const fetchMe = useCallback(async (accessToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setUser({
        ...data.user,
        is_admin: data.user?.is_admin ?? false,
      })
      setPoints(data.points?.total ?? 0)
    } catch {
      setUser(null)
      setPoints(0)
    }
  }, [])

  const refreshPoints = useCallback(async () => {
    if (!supabase) return
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) await fetchMe(session.access_token)
  }, [fetchMe])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const u = session.user
        setUser({
          id: u.id,
          email: u.email ?? '',
          name: (u.user_metadata?.name as string) ?? null,
        })
        await fetchMe(session.access_token)
      } else {
        setUser(null)
        setPoints(0)
      }
      setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const u = session.user
          setUser({
            id: u.id,
            email: u.email ?? '',
            name: (u.user_metadata?.name as string) ?? null,
            is_admin: false,
          })
          await fetchMe(session.access_token)
        } else {
          setUser(null)
          setPoints(0)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchMe])

  const signOut = useCallback(async () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setPoints(0)
  }, [])

  const startInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
    const minutes = getSessionTimeoutMinutes()
    if (minutes <= 0) return
    const ms = minutes * 60 * 1000
    inactivityTimerRef.current = setTimeout(() => {
      inactivityTimerRef.current = null
      signOut()
    }, ms)
    lastActivityRef.current = Date.now()
  }, [signOut])

  useEffect(() => {
    if (!user) return
    startInactivityTimer()
    const onActivity = () => {
      lastActivityRef.current = Date.now()
      startInactivityTimer()
    }
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const debounced = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(onActivity, 1000)
    }
    const onSettingsChanged = () => startInactivityTimer()
    window.addEventListener('mousemove', debounced)
    window.addEventListener('keydown', debounced)
    window.addEventListener('click', debounced)
    window.addEventListener('scroll', debounced)
    window.addEventListener('sessionTimeoutChanged', onSettingsChanged)
    return () => {
      window.removeEventListener('mousemove', debounced)
      window.removeEventListener('keydown', debounced)
      window.removeEventListener('click', debounced)
      window.removeEventListener('scroll', debounced)
      window.removeEventListener('sessionTimeoutChanged', onSettingsChanged)
      if (debounceTimer) clearTimeout(debounceTimer)
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
        inactivityTimerRef.current = null
      }
    }
  }, [user, startInactivityTimer])

  return (
    <AuthContext.Provider
      value={{
        user,
        points,
        loading,
        signOut,
        refreshPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
