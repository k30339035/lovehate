'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface UserRow {
  id: string
  email: string
  name: string | null
  is_admin: boolean
  total_points: number
}

export default function AdminPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingPoints, setEditingPoints] = useState<Record<string, number>>({})
  const [savingUserId, setSavingUserId] = useState<string | null>(null)
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return
    const res = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    if (res.status === 401) {
      setError('로그인이 필요합니다.')
      setUsers([])
      return
    }
    if (res.status === 403 || !res.ok) {
      setError('관리자만 접근할 수 있습니다.')
      setUsers([])
      return
    }
    const data = await res.json()
    setUsers(data.users ?? [])
    setEditingPoints((prev) => {
      const next = { ...prev }
      for (const u of data.users ?? []) {
        next[u.id] = u.total_points
      }
      return next
    })
    setError(null)
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?next=/admin')
      return
    }
    if (user) {
      setLoading(true)
      fetchUsers().finally(() => setLoading(false))
    }
  }, [authLoading, user, router, fetchUsers])

  const handleSavePoints = async (userId: string) => {
    const value = editingPoints[userId]
    if (value === undefined) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return
    setSavingUserId(userId)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/users/points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId, totalPoints: Math.max(0, Math.floor(Number(value))) }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: '포인트가 저장되었습니다.' })
        setEditingPoints((prev) => ({ ...prev, [userId]: data.totalPoints }))
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, total_points: data.totalPoints } : u))
        )
      } else {
        setMessage({ type: 'error', text: data.error || '저장에 실패했습니다.' })
      }
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' })
    } finally {
      setSavingUserId(null)
    }
  }

  const handleToggleAdmin = async (userId: string, nextAdmin: boolean) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return
    setTogglingUserId(userId)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId, isAdmin: nextAdmin }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMessage({
          type: 'success',
          text: nextAdmin ? '관리자로 설정했습니다.' : '관리자 권한을 해제했습니다.',
        })
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_admin: data.is_admin } : u))
        )
      } else {
        setMessage({ type: 'error', text: data.error || '변경에 실패했습니다.' })
      }
    } catch {
      setMessage({ type: 'error', text: '변경에 실패했습니다.' })
    } finally {
      setTogglingUserId(null)
    }
  }

  if (authLoading || (user && loading && users.length === 0 && !error)) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <p className="text-gray-500">불러오는 중…</p>
      </main>
    )
  }

  if (!user) {
    return null
  }

  if (error) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="mt-4">
            <Link href="/" className="text-primary-600 hover:underline">
              홈으로
            </Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">관리자</h1>
        <p className="text-gray-600 text-sm mb-6">
          사용자 목록 · 포인트 수정(테스트용) · 관리자 권한 부여/해제
        </p>

        {message && (
          <div
            role="alert"
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">이메일</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">이름</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">포인트</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">저장</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">관리자</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-800">{row.email}</td>
                  <td className="px-4 py-3 text-gray-600">{row.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={editingPoints[row.id] ?? row.total_points}
                      onChange={(e) =>
                        setEditingPoints((prev) => ({
                          ...prev,
                          [row.id]: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleSavePoints(row.id)}
                      disabled={savingUserId === row.id}
                      className="text-sm text-primary-600 hover:underline disabled:opacity-50"
                    >
                      {savingUserId === row.id ? '저장 중…' : '저장'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={row.is_admin}
                        onChange={(e) => handleToggleAdmin(row.id, e.target.checked)}
                        disabled={togglingUserId === row.id}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-600">
                        {togglingUserId === row.id ? '처리 중…' : row.is_admin ? '관리자' : '일반'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          <Link href="/" className="text-primary-600 hover:underline">
            홈으로
          </Link>
        </p>
      </div>
    </main>
  )
}
