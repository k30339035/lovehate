'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const featureKeys = [
  { icon: '🎮', titleKey: 'features.f1.title', descKey: 'features.f1.desc' },
  { icon: '📚', titleKey: 'features.f2.title', descKey: 'features.f2.desc' },
  { icon: '👶', titleKey: 'features.f3.title', descKey: 'features.f3.desc' },
  { icon: '🔄', titleKey: 'features.f4.title', descKey: 'features.f4.desc' },
  { icon: '💰', titleKey: 'features.f5.title', descKey: 'features.f5.desc' },
  { icon: '📱', titleKey: 'features.f6.title', descKey: 'features.f6.desc' },
]

export default function Features() {
  const { t } = useLanguage()
  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('features.title')}</h2>
          <p className="text-xl text-gray-600">{t('features.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureKeys.map((f, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-gray-50 p-6 rounded-2xl hover:bg-white border border-transparent hover:border-primary-100 transition-all duration-300 hover:shadow-xl"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(f.titleKey)}</h3>
              <p className="text-gray-600">{t(f.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


