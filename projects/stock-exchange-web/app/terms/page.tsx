import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관 | 미장 환율 계산기',
  description: '미장 환율 계산기의 이용약관입니다. 서비스 이용 조건과 면책 사항을 확인하세요.',
  alternates: {
    canonical: 'https://mijang.vercel.app/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-5 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          계산기로 돌아가기
        </Link>

        <h1 className="text-3xl font-bold mb-2">이용약관</h1>
        <p className="text-gray-500 text-sm mb-10">최종 업데이트: 2025년 3월</p>

        <div className="space-y-8 text-gray-300 leading-relaxed text-sm">

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. 서비스 개요</h2>
            <p>미장 환율 계산기(이하 &quot;서비스&quot;)는 한국 투자자를 위한 미국 주식 환율 손익분기점 계산 도구입니다. 본 서비스는 무료로 제공되며, 별도의 회원가입 없이 이용할 수 있습니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. 이용 조건</h2>
            <p>본 서비스를 이용함으로써 귀하는 다음 약관에 동의하는 것으로 간주됩니다.</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-400">
              <li>서비스는 만 14세 이상의 개인이 이용할 수 있습니다.</li>
              <li>서비스에서 제공하는 정보는 투자 참고용으로만 사용해야 합니다.</li>
              <li>서비스를 불법적인 목적이나 비정상적인 방법으로 이용해서는 안 됩니다.</li>
              <li>자동화된 도구를 사용하여 서비스에 과도한 부하를 주는 행위는 금지됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. 면책 조항</h2>
            <p>본 서비스에서 제공하는 모든 정보(환율, 주가, 손익분기 계산 결과 등)는 투자 참고용으로만 제공되며, <strong className="text-white">투자 조언이나 권유가 아닙니다.</strong></p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-400">
              <li>제공되는 데이터의 정확성, 완전성, 적시성을 보장하지 않습니다.</li>
              <li>환율 및 주가 데이터는 제3자(ECB, Yahoo Finance)로부터 제공받으며, 실시간 시장가와 차이가 있을 수 있습니다.</li>
              <li>서비스 이용으로 인한 직접적, 간접적 손실에 대해 책임지지 않습니다.</li>
              <li>모든 투자 결정은 이용자 본인의 판단과 책임 하에 이루어져야 합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. 데이터 출처 및 정확성</h2>
            <p>서비스에서 사용하는 데이터의 출처는 다음과 같습니다.</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-400">
              <li><strong className="text-white">환율 데이터:</strong> 한국 수출입은행 Open API 및 Frankfurter API(유럽중앙은행 공식 데이터)</li>
              <li><strong className="text-white">주가 데이터:</strong> Yahoo Finance</li>
            </ul>
            <p className="mt-3">데이터는 각 출처의 업데이트 주기에 따라 제공되며, 실시간 거래 데이터와 차이가 있을 수 있습니다. 정확한 매매 가격은 이용 중인 증권사에서 확인하시기 바랍니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. 지적 재산권</h2>
            <p>서비스의 디자인, 로고, 콘텐츠, 소스코드 등에 대한 지적 재산권은 서비스 운영자에게 있습니다. 서비스 콘텐츠의 무단 복제, 배포, 수정은 금지됩니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. 서비스 변경 및 중단</h2>
            <p>서비스 운영자는 다음과 같은 경우 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-400">
              <li>기술적 필요에 의한 서비스 점검 또는 업데이트</li>
              <li>외부 데이터 소스(환율, 주가 API)의 변경 또는 중단</li>
              <li>불가항력적 사유 발생</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. 광고</h2>
            <p>서비스는 Google AdSense를 통해 광고를 표시합니다. 광고 콘텐츠는 Google에 의해 제공되며, 서비스 운영자는 광고 내용에 대해 책임지지 않습니다. 광고 관련 개인정보 처리에 대한 자세한 내용은 <Link href="/privacy" className="text-blue-400 underline">개인정보처리방침</Link>을 참고하세요.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. 약관 변경</h2>
            <p>본 약관은 서비스 변경에 따라 업데이트될 수 있습니다. 변경된 약관은 본 페이지에 게시되며, 변경 후 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주됩니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. 문의</h2>
            <p>본 약관에 대한 문의사항이 있으시면 <a href="mailto:vitmdgus12@gmail.com" className="text-blue-400 underline">vitmdgus12@gmail.com</a>으로 연락해 주세요.</p>
          </section>

        </div>


      </div>
    </main>
  );
}
