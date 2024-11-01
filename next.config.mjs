/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/api/(.*)', // для всех API-роутов
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate',
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  