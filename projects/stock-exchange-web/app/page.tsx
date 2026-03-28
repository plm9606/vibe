import { Metadata } from 'next';
import { Suspense } from 'react';
import StockCalculator from '@/components/StockCalculator';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const symbol = typeof params.symbol === 'string' ? params.symbol.toUpperCase() : null;
  const name = typeof params.name === 'string' ? params.name : symbol;
  const price = typeof params.price === 'string' ? params.price : null;
  const breakeven = typeof params.breakeven === 'string' ? params.breakeven : null;
  const good = params.good === 'true';
  const drop = typeof params.drop === 'string' ? params.drop : null;
  const fx = typeof params.fx === 'string' ? params.fx : null;

  if (!symbol || !price || !breakeven) {
    return {
      title: '미장 환율 계산기',
      description: '환율 고려 시 미국 주식을 얼마나 더 기다려야 이득인지 계산합니다',
      openGraph: {
        title: '미장 환율 계산기 📈',
        description: '환율 고려 시 미국 주식을 얼마나 더 기다려야 이득인지 계산합니다',
        images: ['/api/og'],
      },
      twitter: { card: 'summary_large_image' },
    };
  }

  const title = good
    ? `${name} (${symbol}) — 지금 사도 유리해요! ✅`
    : `${name} (${symbol}) — $${breakeven} 이하로 빠져야 이득`;

  const description = good
    ? `현재가 $${price} · 환율 ${fx}원 기준, 3개월 평균 대비 이미 저렴합니다.`
    : `현재가 $${price}에서 ${drop}% 더 하락($${breakeven})해야 환율 손해를 극복합니다. 현재 환율 ${fx}원 기준.`;

  const ogImageParams = new URLSearchParams({
    symbol, name: name ?? symbol, price, breakeven,
    good: String(good), drop: drop ?? '0', fx: fx ?? '0',
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`/api/og?${ogImageParams.toString()}`],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function Page() {
  return (
    <Suspense>
      <StockCalculator />
    </Suspense>
  );
}
