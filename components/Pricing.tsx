'use client'

import { motion } from 'framer-motion'
import PaymentButton from './PaymentButton'
import { useLanguage } from '@/contexts/LanguageContext'

const featureKeys = ['pricing.f1', 'pricing.f2', 'pricing.f3', 'pricing.f4', 'pricing.f5', 'pricing.f6', 'pricing.f7']

export default function Pricing() {
  const { t } = useLanguage()
  const plan = {
    name: t('pricing.planName'),
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || undefined,
  }
  return (
    <section id="pricing" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('pricing.title')}</h2>
          <p className="text-xl text-gray-600">{t('pricing.subtitle')}</p>
          <p className="text-sm text-gray-500 mt-2">{t('pricing.note')}</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-600 scale-105"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              {t('pricing.popular')}
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing.planName')}</h3>
              <div className="text-4xl font-bold text-primary-600 mb-2">{t('pricing.price')}</div>
              <div className="text-sm text-gray-500">/월</div>
              <p className="text-gray-600 mt-4">{t('pricing.planDesc')}</p>
            </div>
            <ul className="space-y-3 mb-8">
              {featureKeys.map((key, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t(key)}</span>
                </li>
              ))}
            </ul>
            <PaymentButton plan={plan} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
