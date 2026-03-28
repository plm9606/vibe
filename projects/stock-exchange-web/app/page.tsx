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
      description: '지금 사면 손해일까? 환율 고려해서 계산해보기',
      openGraph: {
        title: '미장 환율 계산기',
        description: '지금 사면 손해일까? 환율 고려해서 계산해보기',
        images: [{ url: '/og_default.png', width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: '미장 환율 계산기',
        description: '지금 사면 손해일까? 환율 고려해서 계산해보기',
        images: ['/og_default.png'],
      },
    };
  }

  const title = good
    ? `${name} (${symbol}) — 지금 사도 유리해요! ✅`
    : `${name} (${symbol}) — $${breakeven} 이하로 빠져야 이득`;

  const description = good
    ? `현재가 $${price} · 환율 ${fx}원 기준, 3개월 평균 대비 이미 저렴합니다.`
    : `현재가 $${price}에서 ${drop}% 더 하락($${breakeven})해야 환율 손해를 극복합니다. 현재 환율 ${fx}원 기준.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: '/og_default.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og_default.png'],
    },
  };
}

export default function Page() {
  return (
    <Suspense>
      <StockCalculator />
    </Suspense>
  );
}
