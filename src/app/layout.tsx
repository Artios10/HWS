import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "react-hot-toast";

// TODO: replace with your app name, logo, support email, and domain
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'LaunchTime';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@launchtime.com';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} - Video Call Dating Platform`,
  description: "Connect with amazing people through video calls. Safe, fun, and premium dating experience.",
  keywords: "video dating, online dating, video calls, social platform",
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: `${APP_NAME} - Video Call Dating Platform`,
    description: "Connect with amazing people through video calls. Safe, fun, and premium dating experience.",
    url: APP_URL,
    siteName: APP_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Video Call Dating Platform`,
    description: "Connect with amazing people through video calls. Safe, fun, and premium dating experience.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
