/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer", "imapflow", "mailparser"],
    serverActions: { bodySizeLimit: "10mb" },
    // Pe Vercel, folderul public nu e copiat în funcțiile de server. PDF-urile (fonturi, siglă)
    // și pagina Despre noi (fotografiile echipei) citesc aceste fișiere de pe disc.
    outputFileTracingIncludes: {
      "/**/*": [
        "./public/fonts/**/*",
        "./public/logo-mark.png",
        "./public/images/**/*",
        // Biblioteca PDF încarcă dinamic fonturile standard și tabelele de date; Vercel nu le detectează singur.
        "./node_modules/pdfkit/js/standard-fonts/**/*",
        "./node_modules/pdfkit/js/data/**/*",
      ],
    },
  },
  // Site-ul afișează imaginile direct (<img>), fără optimizatorul Next.js. Îl dezactivăm complet,
  // pentru că în Next 14 are vulnerabilități critice reparate doar în versiunile 15.5+ / 16.
  images: { unoptimized: true, remotePatterns: [] },
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
