'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">{t('footer.brand')}</h3>
            <p className="text-gray-400">{t('footer.desc')}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.games')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#games" className="hover:text-white transition-all inline-block hover:translate-x-1">{t('footer.gameIntro')}</Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-all inline-block hover:translate-x-1">{t('footer.platformFeatures')}</Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition-all inline-block hover:translate-x-1">{t('footer.subscribePrice')}</Link>
              </li>
              <li>
                <Link href="#donate" className="hover:text-white transition-all inline-block hover:translate-x-1">{t('footer.donate')}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/support" className="hover:text-white transition-all inline-block hover:translate-x-1">{t('footer.customerSupport')}</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-all inline-block hover:translate-x-1">{t('footer.faq')}</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-all inline-block hover:translate-x-1">{t('footer.contact')}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-white transition-all inline-block hover:translate-x-1">{t('footer.privacy')}</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-all inline-block hover:translate-x-1">{t('footer.terms')}</Link>
              </li>
              <li>
                <Link href="/data-deletion" className="hover:text-white transition-all inline-block hover:translate-x-1">{t('footer.dataDeletion')}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-white font-semibold mb-4">{t('footer.contactTitle')}</h4>
          <ul className="space-y-2">
            <li className="text-sm text-gray-400">{t('footer.emailNote')}</li>
            <li>{t('footer.email1')}: createman@naver.com</li>
            <li>{t('footer.email2')}: stwo.kim@gmail.com</li>
          </ul>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024-2026 {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
