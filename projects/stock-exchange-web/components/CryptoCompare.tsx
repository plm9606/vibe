'use client';

import { useState } from 'react';
import TabNav from '@/components/TabNav';

interface CryptoResult {
  symbol: string;
  upbit: { krwPrice: number };
  binance: { usdtPrice: number; usdtKrw: number; krwPrice: number; source?: string };
  kimchiPremium: number;
  cheaper: 'binance' | 'upbit';
  savings: number;
}

interface SearchResult {
  symbol: string;
  name: string;
}

function fmt(n: number, digits = 0) {
  return n.toLocaleString('ko-KR', { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

const POPULAR_COINS = ['BTC', 'ETH', 'XRP', 'SOL', 'DOGE', 'ADA', 'AVAX', 'LINK'];

export default function CryptoCompare() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CryptoResult | null>(null);
  const [coinName, setCoinName] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  async function handleSearch(query: string) {
    setSymbol(query.toUpperCase());
    if (query.trim().length < 1) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }
    try {
      const res = await fetch(`/api/crypto?action=search&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results ?? []);
      setShowSearch(data.results?.length > 0);
    } catch {
      setSearchResults([]);
    }
  }

  async function handleCompare(ticker?: string, name?: string) {
    const target = (ticker ?? symbol).trim().toUpperCase();
    if (!target) return;
    if (ticker) setSymbol(ticker);
    if (name) setCoinName(name);
    setShowSearch(false);

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/crypto?symbol=${target}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      if (!name) setCoinName(target);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }

  const isBinanceCheaper = result?.cheaper === 'binance';

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* 탭 네비게이션 */}
        <TabNav />

        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold tracking-tight">바이낸스 vs 업비트, 어디서 사는 게 이득일까?</h1>
        </div>

        {/* 입력 */}
        <div className="bg-gray-900 rounded-2xl p-5 mb-4">
          <label className="block text-xs text-gray-400 mb-2 font-medium uppercase tracking-widest">
            코인 심볼
          </label>
          <div className="relative">
            <div className="flex gap-2">
              <input
                className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-lg font-mono font-bold placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="BTC"
                value={symbol}
                onChange={e => handleSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setShowSearch(false);
                    handleCompare();
                  }
                }}
                onFocus={() => searchResults.length > 0 && setShowSearch(true)}
                maxLength={10}
              />
              <button
                onClick={() => { setShowSearch(false); handleCompare(); }}
                disabled={loading || !symbol.trim()}
                className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-bold text-sm transition-colors"
              >
                {loading ? '조회중…' : '비교'}
              </button>
            </div>

            {/* 검색 드롭다운 */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map(r => (
                  <button
                    key={r.symbol}
                    onClick={() => handleCompare(r.symbol, r.name)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-700 transition-colors flex items-center gap-3"
                  >
                    <span className="font-mono font-bold text-sm text-blue-400">{r.symbol}</span>
                    <span className="text-gray-300 text-sm truncate">{r.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 인기 코인 */}
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR_COINS.map(t => (
              <button
                key={t}
                onClick={() => handleCompare(t, '')}
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
        {result && !loading && (
          <div className="space-y-3">

            {/* 메인 결과 카드 */}
            <div className={`bg-gradient-to-br ${
              isBinanceCheaper
                ? 'from-emerald-900/60 to-emerald-800/40 border-emerald-700/50'
                : 'from-amber-900/60 to-orange-800/40 border-amber-700/50'
            } border rounded-2xl p-5`}>
              <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                isBinanceCheaper ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                비교 결과
              </div>
              <div className={`text-2xl font-bold mb-2 ${
                isBinanceCheaper ? 'text-emerald-300' : 'text-amber-300'
              }`}>
                {isBinanceCheaper
                  ? '🏦 바이낸스 경유가 더 저렴!'
                  : '🇰🇷 업비트 직접 구매가 더 저렴!'}
              </div>
              <div className="space-y-2 mt-3">
                <div className={`${isBinanceCheaper ? 'bg-emerald-950/60' : 'bg-amber-950/60'} rounded-xl p-3`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${isBinanceCheaper ? 'text-emerald-300/70' : 'text-amber-300/70'}`}>
                      가격 차이
                    </span>
                    <span className={`font-bold text-lg ${isBinanceCheaper ? 'text-emerald-300' : 'text-amber-300'}`}>
                      {fmt(Math.round(result.savings))}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs ${isBinanceCheaper ? 'text-emerald-300/70' : 'text-amber-300/70'}`}>
                      김치 프리미엄
                    </span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${
                      result.kimchiPremium > 0
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {result.kimchiPremium > 0 ? '+' : ''}{fmt(result.kimchiPremium, 2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 경로 비교 상세 */}
            <div className="bg-gray-900 rounded-2xl p-5">
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">
                💰 {coinName || result.symbol} 1개 매수 비용
              </div>

              {/* 경로 A: 바이낸스 */}
              <div className={`rounded-xl p-4 mb-3 ${
                isBinanceCheaper
                  ? 'bg-emerald-950/40 border border-emerald-800/40'
                  : 'bg-gray-800'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold">🏦 해외 거래소 경유</span>
                  {isBinanceCheaper && (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      저렴
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>① 원화 → USDT</span>
                    <span className="font-mono">1 USDT = {fmt(result.binance.usdtKrw)}원</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>② USDT → {result.symbol}</span>
                    <span className="font-mono">{fmt(result.binance.usdtPrice, 4)} USDT</span>
                  </div>
                  <div className="border-t border-gray-700/50 pt-2 flex justify-between">
                    <span className="font-semibold">총 비용 (원)</span>
                    <span className="font-mono font-bold text-lg">{fmt(Math.round(result.binance.krwPrice))}원</span>
                  </div>
                </div>
              </div>

              {/* 경로 B: 업비트 */}
              <div className={`rounded-xl p-4 ${
                !isBinanceCheaper
                  ? 'bg-amber-950/40 border border-amber-800/40'
                  : 'bg-gray-800'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold">🇰🇷 업비트 직접 구매</span>
                  {!isBinanceCheaper && (
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      저렴
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>원화 → {result.symbol}</span>
                    <span className="font-mono">직접 매수</span>
                  </div>
                  <div className="border-t border-gray-700/50 pt-2 flex justify-between">
                    <span className="font-semibold">총 비용 (원)</span>
                    <span className="font-mono font-bold text-lg">{fmt(Math.round(result.upbit.krwPrice))}원</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 계산 근거 */}
            <div className="bg-gray-900 rounded-2xl p-5">
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">🔢 계산 근거</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">바이낸스 {result.symbol} 가격</span>
                  <span className="font-mono">{fmt(result.binance.usdtPrice, 4)} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">업비트 USDT/KRW</span>
                  <span className="font-mono">{fmt(result.binance.usdtKrw)}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">바이낸스 경유 원화 환산</span>
                  <span className="font-mono">{fmt(Math.round(result.binance.krwPrice))}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">업비트 직접 구매가</span>
                  <span className="font-mono">{fmt(Math.round(result.upbit.krwPrice))}원</span>
                </div>
                <div className="border-t border-gray-800 pt-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>김치 프리미엄 공식</span>
                    <span>(업비트가 - 바이낸스환산가) ÷ 바이낸스환산가</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 안내 */}
            <div className="bg-gray-900/60 rounded-2xl p-4 text-xs text-gray-500 leading-relaxed">
              ※ 실시간 시세 기준이며, 실제 거래 시 수수료·슬리피지·송금 비용이 추가될 수 있습니다.
              USDT/KRW 가격은 업비트 기준입니다.
            </div>
          </div>
        )}

        {/* 소개 콘텐츠 */}
        <section className="mt-10 bg-gray-900 rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-bold">거래소 가격 비교란?</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            같은 암호화폐라도 거래소마다 가격이 다릅니다. 한국 거래소(업비트)에서 원화로 직접 사는 것과,
            원화로 USDT를 사서 해외 거래소(바이낸스)에서 매수하는 것의 실질 비용을 비교해보세요.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-white">김치 프리미엄</strong>이란 한국 거래소의 코인 가격이 해외 거래소 대비 얼마나 비싼지를 나타내는 지표입니다.
            프리미엄이 높을수록 해외 거래소 경유가 유리할 수 있습니다.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-gray-800 rounded-xl p-3 text-center">
              <div className="text-blue-400 text-xl mb-1">🏦</div>
              <div className="text-xs text-gray-400">해외 거래소</div>
              <div className="text-sm font-semibold mt-0.5">Binance</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-3 text-center">
              <div className="text-amber-400 text-xl mb-1">🇰🇷</div>
              <div className="text-xs text-gray-400">국내 거래소</div>
              <div className="text-sm font-semibold mt-0.5">Upbit</div>
            </div>
          </div>
        </section>

        <p className="text-center text-gray-600 text-xs mt-8 leading-relaxed">
          시세: {result?.binance.source ?? 'Binance'} · Upbit (실시간)
        </p>
      </div>
    </main>
  );
}
