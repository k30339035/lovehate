'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
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
              {t('hero.title1')}
              <span className="text-primary-600 block">{t('hero.title2')}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('hero.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#pricing"
                  className="block w-full bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition text-center shadow-lg hover:shadow-primary-600/30"
                >
                  {t('hero.ctaStart')}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#games"
                  className="block w-full bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition text-center border-2 border-primary-600 hover:shadow-lg"
                >
                  {t('hero.ctaGames')}
                </Link>
              </motion.div>
            </div>
            <div className="mt-5 bg-white/80 border border-primary-200 rounded-xl p-4 text-sm text-gray-700">
              <p className="font-semibold text-primary-700">{t('hero.googleSignup')}</p>
              <p className="mt-1">{t('hero.googleDataNotice')}</p>
              <p className="mt-1">{t('hero.googleDataPurpose')}</p>
              <p className="mt-2 text-gray-600">
                {t('hero.legalPrefix')}{' '}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-primary-700">
                  {t('hero.legalPrivacy')}
                </Link>{' '}
                {t('hero.legalAnd')}{' '}
                <Link href="/terms" className="underline underline-offset-2 hover:text-primary-700">
                  {t('hero.legalTerms')}
                </Link>
                {t('hero.legalSuffix')}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.2 },
              x: { duration: 0.6, delay: 0.2 },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:rotate-2 transition-transform duration-500">
              <div className="aspect-square bg-gradient-to-br from-primary-200 to-primary-400 rounded-lg flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out" />
                <div className="text-center p-8 relative z-10">
                  <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">🎮</div>
                  <p className="text-white text-xl font-semibold mb-2 group-hover:text-primary-50 transition-colors">{t('hero.gamesLabel')}</p>
                  <p className="text-white/90 text-sm group-hover:text-white transition-colors">{t('hero.gamesList')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
