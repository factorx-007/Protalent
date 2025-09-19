/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Configuración de alias para las rutas de importación
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/app/components'),
      '@context': path.resolve(__dirname, 'src/app/context'),
      '@lib': path.resolve(__dirname, 'src/app/lib'),
    };
    return config;
  },
  images: {
    // Permitir imágenes de estos dominios
    domains: [
      'i.pravatar.cc',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    // Configuración para desarrollo
    ...(process.env.NODE_ENV === 'development' && {
      unoptimized: true
    }),
    // Configuración para producción
    ...(process.env.NODE_ENV === 'production' && {
      formats: ['image/avif', 'image/webp'],
      minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    }),
  },
  // Habilitar la compresión GZIP y Brotli
  compress: true,
};

module.exports = nextConfig;
