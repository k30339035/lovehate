'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { useLanguage } from '@/contexts/LanguageContext'

// Stripe는 필요할 때만 로드 (lazy loading)
const getStripe = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) return null
  return loadStripe(key)
}

interface Plan {
  name: string
  priceId?: string
}

interface PaymentButtonProps {
  plan: Plan
}

export default function PaymentButton({ plan }: PaymentButtonProps) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    if (!plan.priceId) {
      alert('결제 설정이 완료되지 않았습니다. NEXT_PUBLIC_STRIPE_PRICE_ID를 설정해 주세요.')
      return
    }

    setLoading(true)
    try {
      // 결제 세션 생성 API 호출
      // TODO: 실제 이메일 입력 받기 (현재는 임시)
      const response = await axios.post('/api/create-checkout-session', {
        priceId: plan.priceId,
        planName: plan.name,
        email: '', // 사용자 이메일 입력 필요
      })

      const stripe = await getStripe()
      if (stripe && response.data.sessionId) {
        // Stripe 결제 페이지로 리다이렉트
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        })

        if (error) {
          console.error('결제 오류:', error)
          alert('결제 처리 중 오류가 발생했습니다.')
        }
      }
    } catch (error) {
      console.error('결제 세션 생성 오류:', error)
      alert('결제 처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? t('payment.loading') : t('payment.subscribe')}
    </button>
  )
}


