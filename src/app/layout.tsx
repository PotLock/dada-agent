import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletSelectorProvider } from '@/contexts/WalletSelectorContext'

const inter = Inter({ subsets: ['latin'] })
import "@near-wallet-selector/modal-ui/styles.css";

export const metadata: Metadata = {
  title: 'Dollar-A-Day Donation Agent (DADA)',
  description: 'A fully autonomous NEAR-powered donation agent that donates $1/day to Potlock campaigns based on user preferences.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletSelectorProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </WalletSelectorProvider>
      </body>
    </html>
  )
} 