/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
    serverActions: { bodySizeLimit: "10mb" },
    // Pe Vercel, folderul public nu e copiat în funcțiile de server. PDF-urile (fonturi, siglă)
    // și pagina Despre noi (fotografiile echipei) citesc aceste fișiere de pe disc.
    outputFileTracingIncludes: {
      "/**/*": ["./public/fonts/**/*", "./public/logo-mark.png", "./public/images/**/*"],
    },
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }] },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
