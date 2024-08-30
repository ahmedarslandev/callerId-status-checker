/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "telcastnetworks.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.paypalobjects.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "stripe.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.jazzcash.com.pk",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.icon-icons.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "w7.pngwing.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn4.iconfinder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname:
          "jazzcash.com.pk/assets/themes/jazzcash/img/mobilink_logo.png",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
