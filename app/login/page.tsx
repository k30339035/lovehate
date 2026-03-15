'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15
const LOCKOUT_KEY = 'login_failed_attempts'
const LOCKOUT_UNTIL_KEY = 'login_lockout_until'

function getStoredAttempts(): number {
  if (typeof window === 'undefined') return 0
  try {
    const until = sessionStorage.getItem(LOCKOUT_UNTIL_KEY)
    if (until && Date.now() < parseInt(until, 10)) return MAX_ATTEMPTS
    if (until) {
      sessionStorage.removeItem(LOCKOUT_UNTIL_KEY)
      sessionStorage.removeItem(LOCKOUT_KEY)
    }
    return parseInt(sessionStorage.getItem(LOCKOUT_KEY) || '0', 10)
  } catch {
    return 0
  }
}

function recordFailedAttempt(): number {
  if (typeof window === 'undefined') return 0
  try {
    const until = sessionStorage.getItem(LOCKOUT_UNTIL_KEY)
    if (until && Date.now() < parseInt(until, 10)) return MAX_ATTEMPTS
    const n = parseInt(sessionStorage.getItem(LOCKOUT_KEY) || '0', 10) + 1
    sessionStorage.setItem(LOCKOUT_KEY, String(n))
    if (n >= MAX_ATTEMPTS) {
      sessionStorage.setItem(LOCKOUT_UNTIL_KEY, String(Date.now() + LOCKOUT_MINUTES * 60 * 1000))
    }
    return n
  } catch {
    return 1
  }
}

function clearFailedAttempts() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(LOCKOUT_KEY)
    sessionStorage.removeItem(LOCKOUT_UNTIL_KEY)
  } catch {}
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null)

  useEffect(() => {
    const n = getStoredAttempts()
    setAttempts(n)
    if (n >= MAX_ATTEMPTS) {
      const until = sessionStorage.getItem(LOCKOUT_UNTIL_KEY)
      if (until) setLockoutUntil(parseInt(until, 10))
    }
  }, [])

  useEffect(() => {
    const msg = searchParams.get('message')
    if (msg === 'password_reset') setSuccessMessage('비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.')
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (attempts >= MAX_ATTEMPTS && lockoutUntil && Date.now() < lockoutUntil) {
      setError(`로그인 시도 횟수가 너무 많습니다. ${LOCKOUT_MINUTES}분 후 다시 시도해 주세요.`)
      return
    }

    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 입력해 주세요.')
      return
    }

    if (!supabase) {
      setError('서비스 설정이 완료되지 않았습니다.')
      return
    }

    setLoading(true)
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        const count = recordFailedAttempt()
        setAttempts(count)
        if (count >= MAX_ATTEMPTS) {
          setLockoutUntil(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
          setError(`로그인 시도 횟수가 너무 많습니다. ${LOCKOUT_MINUTES}분 후 다시 시도해 주세요.`)
        } else if (
          signInError.message.includes('Invalid login credentials') ||
          signInError.message.includes('invalid_credentials')
        ) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('이메일 인증이 완료되지 않았습니다. 가입 시 발송된 메일에서 인증 링크를 확인해 주세요.')
        } else {
          setError(signInError.message)
        }
        setLoading(false)
        return
      }

      clearFailedAttempts()
      if (data.session) {
        await fetch('/api/auth/sync-user', {
          method: 'POST',
          headers: { Authorization: `Bearer ${data.session.access_token}` },
        })
        const next = searchParams.get('next')
        router.push(next && next.startsWith('/') ? next : '/')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const isLockedOut = attempts >= MAX_ATTEMPTS && lockoutUntil != null && Date.now() < lockoutUntil
  const lockoutRemaining = lockoutUntil != null ? Math.ceil((lockoutUntil - Date.now()) / 60000) : 0

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">로그인</h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          계정으로 로그인하세요.
        </p>

        {successMessage && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg bg-green-50 text-green-800 text-sm border border-green-200"
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              placeholder="you@example.com"
              disabled={loading || isLockedOut}
              aria-invalid={!!error}
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              disabled={loading || isLockedOut}
              aria-invalid={!!error}
            />
            <p className="mt-1.5 text-sm">
              <Link
                href="/forgot-password"
                className="text-primary-600 hover:underline"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </p>
          </div>

          {error && (
            <div
              id="login-error"
              role="alert"
              className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200"
            >
              {error}
              {isLockedOut && (
                <p className="mt-1 font-medium">
                  남은 시간: 약 {lockoutRemaining}분
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLockedOut}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? '로그인 중…' : isLockedOut ? `${lockoutRemaining}분 후 다시 시도` : '로그인'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-primary-600 hover:underline font-medium">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  )
}
