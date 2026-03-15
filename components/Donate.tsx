'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const BANK_NAME = '카카오뱅크'
const ACCOUNT_NUMBER = '3333-03-5803082'
const ACCOUNT_HOLDER = '김성수'

export default function Donate() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <section id="donate" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('donate.title')}</h2>
          <p className="text-xl text-gray-600 mb-10">{t('donate.subtitle')}</p>

          <div className="bg-gray-50 rounded-2xl p-8 border-2 border-primary-100">
            <p className="text-sm text-gray-500 mb-6">{t('donate.note')}</p>

            <div className="space-y-4 text-left max-w-sm mx-auto">
              <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">{t('donate.bank')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-semibold">{BANK_NAME}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(BANK_NAME, 'bank')}
                    className="text-primary-600 text-sm hover:underline"
                  >
                    {copied === 'bank' ? t('donate.copied') : t('donate.copy')}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">{t('donate.account')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-semibold font-mono">{ACCOUNT_NUMBER}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(ACCOUNT_NUMBER.replace(/-/g, ''), 'account')}
                    className="text-primary-600 text-sm hover:underline"
                  >
                    {copied === 'account' ? t('donate.copied') : t('donate.copy')}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="text-gray-600 font-medium">{t('donate.holder')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-semibold">{ACCOUNT_HOLDER}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(ACCOUNT_HOLDER, 'name')}
                    className="text-primary-600 text-sm hover:underline"
                  >
                    {copied === 'name' ? t('donate.copied') : t('donate.copy')}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-6">{t('donate.thanks')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
