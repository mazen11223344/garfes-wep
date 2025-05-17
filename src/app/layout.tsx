import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; 
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GeminiKeySetup } from "@/components/GeminiKeySetup";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'مساعد JarvisAI',
  description: 'مساعد ذكاء اصطناعي يدعم الصوت والذاكرة وتحليل الفوركس.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`font-mono ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-black transition-colors">
            <header className="fixed top-0 w-full bg-white dark:bg-black border-b border-gold-200 dark:border-gold-800 z-40">
              <div className="container mx-auto px-4 py-2 flex justify-start">
                <ThemeToggle />
              </div>
            </header>
            <main className="pt-16">
              <GeminiKeySetup />
              {children}
            </main>
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
