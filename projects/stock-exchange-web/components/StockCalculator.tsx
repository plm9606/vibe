'use client';

import { AnalysisResult, analyze } from '@/lib/calculator';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis,
} from 'recharts';

interface ExchangeData { current: number; avg: number; history: Record<string, number>; }
interface StockData { symbol: string; name: string; current: number; avg: number; history: { date: string; close: number }[]; }

function fmt(n: number, digits = 0) {
  return n.toLocaleString('ko-KR', { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

const POPULAR = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'GOOGL', 'META', 'SPY'];
const PERIODS = [
  { months: 1, label: '1개월' },
  { months: 3, label: '3개월' },
  { months: 6, label: '6개월' },
  { months: 12, label: '1년' },
] as const;

export default function StockCalculator() {
  const [symbol, setSymbol] = useState('');
  const [fxMonths, setFxMonths] = useState(3);
  const [stockMonths, setStockMonths] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exchange, setExchange] = useState<ExchangeData | null>(null);
  const [stock, setStock] = useState<StockData | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const fxLabel = PERIODS.find(p => p.months === fxMonths)?.label ?? `${fxMonths}개월`;
  const stockLabel = PERIODS.find(p => p.months === stockMonths)?.label ?? `${stockMonths}개월`;

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에 symbol 파라미터가 있으면 자동 분석
  useEffect(() => {
    const sym = searchParams.get('symbol');
    if (!sym) return;
    const fxM = Number(searchParams.get('fxMonths')) || 3;
    const stM = Number(searchParams.get('stockMonths')) || 3;
    setFxMonths(fxM);
    setStockMonths(stM);
    handleAnalyze(sym, fxM, stM);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleShare() {
    if (!stock || !result || !exchange) return;
    const params = new URLSearchParams({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.current.toFixed(2),
      breakeven: result.breakEvenPriceUsd.toFixed(2),
      good: String(result.isAlreadyGood),
      drop: result.requiredDropPercent.toFixed(1),
      fx: Math.round(exchange.current).toString(),
    });
    const shareParams = new URLSearchParams({
      symbol: stock.symbol,
      fxMonths: String(fxMonths),
      stockMonths: String(stockMonths),
    });
    const url = `${window.location.origin}?${shareParams.toString()}`;
    await navigator.clipboard.writeText(url);
    router.replace(`?${params.toString()}&fxMonths=${fxMonths}&stockMonths=${stockMonths}`, { scroll: false });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function recalculate(ex: ExchangeData, st: StockData) {
    setResult(analyze({
      currentExchangeRate: ex.current,
      avgExchangeRate: ex.avg,
      currentStockPrice: st.current,
      avgStockPrice: st.avg,
    }));
  }

  async function handleAnalyze(ticker?: string, fxOverride?: number, stockOverride?: number) {
    const target = (ticker ?? symbol).trim().toUpperCase();
    if (!target) return;
    if (ticker) setSymbol(ticker);

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const [exRes, stRes] = await Promise.all([
        fetch(`/api/exchange?months=${fxOverride ?? fxMonths}`),
        fetch(`/api/stock?symbol=${target}&months=${stockOverride ?? stockMonths}`),
      ]);

      const exData = await exRes.json();
      const stData = await stRes.json();

      if (exData.error) throw new Error('환율 조회 실패: ' + exData.error);
      if (stData.error) throw new Error(`'${target}' 조회 실패: 티커를 확인해주세요`);

      const ex = { current: exData.current, avg: exData.avg, history: exData.history };
      const st = { symbol: stData.symbol, name: stData.name, current: stData.current, avg: stData.avg, history: stData.history };
      setExchange(ex);
      setStock(st);
      recalculate(ex, st);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }

  async function handleFxPeriodChange(m: number) {
    setFxMonths(m);
    if (!symbol.trim() || !stock) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/exchange?months=${m}`);
      const data = await res.json();
      if (data.error) throw new Error('환율 조회 실패: ' + data.error);
      const ex = { current: data.current, avg: data.avg, history: data.history };
      setExchange(ex);
      recalculate(ex, stock);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }

  async function handleStockPeriodChange(m: number) {
    setStockMonths(m);
    if (!symbol.trim() || !exchange) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/stock?symbol=${symbol.trim().toUpperCase()}&months=${m}`);
      const data = await res.json();
      if (data.error) throw new Error('주가 조회 실패: ' + data.error);
      const st = { symbol: data.symbol, name: data.name, current: data.current, avg: data.avg, history: data.history };
      setStock(st);
      recalculate(exchange, st);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }

  const fxPremium = result ? result.exchangeRatePremiumPercent : 0;

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">📈</div>
          <h1 className="text-2xl font-bold tracking-tight">실시간 미장 환율 계산기</h1>
          <p className="text-gray-400 text-sm mt-1">환율 고려 시 얼마나 더 빠져야 이득인지 계산</p>
        </div>

        {/* 입력 */}
        <div className="bg-gray-900 rounded-2xl p-5 mb-4">
          <label className="block text-xs text-gray-400 mb-2 font-medium uppercase tracking-widest">
            주식 티커
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-lg font-mono font-bold placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder="AAPL"
              value={symbol}
              onChange={e => setSymbol(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
              maxLength={10}
            />
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !symbol.trim()}
              className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-bold text-sm transition-colors"
            >
              {loading ? '조회중…' : '분석'}
            </button>
          </div>

          {/* 인기 종목 */}
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR.map(t => (
              <button
                key={t}
                onClick={() => handleAnalyze(t)}
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 disabled:opacity-40 text-xs font-mono font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                {t}
              </button>
            ))}
          </div>

        </div>

        {/* 에러 */}
        {error && (
          <div className="bg-red-900/40 border border-red-800 rounded-2xl p-4 mb-4 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* 로딩 스켈레톤 */}
        {loading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-900 rounded-2xl p-5 h-28" />
            ))}
          </div>
        )}

        {/* 결과 */}
        {result && exchange && stock && !loading && (
          <div className="space-y-3">

            {/* 공유 섹션 */}
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-blue-600/20 to-cyan-600/20" />
              <div className="absolute inset-0 border border-white/10 rounded-2xl" />
              <div className="relative p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">결과 공유하기</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <p className="text-white/50 text-xs mb-3 leading-relaxed">
                  링크를 열면 자동으로 같은 종목이 분석됩니다.
                </p>
                <button
                  onClick={handleShare}
                  className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                    copied
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-white/10 hover:bg-white/15 active:scale-[0.98] border border-white/15 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      링크 복사됨!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      {stock.symbol} 분석 결과 공유
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 손익분기 메인 카드 */}
            {result.isAlreadyGood ? (
              <div className="bg-gradient-to-br from-emerald-900/60 to-emerald-800/40 border border-emerald-700/50 rounded-2xl p-5">
                <div className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1">손익분기 결과</div>
                <div className="text-2xl font-bold text-emerald-300 mb-2">✅ 지금 사도 유리해요!</div>

                {/* 절감 요약 */}
                {(() => {
                  const savingsKrw = result.avgPriceKrw - result.currentPriceKrw;
                  const savingsPercent = (savingsKrw / result.avgPriceKrw) * 100;
                  const marginUsd = result.breakEvenPriceUsd - stock.current;
                  const marginPercent = (marginUsd / result.breakEvenPriceUsd) * 100;

                  return (
                    <div className="space-y-3 mt-3">
                      {/* 주당 절감 */}
                      <div className="bg-emerald-950/60 rounded-xl p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-300/70 text-xs">주당 절감 (원화)</span>
                          <span className="text-emerald-300 font-bold text-lg">-{fmt(Math.round(savingsKrw))}원</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-300/70 text-xs">{stockLabel} 평균 대비</span>
                          <span className="bg-emerald-500/20 text-emerald-300 text-sm font-bold px-2 py-0.5 rounded-lg">
                            {fmt(savingsPercent, 1)}% 저렴
                          </span>
                        </div>
                      </div>

                      {/* 원화 비교 */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-emerald-950/40 rounded-xl p-2.5 text-center">
                          <div className="text-emerald-300/50 text-[10px] mb-0.5">지금 사면</div>
                          <div className="text-emerald-200 font-bold text-sm">{fmt(result.currentPriceKrw)}원</div>
                        </div>
                        <div className="bg-emerald-950/40 rounded-xl p-2.5 text-center">
                          <div className="text-emerald-300/50 text-[10px] mb-0.5">{stockLabel} 평균</div>
                          <div className="text-emerald-200/60 font-bold text-sm">{fmt(result.avgPriceKrw)}원</div>
                        </div>
                      </div>

                      {/* 여유분 */}
                      <div className="text-emerald-200/60 text-xs leading-relaxed">
                        손익분기점 <span className="text-emerald-300 font-mono font-semibold">${fmt(result.breakEvenPriceUsd, 2)}</span>보다{' '}
                        <span className="text-emerald-300 font-semibold">${fmt(marginUsd, 2)} ({fmt(marginPercent, 1)}%)</span> 낮은 가격이라 환율 불리함을 감안해도 이득입니다.
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/40 border border-blue-700/50 rounded-2xl p-5">
                <div className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">손익분기 결과</div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-3xl font-bold">${fmt(result.breakEvenPriceUsd, 2)}</span>
                  <span className="text-gray-400 text-sm mb-1">이하로 빠져야 이득</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-red-500/20 text-red-300 text-sm font-bold px-2 py-0.5 rounded-lg">
                    -{fmt(result.requiredDropPercent, 1)}% 더 하락 필요
                  </span>
                  <span className="text-gray-500 text-xs">현재가 ${fmt(stock.current, 2)} 기준</span>
                </div>
              </div>
            )}

            {/* 환율 카드 */}
            <div className="bg-gray-900 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest">💱 환율 (USD/KRW)</div>
                <div className="flex gap-1">
                  {PERIODS.map(p => (
                    <button
                      key={p.months}
                      onClick={() => handleFxPeriodChange(p.months)}
                      disabled={loading}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors ${
                        fxMonths === p.months
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-500 hover:text-gray-300'
                      } disabled:opacity-40`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="text-gray-400 text-xs mb-1">현재 환율</div>
                  <div className="text-lg font-bold">{fmt(exchange.current)}원</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="text-gray-400 text-xs mb-1">{fxLabel} 평균</div>
                  <div className="text-lg font-bold">{fmt(exchange.avg)}원</div>
                </div>
              </div>

              {/* 환율 그래프 */}
              {(() => {
                const chartData = Object.entries(exchange.history)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([date, rate]) => ({
                    date,
                    label: date.slice(5), // MM-DD
                    rate: Math.round(rate * 100) / 100,
                  }));
                const rates = chartData.map(d => d.rate);
                const min = Math.floor(Math.min(...rates) / 10) * 10;
                const max = Math.ceil(Math.max(...rates) / 10) * 10;

                return (
                  <div className="mt-4 -mx-2">
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                        <defs>
                          <linearGradient id="fxGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="label"
                          tick={{ fill: '#6b7280', fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          interval={Math.floor(chartData.length / 5)}
                        />
                        <YAxis
                          domain={[min, max]}
                          tick={{ fill: '#6b7280', fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v: number) => fmt(v)}
                        />
                        <Tooltip
                          contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '0.75rem', fontSize: 12 }}
                          labelStyle={{ color: '#9ca3af' }}
                          formatter={(value) => [`${fmt(Number(value), 2)}원`, '환율']}
                        />
                        <ReferenceLine
                          y={exchange.avg}
                          stroke="#6b7280"
                          strokeDasharray="4 4"
                          label={{ value: '평균', fill: '#6b7280', fontSize: 10, position: 'right' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="rate"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fill="url(#fxGrad)"
                          dot={false}
                          activeDot={{ r: 4, fill: '#3b82f6' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                );
              })()}

              <div className={`mt-3 flex items-center gap-2 text-sm ${fxPremium > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                <span>{fxPremium > 0 ? '📈' : '📉'}</span>
                <span>
                  평균 대비 {fxPremium > 0 ? '+' : ''}{fmt(fxPremium, 2)}% — 환율이 {fxPremium > 0 ? '비쌉니다' : '쌉니다'}
                </span>
              </div>
            </div>

            {/* 주가 카드 */}
            <div className="bg-gray-900 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest">📊 주가</div>
                <div className="flex gap-1">
                  {PERIODS.map(p => (
                    <button
                      key={p.months}
                      onClick={() => handleStockPeriodChange(p.months)}
                      disabled={loading}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors ${
                        stockMonths === p.months
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-800 text-gray-500 hover:text-gray-300'
                      } disabled:opacity-40`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-base font-semibold mb-3 truncate">
                {stock.name} <span className="text-gray-500 font-normal">({stock.symbol})</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="text-gray-400 text-xs mb-1">현재 주가</div>
                  <div className="text-lg font-bold">${fmt(stock.current, 2)}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{fmt(result.currentPriceKrw)}원</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="text-gray-400 text-xs mb-1">{stockLabel} 평균</div>
                  <div className="text-lg font-bold">${fmt(stock.avg, 2)}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{fmt(result.avgPriceKrw)}원</div>
                </div>
              </div>

              {/* 주가 그래프 */}
              {(() => {
                const chartData = stock.history.map(d => ({
                  date: d.date,
                  label: d.date.slice(5),
                  close: Math.round(d.close * 100) / 100,
                }));
                const closes = chartData.map(d => d.close);
                const min = Math.floor(Math.min(...closes));
                const max = Math.ceil(Math.max(...closes));
                const padding = Math.max(Math.round((max - min) * 0.1), 1);

                return (
                  <div className="mt-4 -mx-2">
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                        <defs>
                          <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="label"
                          tick={{ fill: '#6b7280', fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          interval={Math.floor(chartData.length / 5)}
                        />
                        <YAxis
                          domain={[min - padding, max + padding]}
                          tick={{ fill: '#6b7280', fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v: number) => `$${fmt(v)}`}
                        />
                        <Tooltip
                          contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '0.75rem', fontSize: 12 }}
                          labelStyle={{ color: '#9ca3af' }}
                          formatter={(value) => [`$${fmt(Number(value), 2)}`, '주가']}
                        />
                        <ReferenceLine
                          y={stock.avg}
                          stroke="#6b7280"
                          strokeDasharray="4 4"
                          label={{ value: '평균', fill: '#6b7280', fontSize: 10, position: 'right' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="close"
                          stroke="#10b981"
                          strokeWidth={2}
                          fill="url(#stockGrad)"
                          dot={false}
                          activeDot={{ r: 4, fill: '#10b981' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                );
              })()}
            </div>

            {/* 계산 근거 */}
            <div className="bg-gray-900 rounded-2xl p-5">
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">🔢 계산 근거</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">{stockLabel} 평균 원화 비용</span>
                  <span className="font-mono">{fmt(result.avgPriceKrw)}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">현재 환율로 환산</span>
                  <span className="font-mono">${fmt(result.breakEvenPriceUsd, 2)}</span>
                </div>
                <div className="border-t border-gray-800 pt-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>공식</span>
                    <span>평균원화 ÷ 현재환율</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>계산</span>
                    <span>{fmt(result.avgPriceKrw)} ÷ {fmt(exchange.current)} = ${fmt(result.breakEvenPriceUsd, 2)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        <p className="text-center text-gray-600 text-xs mt-8 leading-relaxed">
          환율: Frankfurter (ECB) · 주가: Yahoo Finance<br />
          투자 판단의 참고용이며 실제 투자 조언이 아닙니다
        </p>
      </div>
    </main>
  );
}
