'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '1',
    title: '구독하기',
    description: '월 2,900원으로 구독하고 모든 게임에 접근하세요.',
  },
  {
    number: '2',
    title: '게임 선택',
    description: '글씨 드론, 로봇 조종, 네비게이션 등 원하는 게임을 선택하세요.',
  },
  {
    number: '3',
    title: '즐겁게 플레이',
    description: '7살 아이가 쉽게 조작할 수 있는 직관적인 게임을 즐기세요.',
  },
  {
    number: '4',
    title: '새로운 게임',
    description: '계속 추가되는 새로운 게임을 자동으로 이용할 수 있습니다!',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">이용 방법</h2>
          <p className="text-xl text-gray-600">
            간단한 4단계로 게임을 시작하세요
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary-300 transform -translate-y-1/2">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-primary-300 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


