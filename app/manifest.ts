import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'maiflow - Kampagnenplanung',
    short_name: 'maiflow',
    description: 'Der visuelle Kampagnenplaner für Marketing-Teams',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF9',
    theme_color: '#F43F5E',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
