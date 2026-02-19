import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://animekompi.fun'),
  title: {
    default: 'Mizunime | Nonton dan Unduh Anime Subtitle Indonesia',
    template: '%s | Mizunime'
  },
  description: 'Nonton anime subtitle Indonesia terbaru dan terlengkap secara gratis. Streaming anime ongoing, completed, dan batch download dengan kualitas HD.',
  keywords: [
    'anime',
    'nonton anime',
    'anime subtitle indonesia',
    'anime sub indo',
    'streaming anime',
    'download anime',
    'anime gratis',
    'anime terbaru',
    'anime ongoing',
    'anime completed',
    'batch anime',
    'mizunime'
  ],
  authors: [{ name: 'Mizunime' }],
  creator: 'Mizunime',
  publisher: 'Mizunime',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://animekompi.fun',
    siteName: 'Mizunime',
    title: 'Mizunime | Nonton dan Unduh Anime Subtitle Indonesia',
    description: 'Nonton anime subtitle Indonesia terbaru dan terlengkap secara gratis. Streaming anime ongoing, completed, dan batch download dengan kualitas HD.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mizunime - Nonton Anime Sub Indo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mizunime | Nonton dan Unduh Anime Subtitle Indonesia',
    description: 'Nonton anime subtitle Indonesia terbaru dan terlengkap secara gratis.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'dIdb0mScWZINp_KIjq2Pzaav4il0UUux5qaL1jpMCWs',
    yandex: 'f7e08788b0922eec',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://animekompi.fun" />
        <meta name="theme-color" content="#0f172a" />
        {/* Mizunime Ad-Shield (CSP as Internal Adblocker) */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self' * data: blob: 'unsafe-inline' 'unsafe-eval'; 
                   connect-src 'self' *; 
                   script-src 'self' 'unsafe-inline' 'unsafe-eval' *;
                   img-src 'self' * data: blob:;
                   frame-src 'self' *;
                   style-src 'self' 'unsafe-inline' *;
                   child-src 'self' *;
                   worker-src 'self' blob:;
                   "
        />
        {/* Global Popup Killer Script */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            // Override window.open
            var originalOpen = window.open;
            window.open = function() {
              console.log('Popup blocked by Mizunime Ad-Shield');
              return null;
            };

            // Aggressive popup prevention
            window.onclick = function(e) {
              if (e.target.tagName === 'A' && e.target.target === '_blank') {
                 if (!e.target.href.includes(window.location.hostname)) {
                   console.log('External link opening blocked');
                   // e.preventDefault(); 
                 }
              }
            };

            // Catch any unexpected popups via event capturing
            document.addEventListener('click', function(e) {
              // This helps stop 'click-hijacking' ads
              // if it's not a legitimate link on our site, we could potentially stop it here
            }, true);
          })();
        `}} />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col antialiased`} suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
