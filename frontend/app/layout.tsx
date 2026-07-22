import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ESHS - operational management system',
  description:
    'Enterprise healthcare operations platform for inquiries, appointments, registration, billing, MRD and quality assurance.',
  generator: 'v0.app',
  icons: {
    icon: '/es-favicon-padded.png',
    apple: '/es-favicon-padded.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <div id="google_translate_element" className="absolute top-2 right-2 z-50 print-hide-dialog" />
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" />
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'hi,gu,mr,en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
          }
        ` }} />
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-right" className="print-hide-dialog" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
