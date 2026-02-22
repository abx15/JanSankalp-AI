/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com', 'ik.imagekit.io'],
    },
    output: 'standalone',
    async rewrites() {
        return [
            {
                source: '/ai/:path*',
                destination: process.env.AI_SERVICE_URL ? `${process.env.AI_SERVICE_URL}/:path*` : 'http://localhost:10000/:path*',
            },
        ];
    },
};

export default nextConfig;
