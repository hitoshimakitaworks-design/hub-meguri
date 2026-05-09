import type { Metadata } from 'next'
import { Inter, Dancing_Script } from 'next/font/google'
import './globals.css'
import { I18nProvider } from '@/lib/i18n'
import { HowToProvider } from '@/lib/howToContext'
import { SidebarProvider } from '@/lib/sidebarContext'
import { SearchProvider } from '@/lib/searchContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import { HowToDrawer } from '@/components/HowToDrawer'
import { HowToLayout } from '@/components/HowToLayout'
import { FeedbackWidget } from '@/components/FeedbackWidget'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  weight: ['700'],
})

export const metadata: Metadata = {
  title: 'Meguri | 無料ツール集',
  description: '請求書・シフト表・ハッシュタグなど、日々の業務をサポートする無料ツールが揃っています。Free collection of useful online tools.',
  openGraph: {
    title: 'Meguri | 無料ツール集',
    description: '請求書・シフト管理・SNS運用を無料でサポートするツール集',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${inter.variable} ${dancingScript.variable}`}>
      <body className="min-h-screen bg-gray-50 font-sans">
        {/* ───── 背景フロートブロブ（薄いパステルが浮遊する） ───── */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="bg-blob bg-blob-1"
            style={{
              top: '5%',
              left: '10%',
              width: '420px',
              height: '420px',
              background: '#bfdbfe', // パステルブルー
            }}
          />
          <div
            className="bg-blob bg-blob-2"
            style={{
              top: '40%',
              right: '5%',
              width: '500px',
              height: '500px',
              background: '#fbcfe8', // パステルピンク
            }}
          />
          <div
            className="bg-blob bg-blob-3"
            style={{
              bottom: '10%',
              left: '30%',
              width: '380px',
              height: '380px',
              background: '#fde68a', // パステルイエロー
            }}
          />
        </div>

        <div className="relative z-10">
          <I18nProvider>
            <HowToProvider>
              <SidebarProvider>
                <SearchProvider>
                  <HowToLayout>
                    <Header />
                    {children}
                    <Footer />
                  </HowToLayout>
                  <HowToDrawer />
                  <CookieBanner />
                  <FeedbackWidget />
                </SearchProvider>
              </SidebarProvider>
            </HowToProvider>
          </I18nProvider>
        </div>
      </body>
    </html>
  )
}
