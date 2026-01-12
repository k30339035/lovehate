'use client'

import { motion } from 'framer-motion'

export default function Download() {
  return (
    <section id="download" className="py-20 px-4 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            LoveHate 게임 플랫폼에 가입하고 모든 게임을 즐기세요
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://play.google.com/store/apps/details?id=com.lovehate.drone"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              구글 플레이에서 다운로드
            </a>
            
            <a
              href="/drone.apk"
              download
              className="bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-400 transition flex items-center gap-2 border-2 border-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              APK 직접 다운로드
            </a>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="text-xl font-semibold mb-2">안드로이드 지원</h3>
              <p className="text-primary-100">Android 8.0 이상 지원</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="text-xl font-semibold mb-2">다양한 게임</h3>
              <p className="text-primary-100">계속 추가되는 새로운 게임</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="text-xl font-semibold mb-2">정기 업데이트</h3>
              <p className="text-primary-100">새로운 기능 지속 추가</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


