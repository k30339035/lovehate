'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const featureKeys = [
  'games.subway.feature1',
  'games.subway.feature2',
  'games.subway.feature3',
  'games.subway.feature4',
  'games.subway.feature5',
  'games.subway.feature6',
  'games.subway.feature7',
  'games.subway.feature8',
  'games.subway.feature9',
  'games.subway.feature10',
]

const SUBWAY_GAME_URL = process.env.NEXT_PUBLIC_SUBWAY_GAME_URL || ''

export default function SubwayGameSection() {
  const { t } = useLanguage()
  return (
    <section id="subway-game" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-5xl mb-4">🚇</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('games.subway.title')}</h2>
          <p className="text-lg text-gray-600 italic max-w-3xl mx-auto">{t('games.subway.oneliner')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{t('games.subway.featuresTitle')}</h3>
          <ul className="space-y-4">
            {featureKeys.map((key, index) => (
              <motion.li
                key={key}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex gap-3 text-gray-700"
              >
                <span className="text-primary-600 font-bold shrink-0">•</span>
                <span>{t(key)}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {SUBWAY_GAME_URL && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <a
              href={SUBWAY_GAME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-lg text-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 transition shadow-md"
            >
              {t('games.subway.playButton')}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}
