import { Metadata } from 'next';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: '자주 묻는 질문 (FAQ) | 미장 환율 계산기',
  description: '미국 주식 투자와 환율에 대한 자주 묻는 질문과 답변을 정리했습니다. 환율 손익분기점, 환전 타이밍, 투자 전략 등을 알아보세요.',
  alternates: {
    canonical: 'https://mijang.vercel.app/faq',
  },
};

const faqs = [
  {
    q: '환율이 높을 때 미국 주식을 사면 무조건 손해인가요?',
    a: '꼭 그렇지는 않습니다. 환율이 높더라도 주가가 충분히 낮다면 오히려 유리할 수 있습니다. 중요한 것은 환율과 주가를 함께 고려한 "원화 기준 총비용"입니다. 미장 환율 계산기는 이 원화 기준 비용을 과거 평균과 비교해서 지금 사는 것이 유리한지 불리한지 알려줍니다.',
  },
  {
    q: '손익분기 주가란 정확히 무엇인가요?',
    a: '손익분기 주가는 현재 환율 기준으로 과거 평균 원화 비용과 동일한 금액이 되는 달러 주가입니다. 공식은 "손익분기 주가 = (평균 주가 × 평균 환율) ÷ 현재 환율"입니다. 현재 주가가 이 손익분기 주가보다 낮다면, 환율이 높더라도 과거 평균 대비 저렴하게 사는 셈이 됩니다.',
  },
  {
    q: '비교 기간(1개월, 3개월, 6개월, 1년)은 어떤 것을 선택해야 하나요?',
    a: '투자 스타일에 따라 다릅니다. 단기 트레이딩이라면 1~3개월, 중장기 투자라면 6개월~1년을 추천합니다. 기간이 길수록 시장의 전체적인 흐름을 반영하고, 짧을수록 최근 변동에 민감하게 반응합니다. 여러 기간을 비교해보면서 종합적으로 판단하는 것이 좋습니다.',
  },
  {
    q: '환율 데이터는 어디서 가져오나요?',
    a: 'ECB(유럽중앙은행)에서 제공하는 공식 환율 데이터를 Frankfurter API를 통해 조회합니다. ECB는 매 영업일마다 환율을 발표하며, 전 세계적으로 신뢰받는 환율 데이터 소스입니다. 다만 실시간 시장 환율과는 소폭 차이가 있을 수 있습니다.',
  },
  {
    q: '주가 데이터는 실시간인가요?',
    a: '주가 데이터는 Yahoo Finance에서 제공하며, 장중에는 약 15~20분 지연된 데이터가 표시될 수 있습니다. 정확한 매매 시점의 가격은 증권사 앱에서 확인하시기 바랍니다. 본 서비스의 데이터는 투자 참고용으로만 활용해주세요.',
  },
  {
    q: '환전 수수료도 고려되나요?',
    a: '현재 버전에서는 환전 수수료를 별도로 반영하지 않습니다. 실제 투자 시에는 증권사별 환전 수수료(통상 0.1~0.25%)와 스프레드를 추가로 고려해야 합니다. 많은 증권사에서 환전 우대 이벤트를 진행하니 활용하면 비용을 줄일 수 있습니다.',
  },
  {
    q: '어떤 종목을 검색할 수 있나요?',
    a: 'NYSE, NASDAQ 등 미국 주요 증권거래소에 상장된 종목이라면 대부분 검색 가능합니다. 주식 티커(예: AAPL, TSLA, NVDA)를 입력하면 됩니다. ETF(예: SPY, QQQ, VOO)도 검색할 수 있습니다.',
  },
  {
    q: '이 계산기의 결과를 믿고 투자해도 되나요?',
    a: '이 계산기는 환율과 주가의 과거 데이터를 기반으로 한 참고 도구입니다. 미래의 환율이나 주가를 예측하지 않으며, 투자 조언을 제공하지 않습니다. 실제 투자 결정은 기업 실적, 시장 상황, 개인의 투자 목표 등을 종합적으로 고려한 후 본인의 판단으로 내리시기 바랍니다.',
  },
  {
    q: '원화 강세(환율 하락)가 예상될 때는 어떻게 해야 하나요?',
    a: '원화 강세가 예상된다면, 미국 주식을 이미 보유 중인 경우 환차손이 발생할 수 있습니다. 반면 새로 매수하려는 경우에는 환율이 낮아진 후에 사는 것이 유리합니다. 다만 환율 예측은 매우 어렵기 때문에, 분할 매수 전략으로 환율 변동 리스크를 분산하는 것이 일반적인 방법입니다.',
  },
  {
    q: '분할 매수와 환율의 관계는 어떻게 되나요?',
    a: '분할 매수는 매수 시점을 나눠서 평균 매입 단가를 낮추는 전략입니다. 환율에도 같은 원리가 적용됩니다. 여러 시점에 나눠서 환전하면 환율 변동 리스크를 줄일 수 있습니다. 예를 들어 매달 일정 금액을 환전하여 투자하면, 환율이 높을 때는 적게, 낮을 때는 많이 사게 되어 평균 환율이 안정됩니다.',
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: a,
    },
  })),
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-2xl mx-auto px-5 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          계산기로 돌아가기
        </Link>

        <div className="text-4xl mb-4">FAQ</div>
        <h1 className="text-3xl font-bold mb-3">자주 묻는 질문</h1>
        <p className="text-gray-400 mb-10">미국 주식 투자와 환율에 대해 자주 묻는 질문을 정리했습니다.</p>

        <div className="space-y-6">
          {faqs.map(({ q, a }, i) => (
            <section key={i} className="bg-gray-900 rounded-2xl p-5">
              <h2 className="text-lg font-bold text-white mb-3">Q. {q}</h2>
              <p className="text-gray-300 leading-relaxed">{a}</p>
            </section>
          ))}
        </div>

        {/* 광고 */}
        <div className="mt-8">
          <AdBanner adSlot="AUTO" adFormat="auto" />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm">더 궁금한 점이 있으신가요?</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-sm transition-colors">
                계산기 사용하기
              </Link>
              <Link href="/guide" className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl font-bold text-sm transition-colors">
                투자 가이드 읽기
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
