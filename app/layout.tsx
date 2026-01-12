import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'LoveHate 게임 - 아이들을 위한 교육 게임 플랫폼',
  description: '7살 아이를 위한 재미있는 교육 게임들을 만나보세요. 로봇 조종 게임, 네비게이션 게임 등 다양한 게임이 월 2,900원에 제공됩니다.',
  keywords: '아이 게임, 교육 게임, 로봇 게임, 네비게이션 게임, 어린이 앱, 구독 게임',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}


