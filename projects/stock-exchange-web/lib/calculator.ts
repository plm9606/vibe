export interface AnalysisInput {
  currentExchangeRate: number;
  avgExchangeRate: number;
  currentStockPrice: number;
  avgStockPrice: number;
}

export interface AnalysisResult {
  currentPriceKrw: number;
  avgPriceKrw: number;
  breakEvenPriceUsd: number;
  requiredDropPercent: number;
  isAlreadyGood: boolean;
  exchangeRatePremiumPercent: number;
}

export function analyze(input: AnalysisInput): AnalysisResult {
  const { currentExchangeRate, avgExchangeRate, currentStockPrice, avgStockPrice } = input;

  const avgPriceKrw = avgStockPrice * avgExchangeRate;
  const currentPriceKrw = currentStockPrice * currentExchangeRate;
  const breakEvenPriceUsd = avgPriceKrw / currentExchangeRate;
  const requiredDropPercent = ((currentStockPrice - breakEvenPriceUsd) / currentStockPrice) * 100;
  const isAlreadyGood = currentStockPrice <= breakEvenPriceUsd;
  const exchangeRatePremiumPercent = ((currentExchangeRate - avgExchangeRate) / avgExchangeRate) * 100;

  return { currentPriceKrw, avgPriceKrw, breakEvenPriceUsd, requiredDropPercent, isAlreadyGood, exchangeRatePremiumPercent };
}
