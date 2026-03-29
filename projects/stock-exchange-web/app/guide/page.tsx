import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '환율이 미국 주식 투자에 미치는 영향 | 미장 환율 계산기',
  description: '환율 변동이 미국 주식 투자 수익에 어떤 영향을 미치는지 알아보세요. 환율 손익분기점 계산 방법과 투자 전략을 정리했습니다.',
};

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-5 py-12">

        {/* 헤더 */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          계산기로 돌아가기
        </Link>

        <div className="text-4xl mb-4">📚</div>
        <h1 className="text-3xl font-bold mb-3">환율이 미국 주식 투자에 미치는 영향</h1>
        <p className="text-gray-400 mb-10">미국 주식에 투자할 때 주가만큼 중요한 것이 바로 환율입니다. 환율을 무시하면 주가가 올라도 손해를 볼 수 있습니다.</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">🤔 환율이 왜 중요한가요?</h2>
            <p>한국 투자자가 미국 주식을 살 때는 원화를 달러로 환전해야 합니다. 예를 들어 애플(AAPL) 주식을 $200에 샀는데, 그때 환율이 1,200원이었다면 총 24만 원을 쓴 셈입니다.</p>
            <p className="mt-3">나중에 주가가 $220으로 올랐어도, 환율이 1,100원으로 떨어졌다면 원화로 환산하면 24만 2천 원입니다. 주가는 10% 올랐지만 실제 수익은 약 0.8%에 불과합니다.</p>
            <p className="mt-3">반대로 주가가 그대로여도 환율이 오르면 수익이 생깁니다. 미국 주식 투자는 주가와 환율, 두 가지 변수를 동시에 신경 써야 합니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">📈 환율이 높을 때 주식을 사면?</h2>
            <p>2024~2025년처럼 환율이 1,400~1,500원대로 높은 시기에 미국 주식을 사면 같은 달러어치 주식을 사는 데 더 많은 원화가 필요합니다.</p>
            <div className="bg-gray-900 rounded-xl p-4 my-4">
              <p className="text-sm text-gray-400 mb-2">예시</p>
              <p className="font-mono text-sm">환율 1,200원 → AAPL $200 = <span className="text-emerald-400">240,000원</span></p>
              <p className="font-mono text-sm mt-1">환율 1,500원 → AAPL $200 = <span className="text-red-400">300,000원</span></p>
            </div>
            <p>같은 $200짜리 주식인데 환율 차이로 6만 원을 더 내야 합니다. 이 차이를 주가 하락으로 상쇄하려면, 주가가 충분히 빠져야 합니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">🎯 손익분기 주가란?</h2>
            <p>손익분기 주가란 <strong className="text-white">현재 환율 기준으로, 3개월 평균 원화 비용과 동일한 금액이 되는 달러 주가</strong>입니다.</p>
            <div className="bg-gray-900 rounded-xl p-4 my-4">
              <p className="text-sm text-gray-400 mb-2">계산 공식</p>
              <p className="font-mono text-sm text-blue-300">손익분기 주가 = 평균 원화 비용 ÷ 현재 환율</p>
              <p className="font-mono text-sm mt-2 text-gray-400">= (3개월 평균 주가 × 3개월 평균 환율) ÷ 현재 환율</p>
            </div>
            <p>이 가격 이하로 주가가 내려오면, 지금 높은 환율에 사더라도 3개월 평균 대비 손해가 아닌 상태가 됩니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">💡 실전 활용법</h2>
            <ol className="space-y-3 list-decimal list-inside">
              <li><strong className="text-white">관심 종목 입력</strong> — 계산기에 티커를 입력하면 현재가와 3개월 평균가를 자동으로 가져옵니다.</li>
              <li><strong className="text-white">손익분기 확인</strong> — 현재 환율 기준으로 얼마까지 빠져야 이득인지 한눈에 볼 수 있습니다.</li>
              <li><strong className="text-white">기간 조정</strong> — 1개월, 3개월, 6개월, 1년 단위로 비교 기준을 바꿀 수 있습니다.</li>
              <li><strong className="text-white">공유</strong> — 결과를 친구나 투자 커뮤니티에 공유해 의견을 나눠보세요.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">⚠️ 주의사항</h2>
            <p>이 계산기는 환율과 주가의 과거 평균을 기준으로 한 참고 도구입니다. 미래 환율과 주가를 예측하지 않으며, 투자 결정의 모든 책임은 투자자 본인에게 있습니다.</p>
            <p className="mt-3">미국 주식 투자 시에는 환율 외에도 기업 실적, 글로벌 경기 흐름, 섹터 트렌드 등 다양한 요소를 함께 고려하시기 바랍니다.</p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-colors">
            지금 바로 계산해보기 →
          </Link>
        </div>

      </div>
    </main>
  );
}
