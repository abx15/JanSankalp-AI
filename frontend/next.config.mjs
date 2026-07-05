/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'ik.imagekit.io' },
        ],
    },
    output: 'standalone',
    async rewrites() {
        return [
            {
                source: '/ai/:path*',
                destination: process.env.AI_SERVICE_URL ? `${process.env.AI_SERVICE_URL}/:path*` : 'http://localhost:10000/:path*',
            },
            {
                source: '/utils/:path*',
                destination: process.env.NODE_SERVICES_URL ? `${process.env.NODE_SERVICES_URL}/utils/:path*` : 'http://localhost:3001/utils/:path*',
            },
            // Proxy all API paths (except local NextAuth) to NestJS Gateway
            {
                source: '/api/complaints/:path*',
                destination: 'http://localhost:3000/api/complaints/:path*',
            },
            {
                source: '/api/budget/:path*',
                destination: 'http://localhost:3000/api/budget/:path*',
            },
            {
                source: '/api/sovereign/:path*',
                destination: 'http://localhost:3000/api/sovereign/:path*',
            },
            {
                source: '/api/user/:path*',
                destination: 'http://localhost:3000/api/user/:path*',
            },
            {
                source: '/api/notifications/:path*',
                destination: 'http://localhost:3000/api/notifications/:path*',
            },
            {
                source: '/api/admin/:path*',
                destination: 'http://localhost:3000/api/admin/:path*',
            },
        ];
    },
};

export default nextConfig;
