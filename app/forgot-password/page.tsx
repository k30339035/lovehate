'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('이메일을 입력해 주세요.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }
    if (!supabase) {
      setError('서비스 설정이 완료되지 않았습니다.')
      return
    }

    setLoading(true)
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/reset-password`,
      })

      if (resetError) {
        if (resetError.message.includes('rate limit') || resetError.message.includes('many')) {
          setError('요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.')
        } else {
          setError(resetError.message)
        }
        setLoading(false)
        return
      }

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '요청 처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">비밀번호 재설정</h1>
          <div
            role="status"
            className="p-4 rounded-lg bg-green-50 text-green-800 border border-green-200 text-sm"
          >
            <p className="font-medium">이메일을 확인해 주세요.</p>
            <p className="mt-2">
              <strong>{email}</strong> 로 비밀번호 재설정 링크를 보냈습니다. 메일함(스팸함 포함)에서 링크를 클릭하면 새 비밀번호를 설정할 수 있습니다.
            </p>
            <p className="mt-2 text-gray-600">
              메일이 오지 않으면 이메일 주소를 확인하거나 잠시 후 다시 시도해 주세요.
            </p>
          </div>
          <p className="mt-6 text-center">
            <Link href="/login" className="text-primary-600 hover:underline font-medium">
              로그인으로 돌아가기
            </Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">비밀번호 찾기</h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          가입 시 사용한 이메일을 입력하시면 비밀번호 재설정 링크를 보내 드립니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? '전송 중…' : '재설정 링크 받기'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/login" className="text-primary-600 hover:underline font-medium">
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </main>
  )
}
