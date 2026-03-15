'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const SURVIVOR_INDEX = 5 // 6번째 드론이 생존 드론

export default function DroneSelectScreen() {
  const { t } = useLanguage()

  return (
    <section id="drone-preview" className="py-16 px-4 bg-gray-900">
      <div className="container mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 text-sm mb-6"
        >
          {t('droneSelect.sectionTitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden aspect-[4/3] max-h-[480px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
        >
          {/* 도시 실루엣 배경 */}
          <div className="absolute inset-0 flex items-end justify-around px-4 pb-8 gap-1">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-6 bg-slate-800 rounded-t opacity-60"
                style={{
                  height: `${24 + (i % 5) * 12}%`,
                  boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.15)',
                }}
              />
            ))}
          </div>

          {/* 상단 UI */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              type="button"
              className="px-4 py-2 rounded-full bg-slate-700/90 text-white text-xs font-medium hover:bg-slate-600 transition"
            >
              {t('droneSelect.soundOff')}
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-700/90 border border-slate-500 flex items-center justify-center text-white font-bold text-lg">
              5
            </div>
            <span className="text-white text-xs whitespace-nowrap">
              {t('droneSelect.survival')}
            </span>
          </div>

          {/* 드론 10대 */}
          <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
            <div className="flex items-end justify-center gap-2 sm:gap-4 w-full max-w-4xl">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex-1 max-w-[56px] flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                >
                  {i === SURVIVOR_INDEX ? (
                    /* 생존 드론: 골드/브론즈, 다리 형태 */
                    <div className="relative w-full aspect-square flex items-center justify-center">
                      <div
                        className="w-full h-14 rounded-lg bg-gradient-to-b from-amber-700 to-amber-900 border border-amber-500/50"
                        style={{
                          boxShadow: '0 0 20px rgba(245, 158, 11, 0.4), inset 0 2px 0 rgba(255,255,255,0.1)',
                        }}
                      />
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {[1, 2, 3, 4].map((j) => (
                          <div
                            key={j}
                            className="w-1.5 h-3 bg-amber-600 rounded-b"
                            style={{ transform: `rotate(${(j - 2.5) * 15}deg)` }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* 일반 드론: 실버 실린더 + 노란 글로우 */
                    <div
                      className="w-full h-14 rounded-xl bg-gradient-to-b from-slate-400 to-slate-600 border border-slate-500/50 flex flex-col justify-center items-center gap-1 py-2"
                      style={{
                        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), 0 0 12px rgba(250, 204, 21, 0.2)',
                      }}
                    >
                      <div className="w-3/4 h-1.5 rounded-full bg-yellow-400/80 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                      <div className="w-3/4 h-1.5 rounded-full bg-yellow-400/80 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* 하단 안내 + 버튼 */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center gap-3 z-10">
            <p className="text-white text-center text-sm sm:text-base max-w-xl">
              {t('droneSelect.round')}
            </p>
            <button
              type="button"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-500 hover:to-blue-600 transition shadow-lg"
            >
              {t('droneSelect.confirm')}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
