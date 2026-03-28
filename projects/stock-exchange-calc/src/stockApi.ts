import axios from 'axios';
import { format, subMonths } from 'date-fns';

// Yahoo Finance v8 비공식 API (키 불필요)
const YAHOO_BASE = 'https://query1.finance.yahoo.com';

interface StockResult {
  symbol: string;
  name: string;
  currentPrice: number;
  threeMonthAvg: number;
  history: { date: string; close: number }[];
}

export async function fetchStockData(symbol: string): Promise<StockResult> {
  const upperSymbol = symbol.toUpperCase();

  const today = new Date();
  const threeMonthsAgo = subMonths(today, 3);

  const period1 = Math.floor(threeMonthsAgo.getTime() / 1000);
  const period2 = Math.floor(today.getTime() / 1000);

  // Yahoo Finance chart API
  const res = await axios.get(`${YAHOO_BASE}/v8/finance/chart/${upperSymbol}`, {
    params: {
      period1,
      period2,
      interval: '1d',
      events: 'history',
    },
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  });

  const result = res.data?.chart?.result?.[0];
  if (!result) {
    throw new Error(`'${upperSymbol}' 종목 데이터를 찾을 수 없습니다.`);
  }

  const meta = result.meta;
  const timestamps: number[] = result.timestamp ?? [];
  const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];

  const history = timestamps
    .map((ts, i) => ({
      date: format(new Date(ts * 1000), 'yyyy-MM-dd'),
      close: closes[i],
    }))
    .filter((d) => d.close != null && !isNaN(d.close));

  if (history.length === 0) {
    throw new Error(`'${upperSymbol}' 종목의 가격 히스토리가 없습니다.`);
  }

  const threeMonthAvg =
    history.reduce((sum, d) => sum + d.close, 0) / history.length;

  const currentPrice: number =
    meta.regularMarketPrice ?? history[history.length - 1].close;

  const name: string = meta.longName ?? meta.shortName ?? upperSymbol;

  return { symbol: upperSymbol, name, currentPrice, threeMonthAvg, history };
}
