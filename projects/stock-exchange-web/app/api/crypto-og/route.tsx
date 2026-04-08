import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') ?? 'BTC';
  const cheaper = searchParams.get('cheaper') ?? 'binance';
  const premium = searchParams.get('premium') ?? '0';
  const savings = searchParams.get('savings') ?? '0';

  const isBinance = cheaper === 'binance';
  const exchangeName = isBinance ? '바이낸스(해외거래소)' : '업비트';
  const premiumNum = parseFloat(premium);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #030712 0%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 상단 레이블 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px' }}>🔄</div>
          <div style={{ color: '#6b7280', fontSize: '20px', letterSpacing: '0.1em' }}>
            거래소 가격 비교
          </div>
        </div>

        {/* 코인 심볼 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '64px' }}>🪙</div>
          <div style={{ color: '#f9fafb', fontSize: '56px', fontWeight: 'bold' }}>
            {symbol}
          </div>
        </div>

        {/* 결과 카드 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: isBinance ? 'rgba(6,78,59,0.5)' : 'rgba(120,53,15,0.4)',
          border: `1px solid ${isBinance ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`,
          borderRadius: '24px',
          padding: '32px 40px',
        }}>
          <div style={{
            color: isBinance ? '#a7f3d0' : '#fde68a',
            fontSize: '44px',
            fontWeight: 'bold',
            marginBottom: '16px',
          }}>
            {isBinance ? '🏦' : '🇰🇷'} {exchangeName}에서 사는게 더 싸요!
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* 절약 금액 */}
            <div style={{
              background: isBinance ? 'rgba(6,78,59,0.6)' : 'rgba(120,53,15,0.5)',
              padding: '12px 24px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{ color: '#9ca3af', fontSize: '22px' }}>가격 차이</div>
              <div style={{
                color: isBinance ? '#6ee7b7' : '#fcd34d',
                fontSize: '28px',
                fontWeight: 'bold',
              }}>
                {Number(savings).toLocaleString('ko-KR')}원
              </div>
            </div>

            {/* 김치 프리미엄 */}
            <div style={{
              background: premiumNum > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
              padding: '12px 24px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{ color: '#9ca3af', fontSize: '22px' }}>김프</div>
              <div style={{
                color: premiumNum > 0 ? '#fca5a5' : '#6ee7b7',
                fontSize: '28px',
                fontWeight: 'bold',
              }}>
                {premiumNum > 0 ? '+' : ''}{premium}%
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
