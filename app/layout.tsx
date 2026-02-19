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
                   block-all-mixed-content;
                   "
        />
        {/* Global Popup Killer Script - Enhanced Ad Blocking */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            // Override window.open to block popups
            var originalOpen = window.open;
            window.open = function(url, name, specs) {
              console.log('Popup blocked by Mizunime Ad-Shield:', url);
              return null;
            };

            // Block popup windows via features
            var originalWindow = window.Window;
            
            // Prevent click hijacking on links
            document.addEventListener('click', function(e) {
              var target = e.target;
              while (target && target !== document) {
                if (target.tagName === 'A' && target.target === '_blank') {
                  var href = target.href;
                  if (href && !href.includes(window.location.hostname) && 
                      !href.includes('animekompi') && 
                      !href.includes('mizunime')) {
                    console.log('External popup link blocked:', href);
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }
                target = target.parentNode;
              }
            }, true);

            // Block beforeunload popups
            window.addEventListener('beforeunload', function(e) {
              e.preventDefault();
              return '';
            }, true);

            // Block alert/confirm/prompt abuse
            var originalAlert = window.alert;
            var originalConfirm = window.confirm;
            var originalPrompt = window.prompt;
            
            window.alert = function(msg) {
              console.log('Alert blocked:', msg);
            };
            window.confirm = function(msg) {
              console.log('Confirm blocked:', msg);
              return false;
            };
            window.prompt = function(msg, input) {
              console.log('Prompt blocked:', msg);
              return null;
            };
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
