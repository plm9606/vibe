import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 미장 환율 계산기',
  description: '미장 환율 계산기의 개인정보처리방침입니다.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-5 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          계산기로 돌아가기
        </Link>

        <h1 className="text-3xl font-bold mb-2">개인정보처리방침</h1>
        <p className="text-gray-500 text-sm mb-10">최종 업데이트: 2025년 3월</p>

        <div className="space-y-8 text-gray-300 leading-relaxed text-sm">

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. 수집하는 정보</h2>
            <p>미장 환율 계산기(이하 "서비스")는 별도의 회원가입 없이 이용 가능하며, 개인 식별 정보를 수집하지 않습니다. 서비스 이용 시 다음 정보가 자동으로 수집될 수 있습니다.</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-400">
              <li>방문 페이지, 접속 시간 등 서비스 이용 기록 (Google Analytics)</li>
              <li>브라우저 종류, 운영체제, 기기 정보</li>
              <li>IP 주소 (익명 처리됨)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. 정보 이용 목적</h2>
            <p>수집된 정보는 다음 목적으로만 사용됩니다.</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-400">
              <li>서비스 품질 개선 및 이용 통계 분석</li>
              <li>오류 파악 및 기술적 문제 해결</li>
              <li>맞춤형 광고 제공 (Google AdSense)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. 광고 (Google AdSense)</h2>
            <p>본 서비스는 Google AdSense를 통해 광고를 제공합니다. Google은 쿠키를 사용하여 사용자의 관심사에 기반한 광고를 표시할 수 있습니다.</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-400">
              <li>Google의 광고 쿠키 사용을 원하지 않으시면 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google 광고 설정</a>에서 옵트아웃할 수 있습니다.</li>
              <li>Google의 개인정보처리방침은 <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">여기</a>에서 확인하세요.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. 쿠키</h2>
            <p>서비스는 Google Analytics 및 Google AdSense를 위한 쿠키를 사용합니다. 브라우저 설정에서 쿠키를 거부할 수 있으나, 일부 기능이 제한될 수 있습니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. 제3자 서비스</h2>
            <p>서비스는 다음 제3자 서비스를 이용합니다.</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-400">
              <li><strong className="text-white">Frankfurter API</strong> — 환율 데이터 제공 (유럽중앙은행)</li>
              <li><strong className="text-white">Yahoo Finance</strong> — 주가 데이터 제공</li>
              <li><strong className="text-white">Google Analytics</strong> — 서비스 이용 통계</li>
              <li><strong className="text-white">Google AdSense</strong> — 광고 서비스</li>
              <li><strong className="text-white">Vercel</strong> — 서비스 호스팅</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. 정보 보관 및 파기</h2>
            <p>서비스는 개인 식별 정보를 저장하지 않습니다. Google Analytics를 통해 수집된 통계 데이터는 Google의 데이터 보관 정책에 따라 관리됩니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. 방침 변경</h2>
            <p>본 개인정보처리방침은 서비스 변경에 따라 업데이트될 수 있습니다. 변경 시 본 페이지에 게시하며, 중요한 변경사항은 서비스 내 공지를 통해 알립니다.</p>
          </section>

        </div>


      </div>
    </main>
  );
}
