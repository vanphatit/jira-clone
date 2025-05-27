/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google avatar
      "avatars.githubusercontent.com", // nếu dùng GitHub OAuth
      "your-custom-domains.com", // thêm domain khác nếu có
    ],
  },
};

export default nextConfig;
