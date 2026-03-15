'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!email.trim()) {
      setError('이메일을 입력해 주세요.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }
    if (!password || password.length < 6) {
      setError('비밀번호는 6자 이상 입력해 주세요.')
      return
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (!agreeTerms) {
      setError('이용약관 및 개인정보처리방침에 동의해 주세요.')
      return
    }

    if (!supabase) {
      setError('서비스 설정이 완료되지 않았습니다.')
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: name.trim() ? { name: name.trim() } : undefined,
        },
      })

      if (signUpError) {
        if (
          signUpError.message.includes('already registered') ||
          signUpError.message.includes('already exists')
        ) {
          setError('이미 가입된 이메일입니다. 로그인하거나 비밀번호 찾기를 이용해 주세요.')
        } else if (signUpError.message.includes('rate limit') || signUpError.message.includes('many')) {
          setError('요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.')
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      if (data.session) {
        const res = await fetch('/api/auth/sync-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.session.access_token}`,
          },
        })
        if (!res.ok) {
          console.error('Sync user failed:', await res.text())
        }
        router.push('/')
        router.refresh()
        return
      }

      setMessage('가입 요청이 완료되었습니다. 이메일에서 인증 링크를 확인해 주세요.')
    } catch (err) {
      setError(err instanceof Error ? err.message : '가입 처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">회원가입</h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          필수 항목만 입력해 주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              placeholder="6자 이상"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="signup-confirm" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input
              id="signup-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              placeholder="비밀번호 다시 입력"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-gray-400 text-xs">(선택)</span>
            </label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              placeholder="홍길동"
              disabled={loading}
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              id="signup-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={loading}
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="signup-terms" className="text-sm text-gray-700">
              <Link href="/terms" className="text-primary-600 hover:underline">이용약관</Link>
              {' 및 '}
              <Link href="/privacy" className="text-primary-600 hover:underline">개인정보처리방침</Link>
              에 동의합니다. <span className="text-red-500">*</span>
            </label>
          </div>

          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}
          {message && (
            <div role="status" className="p-3 rounded-lg bg-green-50 text-green-800 text-sm border border-green-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? '처리 중…' : '가입하기'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-primary-600 hover:underline font-medium">
            로그인
          </Link>
        </p>
      </div>
    </main>
  )
}
