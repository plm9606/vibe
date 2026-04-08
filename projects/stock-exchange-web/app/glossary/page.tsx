import { Metadata } from 'next';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: '미국 주식 투자 용어 사전 | 미장 환율 계산기',
  description: '미국 주식 투자에 필요한 핵심 용어를 쉽게 정리했습니다. 환율, 손익분기, ETF, 배당 등 한국 투자자가 꼭 알아야 할 투자 용어를 확인하세요.',
  alternates: {
    canonical: 'https://mijang.vercel.app/glossary',
  },
};

const glossaryTerms = [
  {
    term: 'USD/KRW 환율',
    english: 'Exchange Rate',
    description: '미국 달러(USD)와 한국 원화(KRW) 사이의 교환 비율입니다. 예를 들어 USD/KRW 환율이 1,400이라면, 1달러를 사는 데 1,400원이 필요하다는 뜻입니다.',
    detail: '환율이 오르면(원화 약세) 같은 달러로 환전할 때 더 많은 원화가 필요하고, 환율이 내리면(원화 강세) 더 적은 원화로 환전할 수 있습니다. 미국 주식 투자 시 환율 변동은 수익률에 직접적인 영향을 미칩니다.',
  },
  {
    term: '손익분기점',
    english: 'Break-Even Point',
    description: '투자한 금액을 회수할 수 있는 최소 가격입니다. 미장 환율 계산기에서는 현재 환율 기준으로 과거 평균 원화 비용과 동일해지는 달러 주가를 손익분기 주가로 계산합니다.',
    detail: '공식: 손익분기 주가 = (평균 주가 x 평균 환율) / 현재 환율. 현재 주가가 손익분기 주가보다 낮으면 환율이 높더라도 과거 평균 대비 저렴하게 사는 것입니다.',
  },
  {
    term: '환차손 / 환차익',
    english: 'Foreign Exchange Loss / Gain',
    description: '외환 거래에서 환율 변동으로 인해 발생하는 손실 또는 이익입니다.',
    detail: '예를 들어 환율 1,400원에 미국 주식을 $100어치 샀다면 14만 원을 투자한 것입니다. 나중에 주가가 그대로인데 환율이 1,300원으로 떨어지면 원화 가치는 13만 원이 되어 1만 원의 환차손이 발생합니다. 반대로 환율이 1,500원으로 오르면 15만 원이 되어 1만 원의 환차익이 생깁니다.',
  },
  {
    term: '원화 강세 / 약세',
    english: 'KRW Appreciation / Depreciation',
    description: '원화 강세는 환율이 하락하는 것(원화 가치 상승), 원화 약세는 환율이 상승하는 것(원화 가치 하락)을 뜻합니다.',
    detail: '원화 강세 시에는 달러 자산의 원화 환산 가치가 줄어들어 기존 보유 주식의 수익이 감소하지만, 새로 매수할 때는 유리합니다. 원화 약세 시에는 반대입니다.',
  },
  {
    term: '티커 (Ticker Symbol)',
    english: 'Ticker Symbol',
    description: '주식 시장에서 특정 종목을 식별하기 위해 사용하는 알파벳 약어입니다. 예: AAPL(애플), TSLA(테슬라), NVDA(엔비디아).',
    detail: 'NYSE(뉴욕증권거래소)와 NASDAQ에 상장된 종목은 보통 1~5글자의 티커를 사용합니다. ETF도 티커가 있으며, 예를 들어 SPY는 S&P 500을 추종하는 대표적인 ETF입니다.',
  },
  {
    term: 'ETF (상장지수펀드)',
    english: 'Exchange-Traded Fund',
    description: '주식처럼 거래소에서 사고팔 수 있는 펀드입니다. 여러 종목에 분산 투자하는 효과를 하나의 상품으로 얻을 수 있습니다.',
    detail: '대표적인 미국 ETF로는 SPY(S&P 500 추종), QQQ(나스닥 100 추종), VOO(뱅가드 S&P 500) 등이 있습니다. 개별 종목 투자보다 리스크가 분산되어 해외 주식 입문자에게 많이 추천됩니다.',
  },
  {
    term: '분할 매수',
    english: 'Dollar-Cost Averaging (DCA)',
    description: '한 번에 모든 금액을 투자하지 않고, 일정 기간에 걸쳐 나눠서 매수하는 전략입니다.',
    detail: '매달 일정 금액을 투자하면 주가가 높을 때는 적게, 낮을 때는 많이 사게 되어 평균 매입 단가가 안정됩니다. 환율에도 같은 원리가 적용되어 환율 변동 리스크를 줄일 수 있습니다. 시장 타이밍을 맞추기 어려운 개인 투자자에게 효과적인 전략입니다.',
  },
  {
    term: '배당 (Dividend)',
    english: 'Dividend',
    description: '기업이 이익의 일부를 주주에게 현금 또는 주식으로 나눠주는 것입니다.',
    detail: '미국 기업은 분기별(3개월마다) 배당을 지급하는 경우가 많습니다. 한국 투자자의 경우 배당금을 받을 때 미국에서 15% 원천징수세가 부과되며, 배당금은 달러로 지급되므로 환율의 영향을 받습니다.',
  },
  {
    term: '시가총액',
    english: 'Market Capitalization',
    description: '기업의 발행 주식 수에 현재 주가를 곱한 값으로, 기업의 시장 가치를 나타냅니다.',
    detail: '시가총액 = 발행 주식 수 x 현재 주가. 대형주(Large Cap)는 보통 시가총액 100억 달러 이상, 중형주(Mid Cap)는 20~100억 달러, 소형주(Small Cap)는 20억 달러 미만으로 분류합니다.',
  },
  {
    term: 'PER (주가수익비율)',
    english: 'Price-to-Earnings Ratio',
    description: '주가를 주당순이익(EPS)으로 나눈 값으로, 주가가 기업 수익에 비해 얼마나 비싼지 평가하는 지표입니다.',
    detail: 'PER = 주가 / 주당순이익. PER이 높으면 시장이 해당 기업의 미래 성장성을 높게 평가하는 것이고, 낮으면 상대적으로 저평가된 것일 수 있습니다. 같은 산업 내 기업들과 비교하는 것이 의미 있으며, 산업별로 적정 PER 수준이 다릅니다.',
  },
  {
    term: '해외주식 양도소득세',
    english: 'Capital Gains Tax',
    description: '해외 주식 매매로 얻은 이익에 대해 부과되는 세금입니다. 한국에서는 해외 주식 양도차익이 연 250만 원을 초과하면 22%(지방세 포함)의 세율이 적용됩니다.',
    detail: '양도소득세는 매년 1월 1일~12월 31일 기준으로 계산하며, 다음 해 5월에 확정 신고합니다. 손실이 난 종목과 이익이 난 종목을 합산하여 순이익에 대해서만 과세됩니다. 증권사에서 대행 신고 서비스를 제공하는 경우가 많습니다.',
  },
  {
    term: '환전 우대',
    english: 'FX Preferential Rate',
    description: '증권사에서 해외 주식 투자 고객에게 제공하는 환전 수수료 할인 혜택입니다.',
    detail: '일반적인 은행 환전 수수료는 약 1~1.8%이지만, 증권사 환전 우대를 이용하면 90~100% 우대(거의 무료)를 받을 수 있습니다. 대부분의 증권사가 이벤트 형태로 환전 우대를 제공하므로, 해외 주식 투자 전에 환전 우대 혜택을 확인하는 것이 좋습니다.',
  },
  {
    term: '프리마켓 / 애프터마켓',
    english: 'Pre-Market / After-Hours',
    description: '미국 증시의 정규 거래 시간(한국시간 23:30~06:00, 서머타임 22:30~05:00) 전후에 이루어지는 시간외 거래입니다.',
    detail: '프리마켓은 정규장 시작 전, 애프터마켓은 정규장 종료 후의 거래 시간입니다. 시간외 거래는 거래량이 적어 스프레드(매수-매도 가격 차이)가 클 수 있으며, 급격한 가격 변동이 발생할 수 있습니다. 한국 증권사에 따라 시간외 거래 지원 범위가 다릅니다.',
  },
  {
    term: 'S&P 500',
    english: 'Standard & Poor\'s 500',
    description: '미국 대형주 500개로 구성된 주가지수로, 미국 주식 시장의 전반적인 흐름을 나타내는 대표 지수입니다.',
    detail: 'S&P 500은 시가총액 가중 방식으로 계산되며, 애플, 마이크로소프트, 아마존 등 대형 기업의 비중이 큽니다. 미국 주식 시장 전체 시가총액의 약 80%를 차지하여 시장 전체의 건강 상태를 파악하는 데 널리 사용됩니다.',
  },
];

const glossaryJsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "미국 주식 투자 용어 사전",
  description: "한국 투자자를 위한 미국 주식 투자 핵심 용어 정리",
  url: "https://mijang.vercel.app/glossary",
  inLanguage: "ko",
  hasDefinedTerm: glossaryTerms.map(({ term, english, description }) => ({
    "@type": "DefinedTerm",
    name: term,
    alternateName: english,
    description,
  })),
};

export default function GlossaryPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(glossaryJsonLd) }}
      />
      <div className="max-w-2xl mx-auto px-5 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          계산기로 돌아가기
        </Link>

        <h1 className="text-3xl font-bold mb-3">미국 주식 투자 용어 사전</h1>
        <p className="text-gray-400 mb-10">한국 투자자가 미국 주식에 투자할 때 꼭 알아야 할 핵심 용어를 쉽게 정리했습니다.</p>

        <div className="space-y-4">
          {glossaryTerms.map(({ term, english, description, detail }, i) => (
            <section key={i} className="bg-gray-900 rounded-2xl p-5">
              <div className="flex items-baseline gap-2 mb-2">
                <h2 className="text-lg font-bold text-white">{term}</h2>
                <span className="text-gray-500 text-sm">{english}</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-2">{description}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{detail}</p>
            </section>
          ))}
        </div>

        {/* 광고 */}
        <div className="mt-8">
          <AdBanner adSlot="AUTO" adFormat="auto" />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm">환율 고려한 손익분기 계산이 궁금하다면?</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-sm transition-colors">
                계산기 사용하기 →
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
