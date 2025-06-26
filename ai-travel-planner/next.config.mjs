/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false, // Remove X-Powered-By header for security

  // Environment variables that should be available on the client side
  env: {
    CUSTOM_BUILD_TIME: new Date().toISOString(),
  },

  // Image optimization configuration - MERGED YOUR DOMAINS
  images: {
    domains: [
      // Your existing domains
      "source.unsplash.com",
      "images.unsplash.com",
      "unsplash.com",
      "picsum.photos",
      // Additional domains for production
      "ui-avatars.com", // For user avatars
      "lh3.googleusercontent.com", // Google profile images
      "graph.facebook.com", // Facebook profile images
      "platform-lookaside.fbsbx.com", // Facebook CDN
      "avatars.githubusercontent.com", // GitHub avatars (if needed)
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Custom headers for security and performance
  async headers() {
    return [
      // API routes security headers
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      // General security headers
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Static assets caching
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year
          },
        ],
      },
      // Images caching
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Font caching
      {
        source: "/_next/static/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects for common patterns
  async redirects() {
    return [
      // Redirect /home to /
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      // Redirect old auth routes
      {
        source: "/login",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/auth/signup",
        permanent: true,
      },
      // Redirect API documentation
      {
        source: "/docs",
        destination: "/api/docs",
        permanent: false,
      },
    ];
  },

  // Rewrites for API proxying (if needed)
  async rewrites() {
    return [
      // Proxy external backend API calls (uncomment if using separate backend)
      // {
      //   source: '/backend-api/:path*',
      //   destination: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/:path*`,
      // },
    ];
  },

  // Handle trailing slashes
  trailingSlash: false,

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack configurations

    // Ignore certain files during build
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$/, // Ignore postgres native bindings
      })
    );

    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // Bundle analyzer (only in development when ANALYZE=true)
    if (!dev && !isServer && process.env.ANALYZE === "true") {
      try {
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "./analyze/client.html",
            openAnalyzer: false,
          })
        );
      } catch (e) {
        console.warn(
          "Bundle analyzer not available, install with: npm i -D webpack-bundle-analyzer"
        );
      }
    }

    return config;
  },

  // Experimental features
  experimental: {
    // Enable modern features
    optimizeCss: true,
    scrollRestoration: true,

    // Server components (if using App Router in future)
    // appDir: true,
  },

  // Output configuration (optimal for Vercel)
  output: "standalone",

  // Compiler options
  compiler: {
    // Remove console.logs in production (keep error and warn)
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,

    // Enable styled-components SSR
    styledComponents: true,
  },

  // Performance optimizations
  modularizeImports: {
    // Optimize react-icons imports
    "react-icons": {
      transform: "react-icons/{{member}}",
    },
    // Optimize lodash imports
    lodash: {
      transform: "lodash/{{member}}",
    },
  },

  // TypeScript configuration (if using TypeScript)
  typescript: {
    // Don't ignore type errors during build in production
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Run ESLint during build
    ignoreDuringBuilds: false,
    dirs: ["pages", "components", "lib", "src"],
  },

  // Generate build ID for cache busting
  generateBuildId: async () => {
    // Use git commit hash as build ID in production
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
      return process.env.VERCEL_GIT_COMMIT_SHA;
    }
    // Fallback to timestamp
    return `build-${Date.now()}`;
  },

  // Development only configurations
  ...(process.env.NODE_ENV === "development" && {
    // Enable React DevTools in development
    reactProductionProfiling: false,
  }),

  // Production only configurations
  ...(process.env.NODE_ENV === "production" && {
    // Optimize for production
    productionBrowserSourceMaps: false, // Disable source maps in production for security
    optimizeFonts: true,

    // Performance budgets (warnings)
    onDemandEntries: {
      // Period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 25 * 1000,
      // Number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 2,
    },
  }),
};

// Validate environment variables during build (production only)
if (process.env.NODE_ENV === "production") {
  const requiredEnvVars = ["MONGODB_URI", "NEXTAUTH_SECRET", "NEXTAUTH_URL"];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}\n` +
        "Please add these to your Vercel project settings."
    );
  }

  // Warn about optional but recommended env vars
  const recommendedEnvVars = [
    "GOOGLE_CLIENT_ID",
    "STRIPE_SECRET_KEY",
    "UNSPLASH_ACCESS_KEY",
  ];

  const missingRecommendedVars = recommendedEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingRecommendedVars.length > 0) {
    console.warn(
      `⚠️ Missing optional environment variables: ${missingRecommendedVars.join(", ")}\n` +
        "Some features may not work properly."
    );
  }
}

export default nextConfig;
