import { ImageResponse } from 'next/og';
import NextImage from 'next/image';
import janSankalpLogo from '../../public/faviconjan.png';

export const runtime = 'edge';

export const alt = 'JanSankalp AI - National Grievance Redressal System';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
          }}
        />
        
        {/* Logo */}
        <div
          style={{
            width: '120px',
            height: '120px',
            backgroundColor: 'white',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          <NextImage
            src={janSankalpLogo}
            alt="JanSankalp AI"
            width={80}
            height={80}
            style={{
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 900,
            color: 'white',
            textAlign: 'center',
            marginBottom: '16px',
            lineHeight: 1.1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          JanSankalp AI
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '32px',
            fontWeight: 600,
          }}
        >
          National Grievance Redressal System
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
              color: '#60a5fa',
              fontSize: '16px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            AI-Powered
          </div>
          <div
            style={{
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
              color: '#a78bfa',
              fontSize: '16px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Real-Time
          </div>
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
              color: '#4ade80',
              fontSize: '16px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Transparent
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '18px',
            color: '#64748b',
            fontWeight: 500,
          }}
        >
          jansankalp.gov.in
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
