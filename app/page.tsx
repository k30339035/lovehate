import dynamic from 'next/dynamic'
import Header from '@/components/Header'

// 무거운 컴포넌트는 동적 로딩 (초기 로딩 최적화)
const Hero = dynamic(() => import('@/components/Hero'), {
  loading: () => <div className="h-screen" />,
})
const Features = dynamic(() => import('@/components/Features'))
const Games = dynamic(() => import('@/components/Games'))
const SubwayGameSection = dynamic(() => import('@/components/SubwayGameSection'))
const DroneSelectScreen = dynamic(() => import('@/components/DroneSelectScreen'))
const HowItWorks = dynamic(() => import('@/components/HowItWorks'))
const Pricing = dynamic(() => import('@/components/Pricing'))
const Download = dynamic(() => import('@/components/Download'))
const Donate = dynamic(() => import('@/components/Donate'))
const Footer = dynamic(() => import('@/components/Footer'))

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Games />
      <SubwayGameSection />
      <DroneSelectScreen />
      <Features />
      <HowItWorks />
      <Pricing />
      <Download />
      <Donate />
      <Footer />
    </main>
  )
}


