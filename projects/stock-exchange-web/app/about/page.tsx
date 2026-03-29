import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '서비스 소개 | 미장 환율 계산기',
  description: '미장 환율 계산기는 환율을 고려한 미국 주식 손익분기점을 계산해주는 무료 도구입니다.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-5 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          계산기로 돌아가기
        </Link>

        <div className="text-4xl mb-4">📈</div>
        <h1 className="text-3xl font-bold mb-3">미장 환율 계산기</h1>
        <p className="text-gray-400 mb-10">지금 사면 손해일까? 환율을 고려해서 계산해드립니다.</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">서비스 소개</h2>
            <p>미장 환율 계산기는 한국 투자자를 위한 미국 주식 환율 손익분기 계산 도구입니다. 원화 환율이 높은 시기에 미국 주식을 매수할 때, 얼마나 더 주가가 하락해야 환율 불이익을 만회할 수 있는지 실시간으로 계산합니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">주요 기능</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-0.5">✦</span>
                <div>
                  <strong className="text-white">실시간 환율 조회</strong>
                  <p className="text-sm text-gray-400 mt-0.5">ECB(유럽중앙은행) 데이터 기반의 USD/KRW 환율을 실시간으로 조회합니다.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-0.5">✦</span>
                <div>
                  <strong className="text-white">미국 주가 조회</strong>
                  <p className="text-sm text-gray-400 mt-0.5">Yahoo Finance 데이터를 통해 주요 미국 상장 종목의 현재가와 히스토리를 조회합니다.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-0.5">✦</span>
                <div>
                  <strong className="text-white">손익분기 계산</strong>
                  <p className="text-sm text-gray-400 mt-0.5">현재 환율 기준으로 3개월 평균 원화 비용과 동일한 달러 주가를 계산합니다.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-0.5">✦</span>
                <div>
                  <strong className="text-white">기간 선택</strong>
                  <p className="text-sm text-gray-400 mt-0.5">1개월, 3개월, 6개월, 1년 단위로 비교 기준 기간을 자유롭게 선택할 수 있습니다.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-0.5">✦</span>
                <div>
                  <strong className="text-white">결과 공유</strong>
                  <p className="text-sm text-gray-400 mt-0.5">분석 결과를 링크로 공유하여 투자 커뮤니티나 지인과 의견을 나눌 수 있습니다.</p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">데이터 출처</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-gray-500">환율</span>
                <span className="text-gray-600">—</span>
                <span>Frankfurter API (유럽중앙은행 공식 데이터)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-500">주가</span>
                <span className="text-gray-600">—</span>
                <span>Yahoo Finance</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">면책 조항</h2>
            <p className="text-sm">본 서비스는 투자 참고용으로만 제공되며, 실제 투자 조언이 아닙니다. 제공되는 데이터의 정확성을 보장하지 않으며, 투자 결정에 따른 손실에 대해 책임지지 않습니다. 모든 투자 결정은 투자자 본인의 판단과 책임 하에 이루어져야 합니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">문의</h2>
            <p className="text-sm">서비스 관련 문의는 아래 링크를 통해 연락해 주세요.</p>
          </section>

        </div>

        <div className="mt-12 flex gap-3 flex-wrap">
          <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
            계산기 사용하기
          </Link>
          <Link href="/guide" className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
            투자 가이드 읽기
          </Link>
          <Link href="/privacy" className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
            개인정보처리방침
          </Link>
        </div>

      </div>
    </main>
  );
}
