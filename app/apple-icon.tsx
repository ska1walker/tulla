import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
          borderRadius: '40px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="110"
          height="110"
        >
          <path d="M12 17C14.5 17 17 14 17 9V5C17 3 15 2 14 2C13 2 12 4 12 4C12 4 11 2 10 2C9 2 7 3 7 5V9C7 14 9.5 17 12 17Z" />
          <path d="M12 17C12 17 11.5 20 12 22" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
