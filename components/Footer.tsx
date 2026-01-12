'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">LoveHate 게임</h3>
            <p className="text-gray-400">
              아이들을 위한 교육 게임 플랫폼입니다.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">게임</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#games" className="hover:text-white transition">
                  게임 소개
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition">
                  플랫폼 특징
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition">
                  구독 가격
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">지원</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/support" className="hover:text-white transition">
                  고객 지원
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">연락처</h4>
            <ul className="space-y-2">
              <li>이메일: support@lovehate.com</li>
              <li>전화: 02-1234-5678</li>
              <li className="flex gap-4 mt-4">
                <a href="#" className="hover:text-white transition">Facebook</a>
                <a href="#" className="hover:text-white transition">Instagram</a>
                <a href="#" className="hover:text-white transition">Twitter</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024-2026 LoveHate 게임. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


