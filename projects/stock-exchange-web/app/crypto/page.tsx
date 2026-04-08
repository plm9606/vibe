import { Metadata } from 'next';
import { Suspense } from 'react';
import CryptoCompare from '@/components/CryptoCompare';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const symbol = typeof params.symbol === 'string' ? params.symbol.toUpperCase() : null;
  const cheaper = typeof params.cheaper === 'string' ? params.cheaper : null;
  const premium = typeof params.premium === 'string' ? params.premium : null;
  const savings = typeof params.savings === 'string' ? params.savings : null;

  if (!symbol || !cheaper) {
    return {
      title: '거래소 가격 비교 - 바이낸스 vs 업비트',
      description: '같은 코인, 어디서 사는 게 이득일까? 바이낸스(USDT 경유)와 업비트(원화 직접 매수)의 실시간 가격을 비교해보세요. 김치 프리미엄 확인.',
      keywords: ['김치 프리미엄', '바이낸스', '업비트', '암호화폐', '거래소 비교', 'USDT', '코인 가격 비교'],
      openGraph: {
        title: '거래소 가격 비교 - 바이낸스 vs 업비트',
        description: '다른 코인도 비교해보기',
        images: [{ url: '/og_default.png', width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: '거래소 가격 비교 - 바이낸스 vs 업비트',
        description: '다른 코인도 비교해보기',
        images: ['/og_default.png'],
      },
    };
  }

  const exchangeName = cheaper === 'binance' ? '바이낸스(해외거래소)' : '업비트';
  const title = `${symbol} 코인, 지금은 ${exchangeName}에서 사는게 더 싸요!`;
  const description = '다른 코인도 비교해보기';

  const ogParams = new URLSearchParams({ symbol, cheaper, premium: premium ?? '0', savings: savings ?? '0' });
  const ogImageUrl = `/api/crypto-og?${ogParams.toString()}`;

  return {
    title,
    description,
    keywords: ['김치 프리미엄', '바이낸스', '업비트', '암호화폐', '거래소 비교', 'USDT', symbol],
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function CryptoPage() {
  return (
    <Suspense>
      <CryptoCompare />
    </Suspense>
  );
}
