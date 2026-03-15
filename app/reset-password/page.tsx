'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validLink, setValidLink] = useState<boolean | null>(null)

  useEffect(() => {
    if (!supabase) {
      setValidLink(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      const isRecovery = typeof window !== 'undefined' &&
        /type=recovery|type=recovery&/.test(window.location.hash)
      setValidLink(!!(session || isRecovery))
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('비밀번호는 6자 이상 입력해 주세요.')
      return
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (!supabase) {
      setError('서비스 설정이 완료되지 않았습니다.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      router.push('/login?message=password_reset')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '비밀번호 변경 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (validLink === null) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto text-center text-gray-600">확인 중…</div>
      </main>
    )
  }

  if (!validLink) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">비밀번호 재설정</h1>
          <div role="alert" className="p-4 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm">
            <p className="font-medium">유효한 링크가 아니거나 만료되었습니다.</p>
            <p className="mt-2">비밀번호 찾기에서 이메일을 다시 입력해 재설정 링크를 받아 주세요.</p>
          </div>
          <p className="mt-6 text-center">
            <Link href="/forgot-password" className="text-primary-600 hover:underline font-medium">
              비밀번호 찾기
            </Link>
            {' · '}
            <Link href="/login" className="text-primary-600 hover:underline font-medium">
              로그인
            </Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">새 비밀번호 설정</h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          사용할 새 비밀번호를 입력해 주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-password" className="block text-sm font-medium text-gray-700 mb-1">
              새 비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              id="reset-password"
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
            <label htmlFor="reset-confirm" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input
              id="reset-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              placeholder="비밀번호 다시 입력"
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
            {loading ? '저장 중…' : '비밀번호 변경'}
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
