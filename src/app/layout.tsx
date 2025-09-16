import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Magic Photo Editor',
  description: 'AI-powered photo editing with object detection and seamless removal',
  keywords: ['photo editor', 'AI', 'object removal', 'image editing', 'MediaPipe'],
  authors: [{ name: 'Magic Photo Editor Team' }],
  creator: 'Magic Photo Editor',
  publisher: 'Magic Photo Editor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={cn('h-full', inter.variable)}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      </head>
      <body className={cn(
        'min-h-full font-sans antialiased',
        'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900',
        'selection:bg-primary-500/20 selection:text-primary-100'
      )}>
        <div className="relative min-h-screen">
          {/* Background pattern */}
          <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzM3NDE1MSIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPHBhdGggZD0iTTMwIDMwYzAtMTYuNTY5IDEzLjQzMS0zMCAzMC0zMHMzMCAxMy40MzEgMzAgMzAtMTMuNDMxIDMwLTMwIDMwLTMwLTEzLjQzMS0zMC0zMFoiLz4KPC9nPgo8L2c+Cjwvc3ZnPg==')] opacity-20"></div>
          
          {/* Main content */}
          <main className="relative z-10">
            {children}
          </main>
          
          {/* Global toast container */}
          <div id="toast-root" className="fixed bottom-4 right-4 z-50" />
        </div>
      </body>
    </html>
  );
}