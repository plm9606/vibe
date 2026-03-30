import { NextResponse } from 'next/server';
import axios from 'axios';
import { format, subMonths, parseISO } from 'date-fns';

// ── 메모리 캐시 (Vercel 인스턴스 내 재사용) ──────────────────────────
interface CacheEntry {
  value: number;
  date: string;   // 'YYYY-MM-DD'
  fetchedAt: number; // timestamp
}
let currentRateCache: CacheEntry | null = null;

// ── 수출입은행 API ────────────────────────────────────────────────────
const EXIM_BASE = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON';

async function fetchEximRate(dateStr: string): Promise<number | null> {
  const apiKey = process.env.EXCHANGE_KEY;
  if (!apiKey) return null;

  try {
    const res = await axios.get(EXIM_BASE, {
      params: { authkey: apiKey, searchdate: dateStr.replace(/-/g, ''), data: 'AP01' },
      timeout: 5000,
    });
    const items = res.data as Array<{ cur_unit: string; deal_bas_r: string; result: number }>;
    const usd = items.find(i => i.cur_unit === 'USD' && i.result === 1);
    if (!usd?.deal_bas_r) return null;
    return parseFloat(usd.deal_bas_r.replace(/,/g, ''));
  } catch {
    return null;
  }
}

// 당일 환율 조회 (캐시 우선, 실패 시 캐시 fallback)
async function getCurrentRate(): Promise<number> {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const nowMs = Date.now();

  // 캐시가 오늘 날짜고 1시간 이내면 그대로 사용
  if (
    currentRateCache &&
    currentRateCache.date === todayStr &&
    nowMs - currentRateCache.fetchedAt < 60 * 60 * 1000
  ) {
    return currentRateCache.value;
  }

  // 수출입은행 API 호출 시도
  const rate = await fetchEximRate(todayStr);

  if (rate) {
    currentRateCache = { value: rate, date: todayStr, fetchedAt: nowMs };
    return rate;
  }

  // 오늘 데이터 없으면 (주말·공휴일) 최근 영업일로 재시도
  for (let i = 1; i <= 5; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dStr = format(d, 'yyyy-MM-dd');
    const r = await fetchEximRate(dStr);
    if (r) {
      currentRateCache = { value: r, date: dStr, fetchedAt: nowMs };
      return r;
    }
  }

  // 모두 실패 → 캐시된 마지막 값 사용 (한도 초과 등)
  if (currentRateCache) return currentRateCache.value;

  // 최후 fallback: Frankfurter
  const fb = await axios.get('https://api.frankfurter.app/latest', {
    params: { from: 'EUR', to: 'USD,KRW' },
  });
  const fbRates = fb.data.rates as Record<string, number>;
  return fbRates['KRW'] / fbRates['USD'];
}

// ── Frankfurter: 히스토리용 ───────────────────────────────────────────
function extractUsdToKrw(rates: Record<string, Record<string, number>>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [date, rateMap] of Object.entries(rates)) {
    const usd = rateMap['USD'];
    const krw = rateMap['KRW'];
    if (usd && krw) result[date] = krw / usd;
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

    // 히스토리 + 현재 환율 병렬 조회
    const [historyRes, current] = await Promise.all([
      axios.get(`https://api.frankfurter.app/${startDate}..${endDate}`, {
        params: { from: 'EUR', to: 'USD,KRW' },
      }),
      getCurrentRate(),
    ]);

    const rates = historyRes.data.rates as Record<string, Record<string, number>>;
    const history = extractUsdToKrw(rates);

    // 오늘 환율을 히스토리에도 반영
    history[format(today, 'yyyy-MM-dd')] = current;

    const values = Object.values(history);
    if (values.length === 0) throw new Error('No exchange rate data');
    const avg = values.reduce((s, v) => s + v, 0) / values.length;

    return NextResponse.json({ current, avg, history }, {
      headers: {
        // CDN·브라우저 캐시 1시간, stale-while-revalidate 1시간
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
