import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const fontUrl = 'https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@latest/Subset/SpoqaHanSansNeo/SpoqaHanSansNeo-Bold.ttf';

export async function GET(request: Request) {
  const fontData = await fetch(new URL(fontUrl)).then(res => res.arrayBuffer());

  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') ?? 'STOCK';
  const name = searchParams.get('name') ?? symbol;
  const price = searchParams.get('price') ?? '0';
  const breakeven = searchParams.get('breakeven') ?? '0';
  const good = searchParams.get('good') === 'true';
  const drop = searchParams.get('drop') ?? '0';
  const fxRate = searchParams.get('fx') ?? '0';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#030712',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px',
          fontFamily: '"Spoqa Han Sans Neo"',
        }}
      >
        {/* 상단 레이블 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px' }}>📈</div>
          <div style={{ color: '#6b7280', fontSize: '20px', letterSpacing: '0.1em' }}>
            미장 환율 계산기
          </div>
        </div>

        {/* 종목명 */}
        <div style={{ color: '#f9fafb', fontSize: '52px', fontWeight: 'bold', marginBottom: '8px' }}>
          {name}
          <span style={{ color: '#6b7280', fontSize: '32px', fontWeight: 'normal', marginLeft: '16px' }}>
            {symbol}
          </span>
        </div>

        {/* 결과 */}
        {good ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(6,78,59,0.5)',
            border: '1px solid rgba(16,185,129,0.4)',
            borderRadius: '24px',
            padding: '32px 40px',
            marginTop: '24px',
          }}>
            <div style={{ color: '#6ee7b7', fontSize: '20px', letterSpacing: '0.1em', marginBottom: '8px' }}>
              손익분기 결과
            </div>
            <div style={{ color: '#a7f3d0', fontSize: '48px', fontWeight: 'bold' }}>
              ✅ 지금 사도 유리해요!
            </div>
            <div style={{ color: '#6ee7b7', fontSize: '24px', marginTop: '12px' }}>
              현재가 ${price} · 환율 {fxRate}원
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(30,27,75,0.6)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '24px',
            padding: '32px 40px',
            marginTop: '24px',
          }}>
            <div style={{ color: '#818cf8', fontSize: '20px', letterSpacing: '0.1em', marginBottom: '8px' }}>
              손익분기 결과
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
              <div style={{ color: '#f9fafb', fontSize: '64px', fontWeight: 'bold' }}>
                ${breakeven}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '28px' }}>이하로 빠져야 이득</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
              <div style={{
                background: 'rgba(239,68,68,0.2)',
                color: '#fca5a5',
                fontSize: '24px',
                fontWeight: 'bold',
                padding: '8px 20px',
                borderRadius: '12px',
              }}>
                -{drop}% 더 하락 필요
              </div>
              <div style={{ color: '#6b7280', fontSize: '20px' }}>
                현재가 ${price} · 환율 {fxRate}원
              </div>
            </div>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Spoqa Han Sans Neo',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
}
