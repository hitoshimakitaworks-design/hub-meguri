import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Meguri | 無料ツール集'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at center, #1e40af 0%, #2563eb 47%, #5eead4 78%, #67e8f9 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-2px',
              textShadow: '0 2px 16px rgba(15,23,42,0.5)',
            }}
          >
            Meguri
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.92)',
              textShadow: '0 1px 8px rgba(15,23,42,0.4)',
            }}
          >
            無料ツール集
          </div>
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.80)',
              marginTop: 8,
              textShadow: '0 1px 6px rgba(15,23,42,0.4)',
            }}
          >
            15の便利ツールが、すべて完全無料。
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
