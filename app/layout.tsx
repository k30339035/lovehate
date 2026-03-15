import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'KPAI - Korea Play AI 교육 게임 플랫폼',
  description: '7살 아이를 위한 재미있는 웹 게임들을 만나보세요. 글씨 드론, 로봇 조종, 네비게이션 등 다양한 웹 게임이 월 2,900원에 제공됩니다.',
  keywords: '아이 게임, 교육 게임, 웹 게임, 로봇 게임, 네비게이션 게임, 어린이 웹 게임, 구독 게임',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}






