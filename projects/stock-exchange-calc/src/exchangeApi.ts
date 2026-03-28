import axios from 'axios';
import { format, subMonths } from 'date-fns';

// Frankfurter API (ECB 기반, 무료, 키 불필요)
// USD/KRW를 직접 지원하지 않아 EUR 경유로 계산
// 대신 exchangerate.host 사용 (USD→KRW 직접 지원)
const BASE_URL = 'https://api.frankfurter.app';

interface ExchangeRateResult {
  current: number;
  threeMonthAvg: number;
  history: Record<string, number>;
}

// EUR 기준 rates에서 USD→KRW 크로스 환율 계산
function extractUsdToKrw(rates: Record<string, Record<string, number>>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [date, rateMap] of Object.entries(rates)) {
    const usd = rateMap['USD'];
    const krw = rateMap['KRW'];
    if (usd && krw) {
      result[date] = krw / usd; // 1 USD = ? KRW
    }
  }
  return result;
}

export async function fetchExchangeRate(): Promise<ExchangeRateResult> {
  const today = new Date();
  const threeMonthsAgo = subMonths(today, 3);

  const startDate = format(threeMonthsAgo, 'yyyy-MM-dd');
  const endDate = format(today, 'yyyy-MM-dd');

  // 3개월 히스토리: EUR 기준으로 USD, KRW 동시 조회 후 크로스 환율 계산
  const historyRes = await axios.get(`${BASE_URL}/${startDate}..${endDate}`, {
    params: { from: 'EUR', to: 'USD,KRW' },
  });

  const rates = historyRes.data.rates as Record<string, Record<string, number>>;
  const usdKrwHistory = extractUsdToKrw(rates);

  const values = Object.values(usdKrwHistory);
  if (values.length === 0) {
    throw new Error('환율 데이터를 가져올 수 없습니다.');
  }

  const threeMonthAvg = values.reduce((sum, v) => sum + v, 0) / values.length;

  // 최신 환율: 마지막 날짜 기준
  const sortedDates = Object.keys(usdKrwHistory).sort();
  const latestDate = sortedDates[sortedDates.length - 1];
  const current = usdKrwHistory[latestDate];

  return { current, threeMonthAvg, history: usdKrwHistory };
}
