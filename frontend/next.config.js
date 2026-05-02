/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable ESLint during build for speed
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
