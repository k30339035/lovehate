'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()
  const { user, points, loading, signOut } = useAuth()
  const router = useRouter()

  const toggleLang = () => setLang(lang === 'ko' ? 'en' : 'ko')

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  const displayName = user?.name?.trim() || user?.email || ''

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-600 hover:scale-105 transition-transform inline-block">
          {t('header.brand')}
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={toggleLang}
            className="text-sm font-medium text-gray-600 hover:text-primary-600 border border-gray-300 hover:border-primary-500 rounded-lg px-3 py-1.5 transition min-w-[4rem]"
            aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
          >
            {lang === 'ko' ? '한글' : 'EN'}
          </button>
          <div className="flex items-center space-x-6">
            <Link href="#games" className="text-gray-700 hover:text-primary-600 transition hover:-translate-y-0.5">
              {t('header.games')}
            </Link>
            <Link href="#features" className="text-gray-700 hover:text-primary-600 transition hover:-translate-y-0.5">
              {t('header.features')}
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-primary-600 transition hover:-translate-y-0.5">
              {t('header.pricing')}
            </Link>
            <Link href="#donate" className="text-gray-700 hover:text-primary-600 transition hover:-translate-y-0.5">
              {t('header.donate')}
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <span className="text-gray-700 font-medium" title={user.email}>
                      {displayName}
                    </span>
                    <Link href="/daily-checkin" className="text-gray-700 hover:text-primary-600 transition hover:-translate-y-0.5">
                      {t('header.dailyCheckin')}
                    </Link>
                    <Link href="/settings" className="text-gray-700 hover:text-primary-600 transition hover:-translate-y-0.5">
                      {t('header.settings')}
                    </Link>
                    {user.is_admin && (
                      <Link href="/admin" className="text-gray-700 hover:text-primary-600 transition hover:-translate-y-0.5 font-medium">
                        {t('header.admin')}
                      </Link>
                    )}
                    <span className="text-primary-600 font-semibold">
                      {t('header.points')} {points}
                    </span>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="text-gray-700 hover:text-primary-600 transition hover:-translate-y-0.5"
                    >
                      {t('header.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-700 hover:text-primary-600 transition hover:-translate-y-0.5">
                      {t('header.login')}
                    </Link>
                    <Link href="/signup" className="text-gray-700 hover:text-primary-600 transition hover:-translate-y-0.5">
                      {t('header.signup')}
                    </Link>
                  </>
                )}
              </>
            )}
            <Link href="#pricing" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 hover:scale-105 transition-all shadow-md hover:shadow-lg">
              {t('header.subscribe')}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleLang}
            className="text-sm font-medium text-gray-600 border border-gray-300 rounded-lg px-2.5 py-1 min-w-[3.5rem]"
          >
            {lang === 'ko' ? '한글' : 'EN'}
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={t('header.menu')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="#games" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
              {t('header.games')}
            </Link>
            <Link href="#features" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
              {t('header.features')}
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
              {t('header.pricing')}
            </Link>
            <Link href="#donate" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
              {t('header.donate')}
            </Link>
            {!loading && (
              user ? (
                <>
                  <span className="text-gray-700 font-medium">{displayName}</span>
                  <Link href="/daily-checkin" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                    {t('header.dailyCheckin')}
                  </Link>
                  <Link href="/settings" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                    {t('header.settings')}
                  </Link>
                  {user.is_admin && (
                    <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                      {t('header.admin')}
                    </Link>
                  )}
                  <span className="text-primary-600 font-semibold">{t('header.points')} {points}</span>
                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); handleSignOut(); }}
                    className="text-left text-gray-700 hover:text-primary-600"
                  >
                    {t('header.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                    {t('header.login')}
                  </Link>
                  <Link href="/signup" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                    {t('header.signup')}
                  </Link>
                </>
              )
            )}
            <Link href="#pricing" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-center" onClick={() => setIsMenuOpen(false)}>
              {t('header.subscribe')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
