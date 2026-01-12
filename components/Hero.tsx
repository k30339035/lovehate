'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              아이들을 위한
              <span className="text-primary-600 block">교육 게임 플랫폼</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              7살 아이를 위한 재미있고 교육적인 게임들을 만나보세요. 글씨 드론 게임, 로봇 조종 게임, 네비게이션 게임 등 
              다양한 게임이 월 2,900원에 제공됩니다. 새로운 게임이 계속 추가될 예정입니다!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#pricing"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition text-center"
              >
                지금 시작하기
              </Link>
              <Link
                href="#games"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition text-center border-2 border-primary-600"
              >
                게임 둘러보기
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="aspect-square bg-gradient-to-br from-primary-200 to-primary-400 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-7xl mb-4">🎮</div>
                  <p className="text-white text-xl font-semibold mb-2">다양한 게임</p>
                  <p className="text-white text-sm">글씨 드론 · 로봇 조종 · 네비게이션</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


