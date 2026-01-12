'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-600">
          LoveHate 게임
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="#games" className="text-gray-700 hover:text-primary-600 transition">
            게임
          </Link>
          <Link href="#features" className="text-gray-700 hover:text-primary-600 transition">
            특징
          </Link>
          <Link href="#pricing" className="text-gray-700 hover:text-primary-600 transition">
            가격
          </Link>
          <Link href="#pricing" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
            구독하기
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="#games" className="text-gray-700 hover:text-primary-600">
              게임
            </Link>
            <Link href="#features" className="text-gray-700 hover:text-primary-600">
              특징
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-primary-600">
              가격
            </Link>
            <Link href="#pricing" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-center">
              구독하기
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}


