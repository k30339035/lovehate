'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const POINTS_PER_DAY = 10

function getMonthDays(year: number, month: number) {
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0)
  const startPad = first.getDay()
  const daysInMonth = last.getDate()
  const totalCells = startPad + daysInMonth
  const rows = Math.ceil(totalCells / 7)
  const cells: (number | null)[] = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length < rows * 7) cells.push(null)
  return { cells, daysInMonth, startPad }
}

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function DailyCheckinPage() {
  const router = useRouter()
  const { user, loading: authLoading, refreshPoints } = useAuth()
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth() + 1)
  const [dates, setDates] = useState<string[]>([])
  const [todayClaimed, setTodayClaimed] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchStatus = useCallback(async () => {
    if (!user) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return
    const res = await fetch(
      `/api/daily-checkin/status?year=${year}&month=${month}`,
      { headers: { Authorization: `Bearer ${session.access_token}` } }
    )
    if (!res.ok) return
    const data = await res.json()
    setDates(data.dates || [])
    setTodayClaimed(data.todayClaimed ?? false)
  }, [user, year, month])

  useEffect(() => {
    if (user) fetchStatus()
  }, [user, fetchStatus])

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?next=/daily-checkin')
    }
  }, [authLoading, user, router])

  const handleClaim = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return
    setClaimLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/daily-checkin', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      if (data.success) {
        setTodayClaimed(true)
        setDates((prev) => {
          const today = dateKey(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate()
          )
          return prev.includes(today) ? prev : [...prev, today].sort()
        })
        setMessage({ type: 'success', text: `오늘 출석 완료! +${POINTS_PER_DAY} 포인트` })
        refreshPoints()
      } else if (data.alreadyClaimed) {
        setMessage({ type: 'success', text: '오늘은 이미 출석했습니다.' })
      } else {
        setMessage({ type: 'error', text: data.message || '출석 처리에 실패했습니다.' })
      }
    } catch {
      setMessage({ type: 'error', text: '출석 처리에 실패했습니다.' })
    } finally {
      setClaimLoading(false)
    }
  }

  const now = new Date()
  const todayKey = dateKey(now.getFullYear(), now.getMonth() + 1, now.getDate())
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1
  const { cells } = getMonthDays(year, month)

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }
  const nextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  if (authLoading || !user) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <p className="text-gray-500">로그인 정보를 확인하는 중…</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">일일 출석</h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          매일 출석하면 <strong className="text-primary-600">10 포인트</strong>를 드려요.
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

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              aria-label="이전 달"
            >
              ‹
            </button>
            <span className="text-lg font-semibold text-gray-800">
              {year}년 {month}월
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              aria-label="다음 달"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className="text-center text-xs font-medium text-gray-500 py-1"
              >
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`e-${i}`} className="aspect-square" />
              }
              const key = dateKey(year, month, day)
              const isChecked = dates.includes(key)
              const isToday =
                isCurrentMonth && day === now.getDate()
              const canClaim = isToday && !todayClaimed

              return (
                <div
                  key={key}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition ${
                    isChecked
                      ? 'bg-primary-100 text-primary-800 font-semibold'
                      : isToday
                        ? 'bg-primary-50 text-primary-700 ring-2 ring-primary-400'
                        : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{day}</span>
                  {isChecked && (
                    <span className="text-primary-600 text-xs mt-0.5" aria-hidden>✓</span>
                  )}
                  {canClaim && (
                    <button
                      type="button"
                      onClick={handleClaim}
                      disabled={claimLoading}
                      className="mt-1 text-xs font-medium text-primary-600 hover:underline disabled:opacity-50"
                    >
                      {claimLoading ? '처리 중…' : '출석하기'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center">
          {isCurrentMonth && !todayClaimed ? (
            <button
              type="button"
              onClick={handleClaim}
              disabled={claimLoading}
              className="w-full max-w-xs mx-auto bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {claimLoading ? '처리 중…' : '오늘 출석하고 10P 받기'}
            </button>
          ) : isCurrentMonth && todayClaimed ? (
            <p className="text-green-700 font-medium">오늘 출석 완료!</p>
          ) : null}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          <Link href="/" className="text-primary-600 hover:underline">
            홈으로
          </Link>
        </p>
      </div>
    </main>
  )
}
