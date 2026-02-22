import { ImageResponse } from 'next/og';
import NextImage from 'next/image';
import janSankalpLogo from '../../public/faviconjan.png';

export const runtime = 'edge';

export const alt = 'JanSankalp AI - National Grievance Redressal System';
export const size = {
  width: 1200,
  height: 600,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
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
        {/* Logo */}
        <div
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'white',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <NextImage
            src={janSankalpLogo}
            alt="JanSankalp AI"
            width={70}
            height={70}
            style={{
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 900,
            color: 'white',
            textAlign: 'center',
            marginBottom: '16px',
            lineHeight: 1.1,
          }}
        >
          JanSankalp AI
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '24px',
            color: '#dbeafe',
            textAlign: 'center',
            marginBottom: '32px',
            fontWeight: 600,
          }}
        >
          🇮🇳 National Grievance Redressal System
        </div>

        {/* CTA */}
        <div
          style={{
            backgroundColor: 'white',
            color: '#1e40af',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '20px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          File Your Complaint Now
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
