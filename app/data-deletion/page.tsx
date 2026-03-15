import Link from 'next/link'

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">데이터 삭제 안내</h1>
        <p className="text-sm text-gray-500 mb-8">최종 업데이트: 2026-02-17</p>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">요청 방법</h2>
          <p>아래 이메일로 데이터 삭제를 요청해 주세요. 요청 시 가입한 이메일 주소를 함께 알려주세요.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>createman@naver.com</li>
            <li>stwo.kim@gmail.com</li>
          </ul>
        </section>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">처리 범위</h2>
          <p>계정 식별 정보(이메일, 이름, Google 식별자)와 서비스 이용과 관련된 사용자 데이터를 삭제합니다.</p>
        </section>

        <section className="space-y-3 text-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">처리 기간</h2>
          <p>원칙적으로 요청 확인 후 영업일 기준 7일 이내 처리하며, 법령에 따른 보관 의무 데이터는 해당 기간 동안 분리 보관될 수 있습니다.</p>
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
