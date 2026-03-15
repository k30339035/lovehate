'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { games } from '@/data/games'

export default function Games() {
  const { t } = useLanguage()
  return (
    <section id="games" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('games.title')}</h2>
          <p className="text-xl text-gray-600">{t('games.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={game.status === 'available' ? { scale: 1.05, y: -5 } : {}}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-md p-6 transition-all duration-300 ${game.status === 'coming-soon' ? 'opacity-70 grayscale-[30%]' : 'hover:shadow-xl border border-transparent hover:border-primary-100'}`}
            >
              <div className="text-5xl mb-4 text-center">{game.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{t(game.titleKey)}</h3>
              <p className="text-gray-600 mb-4 text-sm text-center">{t(game.descKey)}</p>
              {game.playUrl ? (
                <a
                  href={game.playUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-4 py-2 rounded-lg text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition"
                >
                  {t(game.statusKey)}
                </a>
              ) : (
                <div className={`text-center px-4 py-2 rounded-lg text-sm font-semibold ${game.status === 'available' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                  {t(game.statusKey)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
