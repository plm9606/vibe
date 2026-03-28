'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  adSlot: string; // 애드센스 광고 슬롯 ID (예: "1234567890")
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
}

export default function AdBanner({ adSlot, adFormat = 'auto' }: AdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 개발 환경에서는 무시
    }
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-xl">
      <ins
        className="adsbygoogle block"
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"  // Publisher ID로 교체
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
