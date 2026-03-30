import { NextResponse } from 'next/server';
import axios from 'axios';
import { format, subMonths } from 'date-fns';

function extractUsdToKrw(rates: Record<string, Record<string, number>>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [date, rateMap] of Object.entries(rates)) {
    const usd = rateMap['USD'];
    const krw = rateMap['KRW'];
    if (usd && krw) {
      result[date] = krw / usd;
    }
  }
  return result;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const months = Math.min(Math.max(Number(searchParams.get('months')) || 3, 1), 12);
    const today = new Date();
    const startDate = format(subMonths(today, months), 'yyyy-MM-dd');
    const endDate = format(today, 'yyyy-MM-dd');

    const res = await axios.get(`https://api.frankfurter.app/${startDate}..${endDate}`, {
      params: { from: 'EUR', to: 'USD,KRW' },
    });

    const rates = res.data.rates as Record<string, Record<string, number>>;
    const history = extractUsdToKrw(rates);

    const values = Object.values(history);
    if (values.length === 0) throw new Error('No exchange rate data');

    const avg = values.reduce((s, v) => s + v, 0) / values.length;

    // 최신 환율은 /latest 로 별도 조회 (당일 데이터 보장)
    const latestRes = await axios.get('https://api.frankfurter.app/latest', {
      params: { from: 'EUR', to: 'USD,KRW' },
    });
    const latestRates = latestRes.data.rates as Record<string, number>;
    const current = latestRates['KRW'] / latestRates['USD'];

    return NextResponse.json({ current, avg, history }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
