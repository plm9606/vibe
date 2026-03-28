export interface AnalysisInput {
  // 환율
  currentExchangeRate: number;    // 현재 USD/KRW
  avgExchangeRate: number;        // 3개월 평균 USD/KRW

  // 주식 (USD)
  currentStockPrice: number;      // 현재 주가
  avgStockPrice: number;          // 3개월 평균 주가
}

export interface AnalysisResult {
  // 현재 시점 KRW 환산 가격
  currentPriceKrw: number;

  // 3개월 평균 KRW 환산 가격 (기준점)
  avgPriceKrw: number;

  // 현재 환율 기준, 평균 대비 손익분기 USD 주가
  //   = avgStockPrice * (avgExchangeRate / currentExchangeRate)
  breakEvenPriceUsd: number;

  // 현재 주가 대비 손익분기까지 필요한 하락률 (%)
  requiredDropPercent: number;

  // 현재 주가가 이미 손익분기 아래에 있는지 여부
  isAlreadyGood: boolean;

  // 현재 환율이 3개월 평균 대비 얼마나 비싼지 (%)
  exchangeRatePremiumPercent: number;
}

export function analyze(input: AnalysisInput): AnalysisResult {
  const {
    currentExchangeRate,
    avgExchangeRate,
    currentStockPrice,
    avgStockPrice,
  } = input;

  // 과거(평균) 기준 KRW 원가
  const avgPriceKrw = avgStockPrice * avgExchangeRate;

  // 현재 시점 KRW 환산 가격
  const currentPriceKrw = currentStockPrice * currentExchangeRate;

  // 손익분기 USD 주가: 현재 환율로 평균 KRW 원가만큼 낼 수 있는 USD 가격
  const breakEvenPriceUsd = avgPriceKrw / currentExchangeRate;

  // 손익분기까지 필요한 하락률
  const requiredDropPercent =
    ((currentStockPrice - breakEvenPriceUsd) / currentStockPrice) * 100;

  const isAlreadyGood = currentStockPrice <= breakEvenPriceUsd;

  // 환율 프리미엄
  const exchangeRatePremiumPercent =
    ((currentExchangeRate - avgExchangeRate) / avgExchangeRate) * 100;

  return {
    currentPriceKrw,
    avgPriceKrw,
    breakEvenPriceUsd,
    requiredDropPercent,
    isAlreadyGood,
    exchangeRatePremiumPercent,
  };
}
