import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">이용약관</h1>
        <p className="text-sm text-gray-500 mb-8">최종 업데이트: 2026-02-17</p>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">1. 서비스 이용</h2>
          <p>KPAI (Korea Play AI)는 웹 기반 교육 게임 서비스를 제공합니다. 이용자는 관련 법령 및 본 약관을 준수해야 합니다.</p>
        </section>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">2. 회원 계정</h2>
          <p>회원 가입은 Google 로그인을 통해 진행되며, 계정 보안은 이용자 본인의 책임입니다.</p>
        </section>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">3. 요금 및 결제</h2>
          <p>유료 서비스 이용 시 안내된 요금 정책이 적용되며, 결제 및 환불은 결제 수단 정책 및 관련 법령을 따릅니다.</p>
        </section>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">4. 금지 행위</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>서비스의 정상 운영을 방해하는 행위</li>
            <li>타인의 계정을 무단 사용하는 행위</li>
            <li>관련 법령에 위반되는 행위</li>
          </ul>
        </section>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">5. 문의</h2>
          <p>이용약관 관련 문의: createman@naver.com / stwo.kim@gmail.com</p>
        </section>

        <div className="pt-4 border-t border-gray-200">
          <Link href="/" className="text-primary-700 hover:text-primary-800 underline underline-offset-2">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  )
}
