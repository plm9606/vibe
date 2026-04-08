import { NextResponse } from 'next/server';
import axios from 'axios';

// ── Upbit API ────────────────────────────────────────────────────────
async function fetchUpbitPrice(symbol: string): Promise<{ krwPrice: number; usdtKrw: number }> {
  const markets = [`KRW-${symbol}`, 'KRW-USDT'];
  const res = await axios.get('https://api.upbit.com/v1/ticker', {
    params: { markets: markets.join(',') },
    timeout: 5000,
  });

  const items = res.data as Array<{ market: string; trade_price: number }>;
  const coin = items.find(i => i.market === `KRW-${symbol}`);
  const usdt = items.find(i => i.market === 'KRW-USDT');

  if (!coin) throw new Error(`업비트에서 ${symbol} 마켓을 찾을 수 없습니다`);
  if (!usdt) throw new Error('업비트 USDT 시세를 조회할 수 없습니다');

  return { krwPrice: coin.trade_price, usdtKrw: usdt.trade_price };
}

// ── Binance API (+ CryptoCompare 폴백) ──────────────────────────────
async function fetchGlobalUsdtPrice(symbol: string): Promise<{ price: number; source: string }> {
  // 1차: Binance API
  try {
    const res = await axios.get('https://api.binance.com/api/v3/ticker/price', {
      params: { symbol: `${symbol}USDT` },
      timeout: 5000,
    });
    const price = parseFloat(res.data.price);
    if (price && !isNaN(price)) return { price, source: 'Binance' };
  } catch {
    // Binance 실패 (451 지역 차단 등) → 폴백
  }

  // 2차: CryptoCompare API (지역 제한 없음)
  try {
    const res = await axios.get('https://min-api.cryptocompare.com/data/price', {
      params: { fsym: symbol, tsyms: 'USDT' },
      timeout: 5000,
    });
    const price = res.data?.USDT;
    if (price && !isNaN(price)) return { price, source: 'CryptoCompare' };
  } catch {
    // CryptoCompare도 실패
  }

  throw new Error(`${symbol}/USDT 글로벌 시세를 조회할 수 없습니다`);
}

// ── Upbit 마켓 목록에서 KRW 마켓 코인 검색 ──────────────────────────
async function searchUpbitMarkets(query: string): Promise<Array<{ symbol: string; name: string }>> {
  const res = await axios.get('https://api.upbit.com/v1/market/all', {
    params: { isDetails: false },
    timeout: 5000,
  });

  const markets = res.data as Array<{ market: string; korean_name: string; english_name: string }>;
  const krwMarkets = markets.filter(m => m.market.startsWith('KRW-'));

  const q = query.toUpperCase();
  return krwMarkets
    .filter(m => {
      const sym = m.market.replace('KRW-', '');
      return sym.includes(q) || m.korean_name.includes(query) || m.english_name.toUpperCase().includes(q);
    })
    .slice(0, 10)
    .map(m => ({ symbol: m.market.replace('KRW-', ''), name: m.korean_name }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();
  const action = searchParams.get('action');

  // 마켓 검색
  if (action === 'search') {
    const query = searchParams.get('q') ?? '';
    if (!query.trim()) return NextResponse.json({ results: [] });
    try {
      const results = await searchUpbitMarkets(query);
      return NextResponse.json({ results });
    } catch {
      return NextResponse.json({ results: [] });
    }
  }

  // 가격 비교
  if (!symbol) return NextResponse.json({ error: 'symbol required' }, { status: 400 });

  try {
    const [upbit, global] = await Promise.all([
      fetchUpbitPrice(symbol),
      fetchGlobalUsdtPrice(symbol),
    ]);

    // 경로 A: 원화 → USDT(업비트) → 해외 거래소에서 코인 매수
    const binanceKrwCost = global.price * upbit.usdtKrw;

    // 경로 B: 업비트에서 원화로 직접 매수
    const upbitKrwCost = upbit.krwPrice;

    // 김치 프리미엄 = (업비트 원화가 - 바이낸스 원화환산가) / 바이낸스 원화환산가 × 100
    const kimchiPremium = ((upbitKrwCost - binanceKrwCost) / binanceKrwCost) * 100;

    // 어디가 더 싼지
    const cheaper = binanceKrwCost < upbitKrwCost ? 'binance' : 'upbit';
    const savings = Math.abs(upbitKrwCost - binanceKrwCost);

    return NextResponse.json({
      symbol,
      upbit: {
        krwPrice: upbitKrwCost,
      },
      binance: {
        usdtPrice: global.price,
        usdtKrw: upbit.usdtKrw,
        krwPrice: binanceKrwCost,
        source: global.source,
      },
      kimchiPremium,
      cheaper,
      savings,
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : '알 수 없는 오류';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
