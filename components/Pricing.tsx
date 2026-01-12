'use client'

import { motion } from 'framer-motion'
import PaymentButton from './PaymentButton'

const plans = [
  {
    name: '월간 구독',
    price: '₩2,900',
    priceId: 'monthly_subscription',
    description: '모든 게임을 월 2,900원에 이용하세요',
    features: [
      '모든 게임 무제한 플레이',
      '글씨 드론 게임',
      '로봇 조종 게임 (출시 예정)',
      '네비게이션 게임 (출시 예정)',
      '새로운 게임 자동 추가',
      '광고 없음',
      '언제든지 취소 가능',
    ],
    popular: true,
  },
]

export default function Pricing() {
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">구독 가격</h2>
          <p className="text-xl text-gray-600">
            모든 게임을 월 2,900원에 이용하세요
          </p>
          <p className="text-sm text-gray-500 mt-2">
            사용자 확보를 위해 특별 가격으로 제공됩니다
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'border-2 border-primary-600 scale-105' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  인기
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {plan.price}
                </div>
                {plan.priceId && (
                  <div className="text-sm text-gray-500">
                    {plan.name === '연간' ? '/년' : '/월'}
                  </div>
                )}
                <p className="text-gray-600 mt-4">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.priceId ? (
                <PaymentButton plan={plan} />
              ) : (
                <a
                  href="#download"
                  className="block w-full bg-gray-100 text-gray-700 text-center py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  무료로 시작하기
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


