'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getSessionTimeoutMinutes, setSessionTimeoutMinutes } from '@/contexts/AuthContext'

const OPTIONS = [
  { value: 0, label: '사용 안 함' },
  { value: 15, label: '15분' },
  { value: 30, label: '30분' },
  { value: 60, label: '60분' },
]

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [timeoutMinutes, setTimeoutMinutes] = useState(15)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?next=/settings')
      return
    }
    if (typeof window !== 'undefined') {
      setTimeoutMinutes(getSessionTimeoutMinutes())
    }
  }, [authLoading, user, router])

  const handleTimeoutChange = (value: number) => {
    setSessionTimeoutMinutes(value)
    setTimeoutMinutes(value)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sessionTimeoutChanged'))
    }
    setMessage(value === 0 ? '자동 로그아웃을 사용하지 않습니다.' : `${value}분 무활동 시 자동 로그아웃됩니다.`)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  if (authLoading || !user) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <p className="text-gray-500">확인 중…</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">설정</h1>
        <p className="text-gray-600 text-sm mb-8">
          로그아웃 및 세션 설정을 변경할 수 있습니다.
        </p>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">계정 정보</h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div>
              <span className="text-sm text-gray-500">이메일</span>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
            {user.name && (
              <div>
                <span className="text-sm text-gray-500">이름</span>
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>
            )}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">자동 로그아웃</h2>
          <p className="text-sm text-gray-600 mb-3">
            일정 시간 동안 마우스·키보드 입력이 없으면 자동으로 로그아웃됩니다.
          </p>
          <select
            value={timeoutMinutes}
            onChange={(e) => handleTimeoutChange(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            {OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {message && (
            <p className="mt-2 text-sm text-green-600">{message}</p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">로그아웃</h2>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition"
          >
            로그아웃
          </button>
        </section>

        <p className="text-center text-sm text-gray-500">
          <Link href="/" className="text-primary-600 hover:underline">
            홈으로
          </Link>
        </p>
      </div>
    </main>
  )
}
