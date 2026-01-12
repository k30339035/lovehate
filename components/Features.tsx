'use client'

import { motion } from 'framer-motion'

const features = [
  {
    icon: '🎮',
    title: '다양한 교육 게임',
    description: '글씨 드론, 로봇 조종, 네비게이션 등 아이들을 위한 다양한 게임을 제공합니다.',
  },
  {
    icon: '📚',
    title: '교육적 가치',
    description: '재미있게 놀면서 자연스럽게 학습할 수 있는 교육 게임입니다.',
  },
  {
    icon: '👶',
    title: '7살 아이 맞춤',
    description: '7살 아이의 발달 단계에 맞춘 직관적이고 쉬운 조작법을 제공합니다.',
  },
  {
    icon: '🔄',
    title: '계속 추가되는 게임',
    description: '새로운 게임이 계속 추가되어 더 많은 재미를 경험할 수 있습니다.',
  },
  {
    icon: '💰',
    title: '합리적인 가격',
    description: '모든 게임을 월 2,900원으로 이용할 수 있는 합리적인 구독제입니다.',
  },
  {
    icon: '📱',
    title: '간편한 사용',
    description: '스마트폰이나 태블릿에서 쉽게 다운로드하고 바로 플레이할 수 있습니다.',
  },
]

export default function Features() {
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">플랫폼 특징</h2>
          <p className="text-xl text-gray-600">
            LoveHate 게임 플랫폼의 특징을 만나보세요
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


