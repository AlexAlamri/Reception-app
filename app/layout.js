import './globals.css';

export const metadata = {
  title: 'Reception Triage Guide',
  description: 'Clinical triage navigation tool for GP reception staff',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Triage Guide',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0A0F',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ background: '#0A0A0F' }} className="min-h-screen">
        <div className="noise-overlay" />
        <div className="ambient-bg" />
        {children}
      </body>
    </html>
  );
}
