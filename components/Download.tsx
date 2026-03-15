'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Download() {
  const { t } = useLanguage()
  return (
    <section id="play" className="py-20 px-4 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('play.title')}
          </h2>
          <p className="text-xl mb-8 text-primary-100">{t('play.subtitle')}</p>

          <Link
            href="#pricing"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition"
          >
            <span className="text-2xl">🎮</span>
            {t('play.cta')}
          </Link>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-3xl mb-2">🌐</div>
              <h3 className="text-xl font-semibold mb-2">{t('play.browser')}</h3>
              <p className="text-primary-100">{t('play.browserDesc')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="text-xl font-semibold mb-2">{t('play.various')}</h3>
              <p className="text-primary-100">{t('play.variousDesc')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="text-xl font-semibold mb-2">{t('play.update')}</h3>
              <p className="text-primary-100">{t('play.updateDesc')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
