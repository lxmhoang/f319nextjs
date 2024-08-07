/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    // webpack5: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback.fs = false
          config.resolve.fallback.tls = false
          config.resolve.fallback.net = false
          config.resolve.fallback.child_process = false
        }
    
        return config
      },  
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'scontent.fsgn8-4.fna.fbcdn.net',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'media.licdn.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            port: ''
          },
          {
            protocol: 'http',
            hostname: '127.0.0.1',
            port: '9199'
          },
        ],
      },
};

export default nextConfig;
