import { Metadata } from 'next';
import { Suspense } from 'react';
import CryptoCompare from '@/components/CryptoCompare';

export const metadata: Metadata = {
  title: '거래소 가격 비교 - 바이낸스 vs 업비트',
  description: '같은 코인, 어디서 사는 게 이득일까? 바이낸스(USDT 경유)와 업비트(원화 직접 매수)의 실시간 가격을 비교해보세요. 김치 프리미엄 확인.',
  keywords: ['김치 프리미엄', '바이낸스', '업비트', '암호화폐', '거래소 비교', 'USDT', '코인 가격 비교'],
  openGraph: {
    title: '거래소 가격 비교 - 바이낸스 vs 업비트',
    description: '같은 코인, 어디서 사는 게 이득일까? 실시간 김치 프리미엄 확인',
    images: [{ url: '/og_default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '거래소 가격 비교 - 바이낸스 vs 업비트',
    description: '같은 코인, 어디서 사는 게 이득일까? 실시간 김치 프리미엄 확인',
    images: ['/og_default.png'],
  },
};

export default function CryptoPage() {
  return (
    <Suspense>
      <CryptoCompare />
    </Suspense>
  );
}
