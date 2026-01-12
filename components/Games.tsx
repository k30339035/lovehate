'use client'

import { motion } from 'framer-motion'

const games = [
  {
    icon: '✍️',
    title: '글씨 드론 게임',
    description: '손가락으로 글씨를 쓰면 드론이 그 경로를 따라 움직이는 재미있는 게임입니다.',
    status: 'available',
    statusText: '지금 플레이',
  },
  {
    icon: '🤖',
    title: '로봇 조종 게임',
    description: '7살 아이가 로봇을 조종해서 목적지를 찾아가는 미션 게임입니다.',
    status: 'coming-soon',
    statusText: '곧 출시 예정',
  },
  {
    icon: '🗺️',
    title: '네비게이션 게임',
    description: '네비로 길을 찾아가며 공간 인지력을 키우는 교육 게임입니다.',
    status: 'coming-soon',
    statusText: '곧 출시 예정',
  },
  {
    icon: '🎮',
    title: '더 많은 게임',
    description: '새로운 게임이 계속 추가될 예정입니다. 기대해주세요!',
    status: 'coming-soon',
    statusText: '준비 중',
  },
]

export default function Games() {
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">게임 소개</h2>
          <p className="text-xl text-gray-600">
            다양한 교육 게임을 만나보세요
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition ${
                game.status === 'coming-soon' ? 'opacity-75' : ''
              }`}
            >
              <div className="text-5xl mb-4 text-center">{game.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {game.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm text-center">
                {game.description}
              </p>
              <div className={`text-center px-4 py-2 rounded-lg text-sm font-semibold ${
                game.status === 'available'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {game.statusText}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
