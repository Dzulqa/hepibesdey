import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import OfflineIndicator from "@/components/OfflineIndicator";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fdf2f4",
};

export const metadata = {
  title: "Happy Birthday Alika",
  description: "Di hari spesial ini, aku cuma mau bilang makasih udah selalu ada, jadi diri sendiri, dan bikin hari-hariku lebih berwarna.",
  applicationName: "Alika",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Alika",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/images/barbie-icon.png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Alika" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-pink-300 selection:text-pink-900">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <PWAInstallPrompt />
        <OfflineIndicator />
      </body>
    </html>
  );
}
