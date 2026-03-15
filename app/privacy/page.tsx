import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
        <p className="text-sm text-gray-500 mb-8">최종 업데이트: 2026-02-17</p>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">1. 수집 항목</h2>
          <p>KPAI (Korea Play AI)는 Google 로그인 시 아래 최소 정보만 수집합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Google 고유 식별자(sub)</li>
            <li>이메일 주소</li>
            <li>프로필 이름</li>
          </ul>
        </section>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">2. 수집 목적</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원 계정 생성 및 로그인 처리</li>
            <li>이용자 식별 및 계정 보안 유지</li>
            <li>고객 문의 응대</li>
          </ul>
        </section>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">3. 보관 기간</h2>
          <p>회원 탈퇴 또는 데이터 삭제 요청 전까지 보관하며, 관련 법령에 따른 보존 의무가 있는 경우 해당 기간 동안 보관합니다.</p>
        </section>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">4. 제3자 제공</h2>
          <p>법령상 의무가 있는 경우를 제외하고, 이용자 동의 없이 개인정보를 외부에 제공하지 않습니다.</p>
        </section>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">5. 문의 및 삭제 요청</h2>
          <p>아래 이메일로 계정/데이터 삭제를 요청할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>createman@naver.com</li>
            <li>stwo.kim@gmail.com</li>
          </ul>
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
