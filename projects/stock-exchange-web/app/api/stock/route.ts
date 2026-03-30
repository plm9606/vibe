import { NextResponse } from 'next/server';
import axios from 'axios';
import { format, subMonths } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();
  if (!symbol) return NextResponse.json({ error: 'symbol required' }, { status: 400 });

  try {
    const months = Math.min(Math.max(Number(searchParams.get('months')) || 3, 1), 12);
    const today = new Date();
    const period1 = Math.floor(subMonths(today, months).getTime() / 1000);
    const period2 = Math.floor(today.getTime() / 1000);

    const res = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
      {
        params: { period1, period2, interval: '1d', events: 'history' },
        headers: { 'User-Agent': 'Mozilla/5.0' },
      }
    );

    const result = res.data?.chart?.result?.[0];
    if (!result) throw new Error(`'${symbol}' not found`);

    const meta = result.meta;
    const timestamps: number[] = result.timestamp ?? [];
    const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];

    const history = timestamps
      .map((ts: number, i: number) => ({ date: format(new Date(ts * 1000), 'yyyy-MM-dd'), close: closes[i] }))
      .filter((d: { date: string; close: number }) => d.close != null && !isNaN(d.close));

    if (history.length === 0) throw new Error('No price history');

    const avg = history.reduce((s: number, d: { close: number }) => s + d.close, 0) / history.length;
    const current: number = meta.regularMarketPrice ?? history[history.length - 1].close;
    const name: string = meta.longName ?? meta.shortName ?? symbol;

    return NextResponse.json({ symbol, name, current, avg, history }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
